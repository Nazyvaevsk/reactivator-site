import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import AdmZip from "adm-zip";
import { verifyBodyAccess } from "@/lib/bodyAccess";
import {
  getBodyDimensionsGroup,
  getPrivateSheetPath,
} from "@/lib/bodyDimensionsData";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const groupId = searchParams.get("group") ?? "";
  const exp = searchParams.get("exp") ?? "";
  const sig = searchParams.get("sig") ?? "";

  if (!verifyBodyAccess(groupId, exp, sig)) {
    return new NextResponse("Доступ запрещён", { status: 403 });
  }

  const group = getBodyDimensionsGroup(groupId);

  if (!group) {
    return new NextResponse("Комплект не найден", { status: 404 });
  }

  const zip = new AdmZip();

  for (const sheet of group.sheets) {
    const sheetFile = path.basename(sheet.assetKey);
    const filePath = getPrivateSheetPath(group, sheetFile);

    if (!filePath || !fs.existsSync(filePath)) {
      return new NextResponse(
        `Не найден ${sheetFile}`,
        { status: 404 }
      );
    }

    zip.addLocalFile(filePath);
  }

  const buffer = zip.toBuffer();
  const body = new Uint8Array(buffer);

  const safeMake = group.make.replace(/[^A-Za-z0-9_-]+/g, "-");
  const safeModel = group.model.replace(/[^A-Za-z0-9_-]+/g, "-");
  const safeYear = String(group.year).replace(/[^A-Za-z0-9_-]+/g, "-");

  const filename =
    `${safeMake}-${safeModel}-${safeYear}-${group.groupId}.zip`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
