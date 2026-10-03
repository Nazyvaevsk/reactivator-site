export type ShopCategoryId = "pdr" | "body-tools" | "measuring" | "workshop";

export type ShopCategory = Readonly<{
  id: ShopCategoryId;
  name: string;
  description: string;
  number: string;
}>;

export type ShopProduct = Readonly<{
  id: string;
  name: string;
  categoryId: ShopCategoryId;
  description: string;
  /** Price in rubles, without formatting. */
  price: number;
  /** A real photograph of this exact product, stored under public/shop/products/. */
  image: Readonly<{
    src: `/shop/products/${string}`;
    alt: string;
  }>;
  availability: "in-stock" | "on-request" | "out-of-stock";
}>;
