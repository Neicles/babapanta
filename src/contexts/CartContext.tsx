import React, { createContext, useContext, useState, useEffect } from "react";
import { Panier } from "../types/Panier";

type CartContextType = {
  itemCount: number;
  refreshCart: () => void;
};

const CartContext = createContext<CartContextType>({
  itemCount: 0,
  refreshCart: () => {},
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [itemCount, setItemCount] = useState(0);

  const refreshCart = () => {
    fetch("/api/cart")
      .then(res => res.json())
      .then((cart: Panier) => {
        const total = cart.items.reduce((acc, item) => acc + item.quantity, 0);
        setItemCount(total);
      });
  };

  useEffect(() => {
    refreshCart();
  }, []);

  return (
    <CartContext.Provider value={{ itemCount, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};

export {}; // <- Pour TypeScript (sinon "not a module" !)
