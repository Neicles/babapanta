import React, { useState } from "react";

const defaultForm = {
  firstName: "", lastName: "", address: "", city: "", postalCode: "",
  country: "", email: "", phone: ""
};

const fieldLabels: Record<string, string> = {
  firstName: "Prénom", lastName: "Nom", address: "Adresse",
  city: "Ville", postalCode: "Code postal", country: "Pays",
  email: "E-mail", phone: "Téléphone"
};

const ShippingForm: React.FC<{
  onSuccess: (data: any) => void;
  onBack?: () => void;
}> = ({ onSuccess, onBack }) => {
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    const res = await fetch("/api/order/shipping", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include", // 🔥 🔥 🔥 à ne pas oublier
  body: JSON.stringify(form),
});

    setLoading(false);
    if (res.ok) {
      const data = await res.json();
      onSuccess(data);
    } else {
      let err;
      try {
        err = await res.json();
      } catch {
        err = {};
      }
      if (err.errors) {
        const fieldErrors: any = {};
        err.errors.forEach((e: any) => {
          fieldErrors[e.field || e.objectName] = e.defaultMessage;
        });
        setErrors(fieldErrors);
      } else {
        alert("Erreur: " + (err.message || "Inconnue"));
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 18 }}>
      {Object.entries(defaultForm).map(([field, _]) => (
        <div key={field}>
          <input
            name={field}
            value={(form as any)[field]}
            onChange={handleChange}
            placeholder={fieldLabels[field] || field}
            style={{
              width: "100%", padding: 10, borderRadius: 4,
              border: errors[field] ? "1.8px solid #e24" : "1.2px solid #bbb",
              background: errors[field] ? "#fff4f4" : "#fff"
            }}
            autoComplete="off"
          />
          {errors[field] && (
            <span style={{ color: "#c11", fontSize: 13 }}>{errors[field]}</span>
          )}
        </div>
      ))}
      <button
        type="submit"
        style={{
          marginTop: 12, background: "#111", color: "#fff",
          fontWeight: 600, border: "none", borderRadius: 4,
          padding: "14px 0", fontSize: 17, cursor: "pointer"
        }}
        disabled={loading}
      >Valider la livraison</button>

      {onBack && (
        <button
          type="button"
          onClick={onBack}
          style={{
            marginTop: 12, background: "#eee", color: "#333",
            padding: "10px 0", fontSize: 16, borderRadius: 4,
            border: "1px solid #bbb", cursor: "pointer"
          }}
        >← Retour au panier</button>
      )}
    </form>
  );
};

export default ShippingForm;
