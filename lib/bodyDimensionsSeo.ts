export type PublicBodyGroup = {
  groupId: string;
  make: string;
  model: string;
  year: string;
  variant: string;
  sheetCount: number;
  sheets: {
    sheet: number;
    cardId: string;
    sourceType: string;
    sourcePage: number;
    assetKey: string;
  }[];
};

export const BODY_SITE_URL = "https://www.reactivator55.ru";

export function bodyGroupPath(group: PublicBodyGroup, sheet?: number) {
  return "/body-dimensions/" + group.groupId.toLowerCase() + (sheet === undefined ? "" : "/" + sheet);
}

export function bodySeo(group: PublicBodyGroup, sheet?: number) {
  const vehicle = [group.make, group.model, group.year].filter(Boolean).join(" ");
  const variant = group.variant ? " (" + group.variant + ")" : "";
  const identity = vehicle + variant + " — " + group.groupId;
  const heading = sheet === undefined
    ? "Кузовные размеры " + identity
    : "Контрольные размеры " + identity + ", лист " + sheet;
  const description = sheet === undefined
    ? "Контрольные размеры кузова " + vehicle + variant + ". Комплект " + group.groupId + ", листов: " + group.sheetCount + ". Превью схем для проверки геометрии кузова."
    : "Контрольные размеры кузова " + vehicle + variant + ": лист " + sheet + " из " + group.sheetCount + ", комплект " + group.groupId + ". Превью схемы и переход к другим листам комплекта.";
  return { heading, description, canonical: BODY_SITE_URL + bodyGroupPath(group, sheet) };
}
