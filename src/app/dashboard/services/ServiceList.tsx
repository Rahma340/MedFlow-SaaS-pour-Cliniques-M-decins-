"use client";

import { useEffect, useState } from "react";
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "@/lib/services";

export default function ServiceList({ clinicId, currency }: any) {
  const [services, setServices] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadServices() {
    setLoading(true);
    try {
      const data = await getServices(clinicId);
      setServices(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadServices();
  }, [clinicId]);

  async function handleAdd() {
    if (!name || !duration || !price) return alert("Tous les champs sont obligatoires !");
    await createService({ name, duration: Number(duration), price: Number(price), clinicId });
    setName(""); setDuration(""); setPrice("");
    loadServices();
  }

  async function handleEdit(id: string) {
    const s = services.find((srv) => srv.id === id);
    const newName = prompt("Nom du service :", s.name);
    const newDuration = prompt("Durée (min) :", s.duration);
    const newPrice = prompt("Prix :", s.price);
    if (!newName || !newDuration || !newPrice) return;
    await updateService({ id, name: newName, duration: Number(newDuration), price: Number(newPrice) });
    loadServices();
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce service ?")) return;
    await deleteService(id);
    loadServices();
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Services</h2>

      {/* Formulaire d’ajout */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Nom du service"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded-lg p-2 w-1/3"
        />
        <input
          type="number"
          placeholder="Durée (min)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="border rounded-lg p-2 w-1/3"
        />
        <input
          type="number"
          placeholder="Prix"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border rounded-lg p-2 w-1/3"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Ajouter
        </button>
      </div>

      {/* Tableau */}
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <table className="w-full bg-white rounded-lg shadow-sm border border-gray-200">
          <thead className="bg-blue-50">
            <tr className="text-left text-gray-600">
              <th className="p-3">Nom</th>
              <th className="p-3">Durée</th>
              <th className="p-3">Prix ({currency})</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{s.name}</td>
                <td className="p-3">{s.duration} min</td>
                <td className="p-3">{s.price} {currency}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(s.id)}
                    className="text-blue-600 hover:underline"
                  >
                    ✏️ Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="text-red-600 hover:underline"
                  >
                    🗑️ Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
