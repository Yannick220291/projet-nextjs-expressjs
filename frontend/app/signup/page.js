"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Validation du mot de passe
  const validatePassword = (pwd) => {
    const newErrors = [];
    if (pwd.length < 6) {
      newErrors.push("Le mot de passe doit contenir au moins 6 caractères.");
    }
    if (!/[A-Z]/.test(pwd)) {
      newErrors.push("Le mot de passe doit contenir au moins une lettre majuscule.");
    }
    if (!/[a-z]/.test(pwd)) {
      newErrors.push("Le mot de passe doit contenir au moins une lettre minuscule.");
    }
    if (!/[0-9]/.test(pwd)) {
      newErrors.push("Le mot de passe doit contenir au moins un chiffre.");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) {
      newErrors.push("Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*).");
    }
    return newErrors;
  };

  // Calcul du niveau de sécurité
  const getPasswordStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 6) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) score++;
    return score;
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const validationErrors = validatePassword(password);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);

    const res = await fetch("http://localhost:5000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage("Compte créé avec succès ✅");
      setTimeout(() => router.push("/login"), 2000);
    } else {
      setMessage(data.error || "Erreur lors de l’inscription ❌");
    }
  };

  const strength = getPasswordStrength(password);
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-600"];
  const strengthText = ["Très faible", "Faible", "Moyen", "Bon", "Excellent"];

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
      <div className="bg-white shadow-xl rounded-xl p-8 w-96">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Créer un compte
        </h1>
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          {/* Champ Username avec majuscule automatique */}
          <input
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none text-black"
            type="text"
            placeholder="Nom d’utilisateur"
            value={username}
            onKeyDown={handleEnter}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length > 0) {
                setUsername(value.charAt(0).toUpperCase() + value.slice(1).toLowerCase());
              } else {
                setUsername("");
              }
            }}
            required
          />

          {/* Champ Email en minuscule */}
          <input
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none text-black"
            type="email"
            placeholder="Adresse email"
            value={email}
            onKeyDown={handleEnter}
            onChange={(e) => setEmail(e.target.value.toLowerCase())}
            required
          />

          {/* Champ mot de passe + œil 👁 */}
          <div className="relative">
            <input
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none text-black w-full pr-10"
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              value={password}
              onKeyDown={handleEnter}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-xl text-black"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁"}
            </span>
          </div>

          {/* Barre de force */}
          {password && (
            <div className="mt-1">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${strengthColors[strength - 1] || "bg-gray-300"}`}
                  style={{ width: `${(strength / 5) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs mt-1 text-gray-600 text-center">
                Force du mot de passe :{" "}
                <span className="font-semibold">
                  {strengthText[strength - 1] || "Aucun"}
                </span>
              </p>
            </div>
          )}

          {/* erreurs affichées en rouge */}
          {errors.length > 0 && (
            <ul className="text-red-600 text-sm font-medium list-disc list-inside">
              {errors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          )}

          <button className="bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-semibold">
            S’inscrire
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-green-600 font-semibold">
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-gray-600 text-sm">
          Déjà un compte ?{" "}
          <a
            href="/login"
            className="text-indigo-600 hover:underline font-semibold"
          >
            Se connecter
          </a>
        </p>
      </div>
    </div>
  );
}






