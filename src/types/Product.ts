export interface Product {
  id: string;
  name: string;
  descriptionShort: string;
  descriptionLong: string;
  price: number;
  images: string[];
  weight: number;
  category: string;
  stock: number;
  currency: string;
}
