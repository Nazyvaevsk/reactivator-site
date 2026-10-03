import { rateLimit, withCapacity } from "@/lib/rateLimit";
import { readR2Sheet } from "@/lib/bodyDimensionsR2";
import { NextRequest, NextResponse } from "next/server";


import { verifyBodyAccess } from "@/lib/bodyAccess";
import {
  getBodyDimensionsGroup,
  getSheetObjectKey,
} from "@/lib/bodyDimensionsData";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  return withCapacity("sheet", 16, () => serve(request));
}

async function serve(request: NextRequest) {
  const limited = rateLimit(request, "sheet", 120, 60_000, 1200);
  if (limited) return limited;
  const { searchParams } = new URL(request.url);

  const groupId = searchParams.get("group") ?? "";
  const exp = searchParams.get("exp") ?? "";
  const sig = request.headers.get("authorization")?.replace(/^Bearer /, "") ?? searchParams.get("sig") ?? "";
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

  const key = getSheetObjectKey(group, sheetFile);
  if (!key) return new NextResponse("Лист не найден", { status: 404 });
  let svg: Uint8Array;
  try {
    const result = await readR2Sheet(key);
    if (!result) return new NextResponse("Лист не найден", { status: 404 });
    svg = result;
  } catch {
    return new NextResponse("Хранилище временно недоступно", {
      status: 503, headers: { "Cache-Control": "private, no-store" },
    });
  }

  return new NextResponse(new Uint8Array(svg), {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
