"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, CartContextType } from "@/types";
import { Product } from "@prisma/client";

function normalizeProduct(p: any): Product {
  const toNumber = (v: any, fallback = 0) => {
    if (v === null || v === undefined || v === "") return fallback;
    if (typeof v === "number") return Number.isFinite(v) ? v : fallback;
    if (typeof v === "string") {
      const n = Number(v);
      return Number.isFinite(n) ? n : fallback;
    }
    try {
      const s = v?.toString?.();
      if (typeof s === "string") {
        const n = Number(s);
        return Number.isFinite(n) ? n : fallback;
      }
    } catch {}
    return fallback;
  };

  const discountRaw = p?.discountPrice;
  const discount = discountRaw === null || discountRaw === undefined ? null : toNumber(discountRaw);

  return {
    ...p,
    images: typeof p?.images === "string" ? p.images : "",
    price: toNumber(p?.price) as any,
    discountPrice: (discount as any) ?? null,
    quota: toNumber(p?.quota) as any,
    quotaFilled: toNumber(p?.quotaFilled) as any,
  } as Product;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart) as CartItem[];
        const normalized: CartItem[] = Array.isArray(parsed)
          ? parsed
              .filter((it) => it && typeof it === "object")
              .map((it) => {
                const qty = Number((it as any).quantity);
                const safeQty = Number.isFinite(qty) && qty > 0 ? qty : 1;
                const prod = (it as any).product ? normalizeProduct((it as any).product) : (undefined as unknown as Product);
                return {
                  id: (it as any).id || `${(it as any).productId || "unknown"}-${Date.now()}`,
                  productId: (it as any).productId || (prod as any)?.id || "",
                  quantity: safeQty,
                  product: prod,
                } as CartItem;
              })
              .filter((it) => it.productId && it.product)
          : [];
        setItems(normalized);
      } catch {
        // ignore corrupted cart
        setItems([]);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("cart", JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addItem = async (productId: string, quantity: number = 1) => {
    // Fetch product details
    const response = await fetch(`/api/products/${productId}`);
    const product: Product = await response.json();

    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.productId === productId
      );

      if (existingItem) {
        // Update quantity if item exists
        return currentItems.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        return [
          ...currentItems,
          {
            id: `${productId}-${Date.now()}`,
            productId,
            quantity,
            product,
          },
        ];
      }
    });
  };

  const removeItem = (itemId: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== itemId)
    );
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = items.reduce((sum, item) => {
    const p = item.product.discountPrice ?? item.product.price;
    const n = typeof p === "number" ? p : Number(p);
    const safe = Number.isFinite(n) ? n : 0;
    return sum + safe * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
