import React, { useState } from "react";
import ShippingForm from "../components/ShippingForm";
import { Panier } from "../types/Panier";
import { useNavigate } from "react-router-dom";

const steps = [
  "Panier",
  "Livraison",
  "Paiement",
  "Confirmation"
];

const CheckoutPage: React.FC = () => {
  // Gestion des étapes
  const [step, setStep] = useState(1); // 1=Livraison, 2=Paiement...
  const [shippingData, setShippingData] = useState<any>(null);
  const [panier, setPanier] = useState<Panier | null>(null);
  const navigate = useNavigate();

  // On pourrait fetch le panier ici si besoin
  React.useEffect(() => {
    fetch("/api/cart")
      .then(res => res.json())
      .then((data) => setPanier(data));
  }, []);

  // Stepper UI
  const renderStepper = () => (
    <div style={{ display: "flex", gap: 20, marginBottom: 32 }}>
      {steps.map((label, idx) => (
        <div key={label} style={{
          fontWeight: idx < step ? "bold" : 400,
          color: idx < step ? "#000" : "#bbb"
        }}>
          {idx + 1}. {label}
        </div>
      ))}
    </div>
  );

  // Récap étapes validées (façon Amazon)
  const renderSummary = () => (
    <div style={{ marginBottom: 24 }}>
      <h3>Récapitulatif</h3>
      {panier && (
        <div>
          <div>Articles: {panier.items.length}</div>
          <div>Sous-total: {panier.items.reduce((s, i) => s + i.quantity * i.product.price, 0)} €</div>
        </div>
      )}
      {shippingData && (
        <div>
          <b>Adresse de livraison :</b><br />
          {shippingData.firstName} {shippingData.lastName}<br />
          {shippingData.address}, {shippingData.city}, {shippingData.postalCode}, {shippingData.country}<br />
          {shippingData.email} – {shippingData.phone}
        </div>
      )}
    </div>
  );

  // Step rendering
  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: 32 }}>
      <h2>Commande</h2>
      {renderStepper()}
      {renderSummary()}
      {step === 1 && (
        <ShippingForm
          onSuccess={data => {
            setShippingData(data);
            setStep(2);
          }}
        />
      )}
      {step === 2 && (
        <div>
          <h3>Paiement (step 2/3)</h3>
          {/* Ton composant paiement ou un bouton pour simuler */}
          <button
            style={{ marginTop: 20, padding: 12, fontSize: 18 }}
            onClick={() => setStep(3)}
          >Payer</button>
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
