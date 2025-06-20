import React, { useState, useEffect } from "react";
import ShippingForm from "../components/ShippingForm";
import CarrierSelect from "../components/Carrier";
import PaymentSelect from "../components/PaymentSelect";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";

const accent = "#111";
const buttonBg = "#111";
const buttonText = "#fff";
const borderColor = "#e3e3e3";
const stepActive = "#222";
const stepInactive = "#bbb";
const lightGrey = "#f7f7f7";

const steps = ["Panier", "Livraison", "Livreur", "Paiement", "Confirmation"];

const CheckoutPage: React.FC = () => {
  const [step, setStep] = useState<number>(0);
  const [shippingForm, setShippingForm] = useState<any>(null);
  const [poids, setPoids] = useState<number | null>(null);
  const [selectedCarrierId, setSelectedCarrierId] = useState<string>("");
  const [carriers, setCarriers] = useState<any[]>([]);
  const [selectedCarrierPrice, setSelectedCarrierPrice] = useState<number | null>(null);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>("");
  const { cart, refreshCart } = useCart();
  const navigate = useNavigate();

  // Rafraîchit le panier au montage
  useEffect(() => {
    refreshCart();
  }, []);

  // Met à jour le prix du transporteur quand l'id change
  useEffect(() => {
    if (!selectedCarrierId) {
      setSelectedCarrierPrice(null);
    } else {
      const found = carriers.find((c) => c.id === selectedCarrierId);
      setSelectedCarrierPrice(found?.price ?? null);
    }
  }, [selectedCarrierId, carriers]);

  const selectedCarrier = carriers.find(c => c.id === selectedCarrierId);

  // Persiste le choix du transporteur côté session
  const handleCarrierSelect = async (carrierId: string) => {
    setSelectedCarrierId(carrierId);
    const found = carriers.find(c => c.id === carrierId);
    setSelectedCarrierPrice(found?.price ?? null);
    if (found) {
      await fetch("/api/order/carrier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: found.id, name: found.name, price: found.price }),
      });
    }
  };

  // Persiste le choix du paiement côté session
  const handlePaymentSelect = async (paymentId: string) => {
    setSelectedPaymentId(paymentId);
    await fetch("/api/order/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id: paymentId }),
    });
  };

  const renderStepper = () => (
    <div style={{
      display: "flex",
      gap: 0,
      marginBottom: 38,
      background: "#fff",
      borderRadius: 18,
      boxShadow: "0 1.5px 24px #eee",
      overflow: "hidden"
    }}>
      {steps.map((label, idx) => (
        <div
          key={label}
          style={{
            flex: 1,
            textAlign: "center",
            padding: "16px 0",
            fontWeight: idx === step ? 700 : 400,
            color: idx <= step ? stepActive : stepInactive,
            borderBottom: idx === step
              ? `2.5px solid ${accent}` : "2.5px solid transparent",
            background: idx === step
              ? lightGrey : "#fff",
            fontSize: 15.5,
            letterSpacing: 1,
            transition: "all 0.22s"
          }}
        >
          {label}
        </div>
      ))}
    </div>
  );

  const renderSummary = () => (
    <div style={{
      marginBottom: 28,
      background: "#fff",
      borderRadius: 12,
      border: `1.2px solid ${borderColor}`,
      padding: 26,
      boxShadow: "0 1px 16px #f1f1f1"
    }}>
      <h3 style={{
        margin: 0,
        marginBottom: 18,
        fontWeight: 500,
        fontSize: 20,
        letterSpacing: 0.5
      }}>Récapitulatif</h3>
      {!cart ? (
        <div>Chargement du panier…</div>
      ) : (
        <div style={{ fontSize: 16 }}>
          <div style={{ marginBottom: 2 }}>
            <span style={{ color: "#666" }}>Articles:</span> <b>{cart.items.length}</b>
          </div>
          <div>
            <span style={{ color: "#666" }}>Sous-total:</span>{" "}
            <b>{cart.items.reduce((s, i) => s + i.quantity * i.product.price, 0)} €</b>
          </div>
          {shippingForm && (
            <div style={{
              marginTop: 14,
              background: lightGrey,
              borderRadius: 8,
              padding: 12,
              fontSize: 15,
              color: "#222"
            }}>
              <b>Adresse de livraison</b>
              <div style={{ marginTop: 2 }}>
                {shippingForm.firstName} {shippingForm.lastName}<br />
                {shippingForm.address}, {shippingForm.city}, {shippingForm.postalCode}, {shippingForm.country}<br />
                {shippingForm.email} – {shippingForm.phone}
              </div>
            </div>
          )}
          {poids !== null && (
            <div style={{ marginTop: 8, fontSize: 15, color: "#333" }}>
              <b>Poids total :</b> {poids} g
            </div>
          )}
          {selectedCarrier && (
            <div style={{ marginTop: 8, fontSize: 15 }}>
              <b>Transporteur :</b>{" "}
              <span style={{ color: accent }}>
                {selectedCarrier.name}
                {" "}
                <span style={{ fontSize: 13, color: "#888" }}>
                  ({selectedCarrier.average_rating?.toFixed(1)} / 5)
                </span>
                <span style={{
                  color: "#009688",
                  fontWeight: 500,
                  fontSize: 15,
                  marginLeft: 12,
                  background: "#e6f5f3",
                  borderRadius: 4,
                  padding: "2px 8px"
                }}>
                  {selectedCarrier.price?.toFixed(2)} €
                </span>
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div style={{
      maxWidth: 540,
      margin: "0 auto",
      padding: "36px 16px",
      fontFamily: "Inter, Arial, sans-serif",
      color: "#222",
      background: "#fafafa",
      minHeight: "100vh"
    }}>
      <h2 style={{
        fontWeight: 700,
        marginBottom: 16,
        fontSize: 27,
        letterSpacing: 1
      }}>Commande</h2>
      {renderStepper()}
      {renderSummary()}

      {step === 0 && (
        <div>
          <h3 style={{ fontWeight: 500, marginBottom: 14 }}>Panier</h3>
          {!cart ? (
            <div>Chargement du panier…</div>
          ) : cart.items.length === 0 ? (
            <div style={{ color: "#b00", margin: "20px 0" }}>
              Votre panier est vide.
            </div>
          ) : (
            <>
              <div style={{
                marginBottom: 14,
                background: "#fff",
                borderRadius: 7,
                border: `1.2px solid ${borderColor}`,
                boxShadow: "0 1px 8px #f1f1f1"
              }}>
                {cart.items.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      padding: 14,
                      borderBottom: index === cart.items.length - 1 ? "none" : `1px solid ${borderColor}`,
                      fontSize: 16
                    }}
                  >
                    <b>{item.product.name}</b> – {item.quantity} × {item.product.price}€
                  </div>
                ))}
              </div>
              <button
                style={{
                  marginTop: 20,
                  padding: "13px 0",
                  fontSize: 18,
                  width: "100%",
                  border: "none",
                  background: buttonBg,
                  color: buttonText,
                  borderRadius: 6,
                  fontWeight: 600,
                  letterSpacing: 1,
                  cursor: "pointer",
                  boxShadow: "0 2px 8px #eee"
                }}
                onClick={() => setStep(1)}
                disabled={!cart || cart.items.length === 0}
              >
                Continuer vers la livraison →
              </button>
            </>
          )}
        </div>
      )}

      {step === 1 && (
        <ShippingForm
          onSuccess={(data) => {
            setShippingForm(data.shippingForm);
            setPoids(data.poids);
            refreshCart();
            setStep(2);
          }}
          onBack={() => setStep(0)}
        />
      )}

      {step === 2 && (
        <div>
          <CarrierSelect
            poids={poids ?? 0}
            selected={selectedCarrierId}
            onSelect={handleCarrierSelect}
            onCarriersLoaded={setCarriers}
          />
          <button
            style={{
              marginTop: 20,
              padding: "13px 0",
              fontSize: 18,
              width: "100%",
              border: "none",
              background: buttonBg,
              color: buttonText,
              borderRadius: 6,
              fontWeight: 600,
              letterSpacing: 1,
              cursor: selectedCarrierId ? "pointer" : "not-allowed",
              opacity: selectedCarrierId ? 1 : 0.6,
              boxShadow: "0 2px 8px #eee"
            }}
            onClick={() => setStep(3)}
            disabled={!selectedCarrierId}
          >
            Continuer vers le paiement →
          </button>
          <br />
          <button
            style={{
              marginTop: 12,
              padding: "11px 0",
              fontSize: 16,
              width: "100%",
              border: `1.2px solid ${borderColor}`,
              background: "#fafafa",
              color: "#222",
              borderRadius: 6,
              fontWeight: 500,
              letterSpacing: 0.5,
              cursor: "pointer"
            }}
            onClick={() => setStep(1)}
          >
            ← Retour à la livraison
          </button>
        </div>
      )}

      {step === 3 && (
        <div>
          <h3 style={{ fontWeight: 500, marginBottom: 18 }}>Paiement</h3>
          <div style={{
            marginBottom: 22,
            background: "#fff",
            borderRadius: 12,
            border: `1.2px solid ${borderColor}`,
            padding: 18,
            fontSize: 16
          }}>
            <div>
              <span>Sous-total produits :</span>{" "}
              <b>{cart?.items.reduce((s, i) => s + i.quantity * i.product.price, 0) ?? 0} €</b>
            </div>
            <div>
              <span>Frais de port :</span>{" "}
              <b>{selectedCarrierPrice !== null ? selectedCarrierPrice.toFixed(2) + " €" : "-"}</b>
            </div>
            <div style={{ marginTop: 10, fontWeight: 600 }}>
              Total à payer :{" "}
              <span style={{ color: "#009688", fontSize: 19 }}>
                {((cart?.items.reduce((s, i) => s + i.quantity * i.product.price, 0) ?? 0)
                  + (selectedCarrierPrice ?? 0)).toFixed(2)} €
              </span>
            </div>
          </div>
          <PaymentSelect
            selected={selectedPaymentId}
            onSelect={handlePaymentSelect}
          />
          <button
            style={{
              marginTop: 20,
              padding: "13px 0",
              fontSize: 18,
              width: "100%",
              border: "none",
              background: buttonBg,
              color: buttonText,
              borderRadius: 6,
              fontWeight: 600,
              letterSpacing: 1,
              cursor: selectedPaymentId ? "pointer" : "not-allowed",
              opacity: selectedPaymentId ? 1 : 0.6,
              boxShadow: "0 2px 8px #eee"
            }}
            onClick={() => setStep(4)}
            disabled={!selectedPaymentId}
          >
            Payer
          </button>
          <br />
          <button
            style={{
              marginTop: 12,
              padding: "11px 0",
              fontSize: 16,
              width: "100%",
              border: `1.2px solid ${borderColor}`,
              background: "#fafafa",
              color: "#222",
              borderRadius: 6,
              fontWeight: 500,
              letterSpacing: 0.5,
              cursor: "pointer"
            }}
            onClick={() => setStep(2)}
          >
            ← Retour au choix du livreur
          </button>
        </div>
      )}

      {step === 4 && (
        <div style={{
          textAlign: "center",
          padding: "48px 0"
        }}>
          <h3 style={{
            fontWeight: 700,
            fontSize: 23,
            letterSpacing: 0.6
          }}>Merci, commande confirmée !</h3>
          <button
            style={{
              marginTop: 28,
              padding: "15px 0",
              fontSize: 18,
              width: 200,
              border: "none",
              background: buttonBg,
              color: buttonText,
              borderRadius: 6,
              fontWeight: 600,
              letterSpacing: 1,
              cursor: "pointer",
              boxShadow: "0 2px 8px #eee"
            }}
            onClick={async () => {
              await fetch("/api/cart/clear", {
                method: "DELETE",
                credentials: "include"
              });
              refreshCart();
              navigate("/");
            }}
          >
            Retour accueil
          </button>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
