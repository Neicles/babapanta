import React, { useState, useEffect } from "react";
import { Product } from "../types/Product";

interface AddToCartModalProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onAdd: (product: Product, quantity: number) => void;
}

const backdrop: React.CSSProperties = {
  position: "fixed", zIndex: 1100,
  top: 0, left: 0, width: "100vw", height: "100vh",
  background: "rgba(0,0,0,0.34)",
  display: "flex", alignItems: "center", justifyContent: "center",
  animation: "fadeIn .19s"
};
const modal: React.CSSProperties = {
  background: "#fff", borderRadius: 0, minWidth: 330, maxWidth: 400, width: "94vw",
  padding: "40px 26px 28px 26px",
  boxShadow: "0 12px 48px rgba(0,0,0,0.14)",
  textAlign: "center", position: "relative",
  animation: "popIn .22s cubic-bezier(.4,1.4,.6,1)"
};
const zaraBtn: React.CSSProperties = {
  background: "#111", color: "#fff", border: "none",
  borderRadius: 0, fontWeight: 600, letterSpacing: 1,
  fontSize: 18, padding: "13px 0", width: "100%",
  marginTop: 18, cursor: "pointer", transition: "background .13s, color .13s"
};
const zaraBtnAlt: React.CSSProperties = {
  ...zaraBtn,
  background: "#fff",
  color: "#111",
  border: "1.5px solid #222",
  marginTop: 12
};

const qtySelectorWrap: React.CSSProperties = {
  display: "flex", justifyContent: "center", alignItems: "center",
  gap: 18, margin: "24px 0 4px"
};
const qtyBtn: React.CSSProperties = {
  background: "#fff", border: "1.5px solid #888", borderRadius: 0,
  width: 36, height: 36, fontSize: 23, fontWeight: 400, cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center",
  transition: "background .13s"
};

const qtyInput: React.CSSProperties = {
  width: 54, fontSize: 20, textAlign: "center", border: "none", background: "#faf9f8"
};

const fadeAnim = `
@keyframes fadeIn {from {opacity:0} to {opacity:1}}
@keyframes popIn {from {transform:scale(.94); opacity:0} to {transform:scale(1); opacity:1}}
`;

const AddToCartModal: React.FC<AddToCartModalProps> = ({ open, onClose, product, onAdd }) => {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setQuantity(1);
  }, [product, open]);

  if (!open || !product) return null;

  // Pour permettre fermer en cliquant dehors
  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <>
      {/* Animation */}
      <style>{fadeAnim}</style>
      <div style={backdrop} onClick={handleBackdrop}>
        <div style={modal}>
          {/* Fermer (croix) */}
          <button onClick={onClose}
            style={{
              position: "absolute", right: 13, top: 13, background: "none",
              border: "none", fontSize: 22, cursor: "pointer", color: "#888"
            }}
            aria-label="Fermer"
          >×</button>
          <img
            src={product.images[0]}
            alt={product.name}
            style={{
              width: "100%", maxHeight: 220, objectFit: "cover",
              marginBottom: 17, background: "#eee"
            }}
          />
          <h2 style={{ margin: "0 0 5px 0", fontWeight: 500, fontSize: 22, letterSpacing: 0.5 }}>{product.name}</h2>
          <div style={{ color: "#222", fontWeight: 400, fontSize: 17, marginBottom: 9 }}>
            {product.price} {product.currency}
          </div>
          <div style={qtySelectorWrap}>
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              style={qtyBtn}
              disabled={quantity <= 1}
              aria-label="Diminuer la quantité"
            >-</button>
            <input
              type="number"
              min={1}
              max={product.stock}
              value={quantity}
              style={qtyInput}
              onChange={e => setQuantity(Math.max(1, Math.min(product.stock, Number(e.target.value))))}
            />
            <button
              onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
              style={qtyBtn}
              disabled={quantity >= product.stock}
              aria-label="Augmenter la quantité"
            >+</button>
          </div>
          <div style={{ fontSize: 14, color: "#666", marginBottom: 10 }}>
            {product.stock > 0 ? `${product.stock} en stock` : "Rupture de stock"}
          </div>
          <button
            style={zaraBtn}
            disabled={product.stock === 0}
            onClick={() => { onAdd(product, quantity); onClose(); }}
          >
            AJOUTER AU PANIER
          </button>
          <button
            style={zaraBtnAlt}
            onClick={onClose}
          >
            ANNULER
          </button>
        </div>
      </div>
    </>
  );
};

export default AddToCartModal;
