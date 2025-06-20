import React, { useEffect, useState } from "react";

type Carrier = {
  id: string;
  name: string;
  service_type: string;
  average_rating: number;
  address: string;
  price: number;
  // Ajoute d'autres champs si nécessaire, ex: maxWeight
};

type Props = {
  selected: string;
  onSelect: (carrierId: string) => void;
  poids: number;
  onCarriersLoaded?: (carriers: Carrier[]) => void;
};

function renderStars(rating: number) {
  const rounded = Math.round(rating * 2) / 2;
  return (
    <span style={{ color: "#FFC700", fontSize: 15, marginLeft: 5 }}>
      {Array.from({ length: 5 }, (_, i) => {
        if (i + 1 <= rounded) return "★";
        if (i + 0.5 === rounded) return "⯨";
        return "☆";
      })}
    </span>
  );
}

const CarrierSelect: React.FC<Props> = ({
  selected,
  onSelect,
  poids,
  onCarriersLoaded,
}) => {
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/carriers/options", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ weight: poids }),
    })
      .then((res) => res.json())
      .then((data) => {
        let fetched: Carrier[] = [];
        if (Array.isArray(data)) {
          fetched = data;
        } else if (Array.isArray(data.carriers)) {
          fetched = data.carriers;
        }
        setCarriers(fetched);
        if (onCarriersLoaded) onCarriersLoaded(fetched);
      })
      .catch(() => {
        setCarriers([]);
        if (onCarriersLoaded) onCarriersLoaded([]);
      })
      .finally(() => setLoading(false));
  }, [poids, onCarriersLoaded]);

  // Fonction pour gérer la sélection + POST vers backend pour la session
  const handleSelect = (carrierId: string) => {
    onSelect(carrierId);
    const carrierObj = carriers.find(c => c.id === carrierId);
    if (carrierObj) {
      fetch("/api/order/carrier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(carrierObj)
      }).catch(() => {
        // Optionnel: handle error
      });
    }
  };

  return (
    <div>
      <label
        style={{
          fontWeight: "bold",
          display: "block",
          marginBottom: 12,
          fontSize: 17,
          letterSpacing: 0.5,
        }}
      >
        Choisissez un transporteur :
      </label>
      <div
        style={{
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 10,
        }}
      >
        {carriers.map((carrier) => (
          <label
            key={carrier.id}
            style={{
              display: "flex",
              alignItems: "flex-start",
              cursor: "pointer",
              border: selected === carrier.id ? "2px solid #111" : "1px solid #ccc",
              background: selected === carrier.id ? "#faf9f6" : "#fff",
              borderRadius: 7,
              padding: "15px 22px",
              minWidth: 210,
              boxShadow:
                selected === carrier.id
                  ? "0 2px 8px rgba(34,34,34,0.07)"
                  : "none",
              transition: "border 0.22s, background 0.22s, box-shadow 0.22s",
              marginBottom: 6,
            }}
          >
            <input
              type="radio"
              name="carrier"
              value={carrier.id}
              checked={selected === carrier.id}
              onChange={() => handleSelect(carrier.id)}
              style={{
                accentColor: "#111",
                marginRight: 14,
                marginTop: 4,
                width: 18,
                height: 18,
              }}
            />
            <span style={{ display: "flex", flexDirection: "column" }}>
              <span>
                <b style={{ fontWeight: 500, fontSize: 16 }}>{carrier.name}</b>
                {renderStars(carrier.average_rating)}
                <span style={{ fontSize: 13, color: "#444", marginLeft: 7 }}>
                  ({carrier.average_rating?.toFixed(1)})
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
                  {carrier.price?.toFixed(2)} €
                </span>
              </span>
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
                {carrier.address}
              </span>
              <span
                style={{
                  fontSize: 13,
                  color: "#444",
                  marginTop: 3,
                }}
              >
                {carrier.service_type}
              </span>
            </span>
          </label>
        ))}
      </div>
      {loading && (
        <div style={{ marginTop: 8, fontSize: 14 }}>Chargement des livreurs…</div>
      )}
      {!loading && carriers.length === 0 && (
        <div style={{ color: "#c00", marginTop: 6, fontSize: 14 }}>
          Aucun transporteur disponible pour ce poids.
        </div>
      )}
    </div>
  );
};

export default CarrierSelect;
