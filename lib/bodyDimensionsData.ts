import "server-only";
﻿import fs from "fs";
import path from "path";

export type BodyDimensionsGroup = {
  groupId: string;
  make: string;
  model: string;
  year: string;
  variant?: string;
  sheetCount: number;
  sheets: {
    sheet: number;
    sourceSheet: number;
    cardId: string;
    sourceType: string;
    sourcePage: number;
    assetKey: string;
  }[];
};

type AccessIndex = {
  schemaVersion: number;
  groupCount: number;
  groups: Record<string, BodyDimensionsGroup>;
};

const accessIndexPath = path.join(
  process.cwd(),
  "private",
  "body-dimensions",
  "access-index.json"
);

let cachedIndex: AccessIndex | null = null;

function getAccessIndex(): AccessIndex | null {
  if (cachedIndex) {
    return cachedIndex;
  }

  if (!fs.existsSync(accessIndexPath)) {
    return null;
  }

  try {
    cachedIndex = JSON.parse(
      fs.readFileSync(accessIndexPath, "utf8")
    ) as AccessIndex;

    return cachedIndex;
  } catch {
    return null;
  }
}

export function getBodyDimensionsGroup(
  groupId: string
): BodyDimensionsGroup | null {
  if (!/^[A-Za-z0-9_-]+$/.test(groupId)) {
    return null;
  }

  const index = getAccessIndex();

  if (!index) {
    return null;
  }

  return index.groups[groupId.toUpperCase()] ?? null;
}

export function getSheetObjectKey(
  group: BodyDimensionsGroup,
  sheetFile: string
): string | null {
  const sheet = group.sheets.find(
    (item) => item.assetKey.replace(/\\/g, "/").split("/").pop() === sheetFile
  );
  if (!sheet) return null;
  const key = sheet.assetKey.replace(/\\/g, "/");
  const parts = key.split("/");
  if (parts[0] !== "groups" || parts.some((part) => !part || part === "." || part === "..")) {
    return null;
  }
  return key;
}
