import React, { useState, useRef } from "react";

const defaultForm = {
  firstName: "", lastName: "", address: "", city: "", postalCode: "",
  country: "", email: "", phone: ""
};

const fieldLabels: Record<string, string> = {
  firstName: "Prénom", lastName: "Nom", address: "Adresse",
  city: "Ville", postalCode: "Code postal", country: "Pays",
  email: "E-mail", phone: "Téléphone"
};

type FormData = typeof defaultForm;

const ShippingForm: React.FC<{
  onSuccess: (data: any) => void;
  onBack?: () => void;
}> = ({ onSuccess, onBack }) => {
  const [form, setForm] = useState<FormData>(defaultForm);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const firstErrorField = useRef<HTMLInputElement | null>(null);

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;

  if (name === "postalCode") {
    if (/[^0-9]/.test(value) || value.length > 5) return;
  }

   if (name === "phone") {
    if (/[^0-9]/.test(value) || value.length > 10) return;
  }

  setForm({ ...form, [name]: value });
  setErrors({ ...errors, [name]: "" });
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    firstErrorField.current = null;

    const res = await fetch("/api/order/shipping", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
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
        // Focus sur le premier champ en erreur si possible
        setTimeout(() => {
          const firstField = Object.keys(fieldErrors)[0];
          const el = document.querySelector(`input[name="${firstField}"]`) as HTMLInputElement | null;
          el?.focus();
        }, 30);
      } else {
        alert("Erreur: " + (err.message || "Inconnue"));
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 18, maxWidth: 440, margin: "0 auto" }}>
      {Object.entries(defaultForm).map(([field, _]) => (
        <div key={field}>
          <input
            name={field}
            value={(form as any)[field]}
            onChange={handleChange}
            placeholder={fieldLabels[field] || field}
            inputMode={field === "postalCode" ? "numeric" : undefined}
            pattern={field === "postalCode" ? "\\d*" : undefined}
            style={{
              width: "100%", padding: 10, borderRadius: 4,
              border: errors[field] ? "1.8px solid #e24" : "1.2px solid #bbb",
              background: errors[field] ? "#fff4f4" : "#fff",
              outline: "none"
            }}
            autoComplete="off"
            aria-invalid={!!errors[field]}
            aria-describedby={errors[field] ? `${field}-error` : undefined}
          />
          {errors[field] && (
            <span id={`${field}-error`} style={{ color: "#c11", fontSize: 13 }}>{errors[field]}</span>
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
      >
        {loading ? "Validation en cours..." : "Valider la livraison"}
      </button>
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
