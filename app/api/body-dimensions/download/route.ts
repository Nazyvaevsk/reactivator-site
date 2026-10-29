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
  const deadline = Date.now() + 60_000;
  let totalBytes = 0;

  try {
    for (const sheet of group.sheets) {
      if (Date.now() >= deadline) throw new Error("Download deadline exceeded");
      const sheetFile = sheet.assetKey.replace(/\\/g, "/").split("/").pop()!;
      const key = getSheetObjectKey(group, sheetFile);
      const content = key ? await readR2Sheet(key, Math.max(1, Math.min(15_000, deadline - Date.now()))) : null;
      if (!content) return new NextResponse("Лист не найден", { status: 404 });
      totalBytes += content.byteLength;
      if (totalBytes > 128 * 1024 * 1024) throw new Error("Archive size limit exceeded");
      zip.addFile(sheetFile, Buffer.from(content));
    }
  } catch {
    return new NextResponse("Хранилище временно недоступно", {
      status: 503, headers: { "Cache-Control": "private, no-store" },
    });
  }

  // Stored SVG files avoid synchronous compression monopolising the Node event loop.
  for (const entry of zip.getEntries()) entry.header.method = 0;
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
