import { Product } from "./Product";

export interface PaginatedProducts {
  content: Product[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
