import React, { createContext, useContext, useEffect, useState } from "react";
import { Panier } from "../types/Panier";

interface CartContextType {
  cart: Panier | null;
  itemCount: number;
  refreshCart: () => void;
}

const CartContext = createContext<CartContextType>({
  cart: null,
  itemCount: 0,
  refreshCart: () => {},
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Panier | null>(null);

  const refreshCart = () => {
    fetch("/api/cart", {
      method: "GET",
      credentials: "include", // 🔥 Assure l'envoi du cookie JSESSIONID
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur HTTP " + res.status);
        return res.json();
      })
      .then((data: Panier) => {
        setCart(data);
      })
      .catch((err) => {
        console.error("Erreur récupération panier :", err);
        setCart(null); // reset si erreur
      });
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const itemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, itemCount, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};
