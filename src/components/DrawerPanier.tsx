import React, { useEffect, useState } from "react";
import { Panier } from "../types/Panier";
import { CartItem } from "../types/CartItem";
import { useCart } from "../contexts/CartContext";

interface DrawerPanierProps {
  open: boolean;
  onClose: () => void;
  onRequestShipping?: () => void;
}

const drawerBackdrop: React.CSSProperties = {
  position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
  background: "rgba(0,0,0,0.25)", zIndex: 1200
};

const drawer: React.CSSProperties = {
  position: "fixed", top: 0, right: 0, height: "100vh", width: 430,
  background: "#fff", boxShadow: "-8px 0 24px rgba(0,0,0,0.12)", zIndex: 1300,
  transition: "transform .27s cubic-bezier(.4,1.4,.6,1)", willChange: "transform",
  display: "flex", flexDirection: "column", maxWidth: "94vw"
};

const line: React.CSSProperties = { border: "none", borderTop: "1.5px solid #eee", margin: "18px 0" };

const imgStyle: React.CSSProperties = { width: 74, height: 94, objectFit: "cover", borderRadius: 5, background: "#f8f8f8" };

const qtyBtn: React.CSSProperties = {
  background: "#fff", border: "1.5px solid #888", borderRadius: 0,
  width: 30, height: 32, fontSize: 18, fontWeight: 400, cursor: "pointer"
};

const DrawerPanier: React.FC<DrawerPanierProps> = ({ open, onClose, onRequestShipping }) => {
  const [cart, setCart] = useState<Panier | null>(null);
  const [loading, setLoading] = useState(false);
  const [validateLoading, setValidateLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const { refreshCart } = useCart();

useEffect(() => {
  if (open) {
    fetchCart();
    refreshCart();
  }
  setValidationErrors([]);
}, [open]);


  const fetchCart = () => {
    setLoading(true);
    fetch("/api/cart", {
      credentials: "include",
    })
      .then(res => res.json())
      .then((panier: Panier) => setCart(panier))
      .finally(() => setLoading(false));
  };

  const handleQty = (item: CartItem, newQty: number) => {
    if (newQty <= 0) return;
    fetch("/api/cart/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        productId: item.product.id,
        quantity: newQty,
        stock: item.product.stock
      })
    })
      .then(res => res.json())
      .then(() => {
        fetchCart();
        refreshCart();
      });
  };

  const handleRemove = (item: CartItem) => {
    fetch(`/api/cart/remove/${item.product.id}`, {
      method: "DELETE",
      credentials: "include"
    }).then(() => {
      fetchCart();
      refreshCart();
    });
  };

  const handleClear = () => {
    fetch("/api/cart/clear", {
      method: "DELETE",
      credentials: "include"
    }).then(() => {
      fetchCart();
      refreshCart();
    });
  };

  const handleValidate = async () => {
    setValidateLoading(true);
    setValidationErrors([]);
    try {
      const res = await fetch("/api/cart/validate", {
        method: "POST",
        credentials: "include"
      });
      const data = await res.json();
      setValidateLoading(false);
      if (res.ok && data.valid) {
        onClose();
        setTimeout(() => {
          onRequestShipping && onRequestShipping();
        }, 200);
      } else {
        setValidationErrors(data.errors || ["Erreur inconnue."]);
      }
    } catch (e: any) {
      setValidateLoading(false);
      setValidationErrors([e.message || "Erreur réseau"]);
    }
  };

  if (!open) return null;

  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div style={drawerBackdrop} onClick={handleBackdrop}>
      <aside style={{
        ...drawer,
        transform: open ? "translateX(0)" : "translateX(120%)"
      }}>
        <div style={{
          padding: "24px 26px 10px 18px", borderBottom: "1.5px solid #eee",
          display: "flex", alignItems: "center", justifyContent: "space-between"
        }}>
          <span style={{ fontSize: 22, fontWeight: 600 }}>Votre panier</span>
          <button
            onClick={onClose}
            style={{ fontSize: 28, border: "none", background: "none", cursor: "pointer", color: "#888" }}
            aria-label="Fermer"
          >×</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "14px 26px" }}>
          {loading && <div>Chargement...</div>}
          {!loading && cart && cart.items.length === 0 && (
            <div style={{ color: "#888", textAlign: "center", margin: 26 }}>Votre panier est vide.</div>
          )}
          {!loading && cart && cart.items.map(item => (
            <div key={item.product.id} style={{
              display: "flex", alignItems: "center", gap: 12, marginBottom: 16
            }}>
              <img src={item.product.images[0]} alt={item.product.name} style={imgStyle} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 16 }}>{item.product.name}</div>
                <div style={{ fontSize: 15, color: "#222" }}>{item.product.price} {item.product.currency}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 7, margin: "10px 0" }}>
                  <button style={qtyBtn} onClick={() => handleQty(item, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                  <span style={{ fontSize: 16, width: 28, textAlign: "center" }}>{item.quantity}</span>
                  <button style={qtyBtn} onClick={() => handleQty(item, Math.min(item.product.stock, item.quantity + 1))} disabled={item.quantity >= item.product.stock}>+</button>
                </div>
                <div style={{ fontSize: 14, color: "#888" }}>Total: {item.product.price * item.quantity} {item.product.currency}</div>
              </div>
              <button
                onClick={() => handleRemove(item)}
                style={{
                  border: "none", background: "none", color: "#C11", fontSize: 20, cursor: "pointer", marginLeft: 6
                }}
                aria-label="Supprimer"
              >🗑️</button>
            </div>
          ))}
          {validationErrors.length > 0 && (
            <div style={{
              background: "#fff0f0", color: "#c00", border: "1px solid #f9dada",
              borderRadius: 5, margin: "18px 0 12px 0", padding: "11px 13px"
            }}>
              <b>Impossible de valider la commande :</b>
              <ul style={{ margin: "6px 0 0 20px" }}>
                {validationErrors.map((err, i) => <li key={i}>{err}</li>)}
              </ul>
            </div>
          )}
          {!loading && cart && cart.items.length > 0 && <hr style={line} />}
        </div>
        {cart && cart.items.length > 0 && (
          <div style={{
            padding: "18px 26px",
            borderTop: "1.5px solid #eee",
            background: "#fff",
            boxShadow: "0 -2px 14px rgba(0,0,0,0.03)"
          }}>
            <div style={{
              display: "flex", justifyContent: "space-between", fontSize: 17,
              fontWeight: 500, marginBottom: 9
            }}>
              <span>Sous-total</span>
              <span>
                {cart.items.reduce((s, i) => s + i.quantity * i.product.price, 0)} €
              </span>
            </div>
            <button
              style={{
                width: "100%", background: "#111", color: "#fff", border: "none", borderRadius: 0,
                fontWeight: 600, padding: "13px 0", fontSize: 18, cursor: "pointer", marginBottom: 9
              }}
              onClick={handleValidate}
              disabled={validateLoading}
            >
              {validateLoading ? "Vérification..." : "Commander"}
            </button>
            <button
              style={{
                width: "100%", background: "#fff", color: "#111", border: "1.5px solid #222",
                borderRadius: 0, fontWeight: 600, padding: "11px 0", fontSize: 17, cursor: "pointer"
              }}
              onClick={handleClear}
            >Vider le panier</button>
          </div>
        )}
      </aside>
    </div>
  );
};

export default DrawerPanier;
