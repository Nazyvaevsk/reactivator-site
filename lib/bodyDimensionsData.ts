import fs from "fs";
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

export function getPrivateSheetPath(
  group: BodyDimensionsGroup,
  sheetFile: string
): string | null {
  const sheet = group.sheets.find(
    (item) => path.basename(item.assetKey) === sheetFile
  );

  if (!sheet) {
    return null;
  }

  const relativeAsset = sheet.assetKey.replace(/^groups[\\/]/i, "");

  const privateRoot = path.resolve(
    process.cwd(),
    "private",
    "body-dimensions"
  );

  const filePath = path.resolve(privateRoot, relativeAsset);

  if (
    filePath !== privateRoot &&
    !filePath.startsWith(privateRoot + path.sep)
  ) {
    return null;
  }

  return filePath;
}
