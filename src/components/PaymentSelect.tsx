import React, { useEffect, useState } from "react";

type Payment = {
  id: string;
  method: string;
  note?: string;
};

type PaymentSelectProps = {
  selected: string;
  onSelect: (id: string) => void;
};  

const paymentIcons: Record<string, string> = {
  card: "💳",
  paypal: "🅿️",
  applepay: "🍏",
};

function prettyMethod(method: string) {
  switch (method) {
    case "card": return "Carte bancaire";
    case "paypal": return "PayPal";
    case "applepay": return "Apple Pay";
    default: return method;
  }
}

const PaymentSelect: React.FC<PaymentSelectProps> = ({ selected, onSelect }) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/payments", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        // Si data est un objet avec .payments, sinon tableau
        if (Array.isArray(data)) setPayments(data);
        else if (Array.isArray(data.payments)) setPayments(data.payments);
        else setPayments([]);
      })
      .catch(() => setPayments([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <label
        style={{
          fontWeight: "bold",
          display: "block",
          marginBottom: 13,
          fontSize: 17,
          letterSpacing: 0.5,
        }}
      >
        Choisissez un moyen de paiement :
      </label>
      <div
        style={{
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 10,
        }}
      >
        {payments.map((payment) => (
          <label
            key={payment.id}
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              border: selected === payment.id ? "2px solid #111" : "1px solid #ccc",
              background: selected === payment.id ? "#faf9f6" : "#fff",
              borderRadius: 7,
              padding: "15px 22px",
              minWidth: 180,
              boxShadow: selected === payment.id ? "0 2px 8px rgba(34,34,34,0.07)" : "none",
              transition: "border 0.22s, background 0.22s, box-shadow 0.22s",
              marginBottom: 6,
            }}
          >
            <input
              type="radio"
              name="payment"
              value={payment.id}
              checked={selected === payment.id}
              onChange={() => onSelect(payment.id)}
              style={{
                accentColor: "#111",
                marginRight: 14,
                marginTop: 4,
                width: 18,
                height: 18,
              }}
            />
            <span style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontWeight: 500, fontSize: 16 }}>
                {paymentIcons[payment.method] || "💶"}{" "}
                {prettyMethod(payment.method)}
              </span>
              {payment.note && (
                <span
                  style={{
                    fontSize: 13,
                    color: "#888",
                    margin: "4px 0 0 0",
                    fontStyle: "italic",
                    maxWidth: 250,
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                >
                  {payment.note}
                </span>
              )}
            </span>
          </label>
        ))}
      </div>
      {loading && (
        <div style={{ marginTop: 8, fontSize: 14 }}>Chargement des moyens de paiement…</div>
      )}
      {!loading && payments.length === 0 && (
        <div style={{ color: "#c00", marginTop: 6, fontSize: 14 }}>
          Aucun moyen de paiement disponible.
        </div>
      )}
    </div>
  );
};

export default PaymentSelect;
