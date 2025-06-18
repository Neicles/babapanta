import React from "react";
import { useCart } from "../contexts/CartContext";

const CartIcon: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  const { itemCount } = useCart();

  return (
    <div style={{ cursor: "pointer", position: "relative" }} onClick={onClick}>
      <span style={{ fontSize: 28 }}>🛒</span>
      {itemCount > 0 && (
        <span
          style={{
            position: "absolute",
            top: -4,
            right: -6,
            background: "red",
            color: "#fff",
            borderRadius: "50%",
            fontSize: 12,
            padding: "3px 6px",
          }}
        >
          {itemCount}
        </span>
      )}
    </div>
  );
};

export default CartIcon;
