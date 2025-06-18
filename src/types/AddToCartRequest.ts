import { Product } from "./Product";

export interface AddToCartRequest {
  product: Product;
  quantity: number;
}
    