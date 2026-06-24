export type CartProduct = {
  id: number;
  name: string;
  slug: string;
  sku: string;
  price: number;
  unit: string;
  manufacturer: string;
};

export type CartLine = {
  product: CartProduct;
  quantity: number;
};

export function calculateCartTotal(lines: CartLine[]) {
  return lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
}

export function calculateCartCount(lines: CartLine[]) {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}
