import "server-only";

import { shopCategories, shopProducts } from "@/data/shop-products";
import type { ShopCategoryId } from "@/types/shop";

export function getShopCategories() {
  return shopCategories.map((category) => ({
    ...category,
    productCount: shopProducts.filter((product) => product.categoryId === category.id).length,
  }));
}

export function getShopCategory(id: string) {
  return shopCategories.find((category) => category.id === id);
}

export function getShopProducts(categoryId?: ShopCategoryId) {
  return shopProducts.filter((product) => !categoryId || product.categoryId === categoryId);
}
