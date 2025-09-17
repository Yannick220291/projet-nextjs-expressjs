"use client";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // ✅ "success" | "info" | "error"
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ On suppose que ton backend renvoie { exists: true } si email trouvé
        if (data.exists) {
          setMessage("✅ Email envoyé avec succès !");
          setMessageType("success");
        } else {
          setMessage("ℹ️ Si ce compte existe, vous allez recevoir un e-mail.");
          setMessageType("info");
        }
      } else {
        setMessage(data.error || "❌ Une erreur est survenue.");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("❌ Erreur de connexion au serveur");
      setMessageType("error");
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-900">
          Mot de passe oublié ?
        </h1>
        <p className="text-sm text-gray-600 text-center mb-6">
          Entrez votre adresse email et nous vous enverrons un lien pour
          réinitialiser votre mot de passe.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Votre adresse email"
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 outline-none text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value.toLowerCase())}
            required
          />
          <button
            disabled={loading}
            className={`${
              loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
            } text-white py-2 rounded-lg transition font-semibold`}
          >
            {loading ? "Envoi en cours..." : "Envoyer le lien"}
          </button>
        </form>

        {/* ✅ Message ergonomique coloré */}
        {message && (
          <p
            className={`mt-4 text-center text-sm font-medium ${
              messageType === "success"
                ? "text-green-600"
                : messageType === "info"
                ? "text-blue-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-sm">
          <a href="/login" className="text-green-600 font-semibold">
            Retour à la connexion
          </a>
        </p>
      </div>
    </div>
  );
}
