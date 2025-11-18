"use client";
import { useState } from "react";

export default function ConsultationForm({ appointmentId, doctorId }: any) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.target);

    const payload = {
      appointmentId,
      doctorId,
      symptoms: form.get("symptoms") as string,
      diagnosis: form.get("diagnosis") as string,
      notes: form.get("notes") as string,
      treatment: form.get("treatment") as string,
    };

    const res = await fetch("/api/consultations/create", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (!res.ok) {
      alert(json.error);
      setLoading(false);
      return;
    }

    alert("Consultation enregistrée !");
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white mt-6 p-6 rounded-xl space-y-4 border shadow">
      <div>
        <label className="font-semibold">Symptômes</label>
        <textarea name="symptoms" className="w-full border p-2 rounded" rows={3} />
      </div>

      <div>
        <label className="font-semibold">Diagnostic</label>
        <textarea name="diagnosis" className="w-full border p-2 rounded" rows={3} />
      </div>

      <div>
        <label className="font-semibold">Notes</label>
        <textarea name="notes" className="w-full border p-2 rounded" rows={3} />
      </div>

      <div>
        <label className="font-semibold">Traitement / Ordonnance</label>
        <textarea name="treatment" className="w-full border p-2 rounded" rows={4} />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {loading ? "Enregistrement..." : "Enregistrer la consultation"}
      </button>
    </form>
  );
}
