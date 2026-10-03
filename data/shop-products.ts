import type { ShopCategory, ShopProduct } from "@/types/shop";

export const shopCategories: readonly ShopCategory[] = [
  {
    id: "pdr",
    name: "PDR",
    description: "Инструмент для удаления вмятин без окраски.",
    number: "01",
  },
  {
    id: "body-tools",
    name: "Кузовной инструмент",
    description: "Инструмент для правки и восстановления элементов кузова.",
    number: "02",
  },
  {
    id: "measuring",
    name: "Измерение",
    description: "Контроль размеров, геометрии и положения кузовных элементов.",
    number: "03",
  },
  {
    id: "workshop",
    name: "Оснащение мастерской",
    description: "Оборудование и принадлежности для рабочего пространства.",
    number: "04",
  },
];

// Add only confirmed products, numeric prices in RUB and real product photos.
// Do not use generated images, category illustrations or repair photos here.
// The catalog stays empty until the actual assortment and photos are provided.
export const shopProducts: readonly ShopProduct[] = [];
