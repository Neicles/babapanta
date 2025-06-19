import React, { useState, useEffect } from "react";
import ShippingForm from "../components/ShippingForm";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";

const steps = ["Panier", "Livraison", "Paiement", "Confirmation"];

const CheckoutPage: React.FC = () => {
  const [step, setStep] = useState<number>(0);
  const [shippingForm, setShippingForm] = useState<any>(null);
  const [poids, setPoids] = useState<number | null>(null);
  const { cart, refreshCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    refreshCart();
  }, []);

  const renderStepper = () => (
    <div style={{ display: "flex", gap: 20, marginBottom: 32 }}>
      {steps.map((label, idx) => (
        <div
          key={label}
          style={{
            fontWeight: idx <= step ? "bold" : 400,
            color: idx <= step ? "#000" : "#bbb",
          }}
        >
          {idx + 1}. {label}
        </div>
      ))}
    </div>
  );

  const renderSummary = () => (
    <div style={{ marginBottom: 24 }}>
      <h3>Récapitulatif</h3>
      {!cart ? (
        <div>Chargement du panier…</div>
      ) : (
        <div>
          <div>Articles: {cart.items.length}</div>
          <div>
            Sous-total:{" "}
            {cart.items.reduce(
              (s, i) => s + i.quantity * i.product.price,
              0
            )}{" "}
            €
          </div>
          {shippingForm && (
            <div style={{ marginTop: 12 }}>
              <b>Adresse de livraison :</b>
              <br />
              {shippingForm.firstName} {shippingForm.lastName}
              <br />
              {shippingForm.address}, {shippingForm.city}, {shippingForm.postalCode},{" "}
              {shippingForm.country}
              <br />
              {shippingForm.email} – {shippingForm.phone}
              {poids !== null && (
                <>
                  <br />
                  <span style={{ fontSize: 15, color: "#444" }}>
                    <b>Poids total du panier&nbsp;:</b> {poids} g
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: 32 }}>
      <h2>Commande</h2>
      {renderStepper()}
      {renderSummary()}

      {step === 0 && (
        <div>
          <h3>Panier</h3>
          {!cart ? (
            <div>Chargement du panier…</div>
          ) : cart.items.length === 0 ? (
            <div style={{ color: "#b00", margin: "20px 0" }}>
              Votre panier est vide.
            </div>
          ) : (
            <>
              {cart.items.map((item, index) => (
                <div
                  key={index}
                  style={{ padding: 8, borderBottom: "1px solid #ddd" }}
                >
                  <b>{item.product.name}</b> – {item.quantity} ×{" "}
                  {item.product.price}€
                </div>
              ))}
              <button
                style={{ marginTop: 20, padding: 12, fontSize: 18 }}
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
          <h3>Paiement</h3>
          <button
            style={{ marginTop: 20, padding: 12, fontSize: 18 }}
            onClick={() => setStep(3)}
          >
            Payer
          </button>
          <br />
          <button
            style={{ marginTop: 12, padding: 8, fontSize: 14 }}
            onClick={() => setStep(1)}
          >
            ← Retour à la livraison
          </button>
        </div>
      )}

      {step === 3 && (
        <div>
          <h3>Merci, commande confirmée !</h3>
          <button onClick={() => navigate("/")}>Retour accueil</button>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
