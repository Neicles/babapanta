import React, { useState } from "react";
const defaultForm = {
  firstName: "", lastName: "", address: "", city: "", postalCode: "",
  country: "", email: "", phone: ""
};

const fieldLabels: Record<string, string> = {
  firstName: "Prénom",
  lastName: "Nom",
  address: "Adresse",
  city: "Ville",
  postalCode: "Code postal",
  country: "Pays",
  email: "E-mail",
  phone: "Téléphone",
};

const ShippingForm: React.FC<{ onSuccess: (data: any) => void }> = ({ onSuccess }) => {
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Efface l’erreur du champ quand l’utilisateur modifie
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    const res = await fetch("/api/order/shipping", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
      } catch (e) {
        err = {};
      }
      if (err.errors) {
        const fieldErrors: any = {};
        err.errors.forEach((e: any) => {
          // Parfois le champ s’appelle objectName
          fieldErrors[e.field || e.objectName] = e.defaultMessage;
        });
        setErrors(fieldErrors);
      } else if (err.message) {
        alert("Erreur : " + err.message);
      } else {
        alert("Erreur inconnue");
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
          marginTop: 28, width: "100%", background: "#111", color: "#fff", fontWeight: 600,
          border: "none", borderRadius: 4, padding: "14px 0", fontSize: 17, cursor: "pointer"
        }}
        disabled={loading}
      >Valider la livraison</button>
    </form>
  );
};

export default ShippingForm;
