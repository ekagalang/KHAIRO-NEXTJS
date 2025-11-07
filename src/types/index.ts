import { Product, ProductType } from "@prisma/client";

export type ProductWithDetails = Product & {
  _count?: {
    cartItems: number;
  };
};

export type CartItem = {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
};

export type CartContextType = {
  items: CartItem[];
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};
