import React from "react";
import { useCart } from "../contexts/CartContext";

const CartIcon: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  const { itemCount } = useCart();
  return (
    <div style={{ cursor: "pointer", position: "relative" }} onClick={onClick}>
      <span style={{ fontSize: 28 }}>🛒</span>
      {itemCount > 0 && (
        <span style={{
          background: "#111",
          color: "#fff",
          borderRadius: "999px",
          padding: "2px 8px",
          fontSize: "1rem",
          fontWeight: "bold",
          marginLeft: "-10px",
          verticalAlign: "top",
          position: "absolute",
          top: -8,
          right: -10
        }}>
          {itemCount}
        </span>
      )}
    </div>
  );
};

export default CartIcon;
