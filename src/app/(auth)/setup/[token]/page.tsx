"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

export default function SetupPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    console.log("🔍 Debug Setup Page:");
    console.log("Params:", params);
    console.log("SearchParams:", searchParams.toString());
    
    const tokenFromParams = params.token as string;
    console.log("🔑 Token from params:", tokenFromParams);
    
    if (tokenFromParams) {
      setToken(tokenFromParams);
      setStatus("ready");
    } else {
      setStatus("error");
    }
  }, [params, searchParams]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const password = formData.get("password");
    
    console.log("📝 Form submitted with:", { token, password });
    
    try {
      const response = await fetch("/api/auth/setup-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      
      const result = await response.json();
      console.log("✅ Server response:", result);
      
      if (response.ok) {
        alert("Mot de passe configuré avec succès!");
        window.location.href = "/sign-in";
      } else {
        alert("Erreur: " + result.error);
      }
    } catch (error) {
      console.error("❌ Request failed:", error);
      alert("Erreur réseau");
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la page de configuration...</p>
        </div>
      </div>
    );
  }

  if (status === "error" || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 text-center mb-4">
            ❌ Lien invalide
          </h1>
          <p className="text-gray-600 text-center">
            Le lien de configuration est invalide ou expiré.
          </p>
          <div className="mt-4 p-3 bg-gray-100 rounded text-sm">
            <p><strong>Debug info:</strong></p>
            <p>Token: {token || "non trouvé"}</p>
            <p>Params: {JSON.stringify(params)}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-center text-gray-900">
            🎯 Configuration du mot de passe
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Créez votre mot de passe pour finaliser votre compte
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Nouveau mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Entrez votre mot de passe (min. 6 caractères)"
            />
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Configurer le mot de passe
            </button>
          </div>
        </form>

        {/* Debug info */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">Informations de débogage:</h3>
          <div className="text-sm text-blue-700 space-y-1">
            <p><strong>Token:</strong> {token}</p>
            <p><strong>Page active:</strong> /setup/{token}</p>
            <p><strong>Statut:</strong> ✅ Page fonctionnelle</p>
          </div>
        </div>
      </div>
    </div>
  );
}