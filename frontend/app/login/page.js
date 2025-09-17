"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [progress, setProgress] = useState(100);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok && data.message.includes("Connexion réussie")) {
      setShowToast(true);
      setProgress(100);

      let timer = 0;
      const interval = setInterval(() => {
        timer += 1;
        setProgress((prev) => prev - 20);
        if (timer === 5) {
          clearInterval(interval);
          router.push("/dashboard");
        }
      }, 1000);
    } else {
      setError(data.error || "Email ou mot de passe incorrect ❌");
    }

    setLoading(false);
  };

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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500 relative">
      {/* ✅ Toast de succès */}
      {showToast && (
        <div className="fixed top-5 right-5 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg w-72">
          <p className="font-semibold">Connexion réussie ✅</p>
          <div className="w-full bg-green-800 h-2 rounded mt-2">
            <div
              className="bg-white h-2 rounded"
              style={{ width: `${progress}%`, transition: "width 1s linear" }}
            ></div>
          </div>
        </div>
      )}

      {/* ✅ Formulaire */}
      <div className="bg-white shadow-xl rounded-xl p-8 w-96">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Connexion
        </h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {/* Champ email en minuscules */}
          <input
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 outline-none text-black"
            type="email"
            placeholder="Adresse email"
            value={email}
            onKeyDown={handleEnter}
            onChange={(e) => setEmail(e.target.value.toLowerCase())}
            required
          />

          {/* Champ mot de passe avec 👁 */}
          <div className="relative">
            <input
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 outline-none text-black w-full"
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
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

          {/* Bouton connexion */}
          <button
            disabled={loading}
            className={`${
              loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
            } text-white py-3 rounded-lg transition font-semibold`}
          >
            {loading ? "Connexion en cours..." : "Se connecter"}
          </button>

          {/* ✅ Message d'erreur */}
          {error && (
            <p className="text-red-600 text-center font-medium mt-2">{error}</p>
          )}
        </form>

        {/* Liens utiles */}
        <p className="mt-4 text-center">
          <a
            href="/forgot-password"
            className="text-sm text-green-600 hover:underline font-semibold"
          >
            Mot de passe oublié ?
          </a>
        </p>

        <p className="mt-6 text-center text-gray-600 text-sm">
          Pas encore de compte ?{" "}
          <a
            href="/signup"
            className="text-green-600 hover:underline font-semibold"
          >
            Créer un compte
          </a>
        </p>
      </div>
    </div>
  );
}

