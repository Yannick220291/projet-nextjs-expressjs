"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Vérification du mot de passe
  const validatePassword = (pwd) => {
    const rules = [
      { regex: /.{8,}/, message: "8 caractères" },
      { regex: /[A-Z]/, message: "1 majuscule" },
      { regex: /[a-z]/, message: "1 minuscule" },
      { regex: /[0-9]/, message: "1 chiffre" },
      { regex: /[^A-Za-z0-9]/, message: "1 spécial" },
    ];
    return rules.filter((rule) => !rule.regex.test(pwd)).map((r) => r.message);
  };

  // Force du mot de passe
  const getPasswordStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    return strength;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      return setError("❌ Les mots de passe ne correspondent pas");
    }

    const invalidRules = validatePassword(password);
    if (invalidRules.length > 0) {
      return setError("❌ Votre mot de passe doit contenir : " + invalidRules.join(", "));
    }

    try {
      const res = await fetch("http://localhost:5000/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess("✅ Mot de passe réinitialisé avec succès !");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setError(data.message || "Erreur lors de la réinitialisation");
      }
    } catch (err) {
      setError("❌ Erreur de connexion au serveur");
    }
  };

  // Niveau de force
  const strength = getPasswordStrength(password);
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-400", "bg-green-600"];
  const strengthText = ["Très faible", "Faible", "Moyen", "Fort", "Très fort"];

  // algoritima mampidina @ alalan'ny touche entrer an'le curseur ho ao @2eme champ formulaire raha feno ny ao @1er champ

  const handleEnter = (e) => {
  if (e.key === "Enter") {
    e.preventDefault(); // empêche la soumission
    const form = e.target.form; // récupère le formulaire
    const index = Array.prototype.indexOf.call(form, e.target); // index du champ actuel
    if (form.elements[index + 1]) {
      form.elements[index + 1].focus(); // focus sur le champ suivant
    }
  }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-900">
          Réinitialiser le mot de passe
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Champ mot de passe */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Nouveau mot de passe"
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 outline-none text-black w-full"
              value={password}
              onKeyDown={handleEnter}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="absolute right-3 top-3 cursor-pointer text-black text-lg"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁"}
            </span>
          </div>

          {/* Barre de force */}
          {password && (
            <div className="w-full mt-1">
              <div className="h-2 w-full bg-gray-200 rounded">
                <div
                  className={`h-2 rounded ${strengthColors[strength - 1]}`}
                  style={{ width: `${(strength / 5) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs mt-1 text-gray-600 text-center">
                Force : <span className="font-semibold">{strengthText[strength - 1]}</span>
              </p>
            </div>
          )}

          {/* Champ confirmation */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirmer le mot de passe"
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 outline-none text-black w-full"
              value={confirmPassword}
              onKeyDown={handleEnter}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span
              className="absolute right-3 top-3 cursor-pointer text-black text-lg"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? "🙈" : "👁"}
            </span>
          </div>

          <button
            className="bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold"
          >
            Réinitialiser
          </button>
        </form>

        {/* Messages */}
        {error && <p className="text-red-600 text-center font-medium mt-4">{error}</p>}
        {success && <p className="text-green-600 text-center font-medium mt-4">{success}</p>}

        <p className="mt-6 text-center text-sm">
          <a href="/login" className="text-green-600 font-semibold">
            Retour à la connexion
          </a>
        </p>
      </div>
    </div>
  );
}



