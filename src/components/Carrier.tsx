import React, { useEffect, useState } from "react";

type Carrier = {
  id: string;
  name: string;
  service_type: string;
};

type Props = {
  selected: string;
  onSelect: (carrierId: string) => void;
  poids: number;
};

const CarrierSelect: React.FC<Props> = ({ selected, onSelect, poids }) => {
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/carriers/options", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ weight: poids }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCarriers(data);
        } else if (Array.isArray(data.carriers)) {
          setCarriers(data.carriers);
        } else {
          console.warn("Format de données inattendu :", data);
          setCarriers([]);
        }
      })
      .catch((err) => {
        console.error("Erreur chargement livreurs :", err);
        setCarriers([]);
      })
      .finally(() => setLoading(false));
  }, [poids]);

  return (
    <div>
      <label
        htmlFor="carrier"
        style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
      >
        Choisissez un livreur :
      </label>
      <select
        id="carrier"
        value={selected}
        onChange={(e) => onSelect(e.target.value)}
        disabled={loading}
        style={{
          padding: 10,
          width: "100%",
          borderRadius: 4,
          border: "1px solid #ccc",
          fontSize: 16,
        }}
      >
        <option value="">-- Sélectionnez un transporteur --</option>
        {carriers.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name} – {c.service_type}
          </option>
        ))}
      </select>
      {loading && <div style={{ marginTop: 8 }}>Chargement des livreurs…</div>}
    </div>
  );
};

export default CarrierSelect;
