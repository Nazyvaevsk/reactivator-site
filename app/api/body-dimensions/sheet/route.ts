import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
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
  const sheetFile = searchParams.get("sheet") ?? "";

  if (!verifyBodyAccess(groupId, exp, sig)) {
    return new NextResponse("Доступ запрещён", { status: 403 });
  }

  if (!/^sheet_\d{3}\.svg$/i.test(sheetFile)) {
    return new NextResponse("Некорректный файл", { status: 400 });
  }

  const group = getBodyDimensionsGroup(groupId);

  if (!group) {
    return new NextResponse("Комплект не найден", { status: 404 });
  }

  const filePath = getPrivateSheetPath(group, sheetFile);

  if (!filePath || !fs.existsSync(filePath)) {
    return new NextResponse("Лист не найден", { status: 404 });
  }

  const svg = fs.readFileSync(filePath, "utf8");

  return new NextResponse(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
