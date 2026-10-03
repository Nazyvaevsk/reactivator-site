import { rateLimit, withCapacity } from "@/lib/rateLimit";
import { readR2Sheet } from "@/lib/bodyDimensionsR2";
import { NextRequest, NextResponse } from "next/server";


import AdmZip from "adm-zip";
import { verifyBodyAccess } from "@/lib/bodyAccess";
import {
  getBodyDimensionsGroup,
  getSheetObjectKey,
} from "@/lib/bodyDimensionsData";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  return withCapacity("download", 2, () => serve(request));
}

async function serve(request: NextRequest) {
  const limited = rateLimit(request, "download", 5, 10 * 60_000, 50);
  if (limited) return limited;
  const { searchParams } = new URL(request.url);

  const groupId = searchParams.get("group") ?? "";
  const exp = searchParams.get("exp") ?? "";
  const sig = request.headers.get("authorization")?.replace(/^Bearer /, "") ?? searchParams.get("sig") ?? "";

  if (!verifyBodyAccess(groupId, exp, sig)) {
    return new NextResponse("Доступ запрещён", { status: 403 });
  }

  const group = getBodyDimensionsGroup(groupId);

  if (!group) {
    return new NextResponse("Комплект не найден", { status: 404 });
  }

  const zip = new AdmZip();

  try {
    for (const sheet of group.sheets) {
      const sheetFile = sheet.assetKey.replace(/\\/g, "/").split("/").pop()!;
      const key = getSheetObjectKey(group, sheetFile);
      const content = key ? await readR2Sheet(key) : null;
      if (!content) return new NextResponse("Лист не найден", { status: 404 });
      zip.addFile(sheetFile, Buffer.from(content));
    }
  } catch {
    return new NextResponse("Хранилище временно недоступно", {
      status: 503, headers: { "Cache-Control": "private, no-store" },
    });
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
