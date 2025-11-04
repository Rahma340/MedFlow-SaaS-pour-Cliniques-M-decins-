"use client";
import { useEffect, useState } from "react";

export default function PatientsList({ clinicId }: { clinicId: string }) {
  const [patients, setPatients] = useState<any[]>([]);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
  });

useEffect(() => {
  fetch(`/api/patients?clinicId=${clinicId}`)
    .then(r => r.json())
    .then(setPatients);
}, [clinicId]);


  async function handleAdd() {
    if (!form.firstName || !form.lastName) return alert("Nom et prénom requis");

    const res = await fetch("/api/patients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, clinicId }),
    });

    const newPatient = await res.json();
    setPatients([newPatient, ...patients]);
    setForm({ firstName: "", lastName: "", email: "", phone: "", gender: "" });
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce patient ?")) return;
    await fetch(`/api/patients/${id}`, { method: "DELETE" });
    setPatients(patients.filter(p => p.id !== id));
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Patients</h2>

      {/* Formulaire d'ajout */}
      <div className="flex flex-wrap gap-2 mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <input
          placeholder="Prénom"
          value={form.firstName}
          onChange={e => setForm({ ...form, firstName: e.target.value })}
          className="border px-3 py-2 rounded"
        />
        <input
          placeholder="Nom"
          value={form.lastName}
          onChange={e => setForm({ ...form, lastName: e.target.value })}
          className="border px-3 py-2 rounded"
        />
        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          className="border px-3 py-2 rounded"
        />
        <input
          placeholder="Téléphone"
          value={form.phone}
          onChange={e => setForm({ ...form, phone: e.target.value })}
          className="border px-3 py-2 rounded"
        />
        <select
          value={form.gender}
          onChange={e => setForm({ ...form, gender: e.target.value })}
          className="border px-3 py-2 rounded"
        >
          <option value="">Sexe</option>
          <option value="M">Homme</option>
          <option value="F">Femme</option>
        </select>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Ajouter
        </button>
      </div>

      {/* Liste */}
      <table className="w-full bg-white rounded-lg shadow-sm border border-gray-200">
        <thead className="bg-blue-50">
          <tr className="text-left text-gray-700">
            <th className="p-3">Nom</th>
            <th className="p-3">Email</th>
            <th className="p-3">Téléphone</th>
            <th className="p-3">Sexe</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p.id} className="border-t hover:bg-gray-50">
              <td className="p-3">{p.firstName} {p.lastName}</td>
              <td className="p-3">{p.email || "-"}</td>
              <td className="p-3">{p.phone || "-"}</td>
              <td className="p-3">{p.gender || "-"}</td>
              <td className="p-3">
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-red-500 hover:underline"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
