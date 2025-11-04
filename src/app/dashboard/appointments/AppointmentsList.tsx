"use client";
import { useEffect, useState } from "react";

export default function AppointmentsList({ clinicId }: { clinicId: string }) {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [form, setForm] = useState({
    date: "",
    patientId: "",
    serviceId: "",
    staffId: "",
    notes: "",
  });
  const [patients, setPatients] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);

useEffect(() => {
  async function loadData() {
    const [a, p, s, st] = await Promise.all([
      fetch(`/api/appointments?clinicId=${clinicId}`).then(r => r.json()),
      fetch(`/api/patients?clinicId=${clinicId}`).then(r => r.json()),
      fetch(`/api/services?clinicId=${clinicId}`).then(r => r.json()),
      fetch(`/api/memberships?clinicId=${clinicId}`).then(r => r.json()),
    ]);

    setAppointments(a);
    setPatients(p);
    setServices(s);

    
    setStaff(st.filter((m: any) => m.role?.name === "doctor"));
  }

  loadData();
}, [clinicId]);

  async function handleAdd() {
    if (!form.date || !form.patientId || !form.serviceId)
      return alert("Veuillez remplir les champs obligatoires");

    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, clinicId }),
    });
    const newApp = await res.json();
    setAppointments([newApp, ...appointments]);
    setForm({ date: "", patientId: "", serviceId: "", staffId: "", notes: "" });
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce rendez-vous ?")) return;
    await fetch(`/api/appointments/${id}`, { method: "DELETE" });
    setAppointments(appointments.filter((a) => a.id !== id));
  }

  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/appointments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const updated = await res.json();
    setAppointments(appointments.map((a) => (a.id === id ? updated : a)));
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Rendez-vous</h2>

      {/* Formulaire */}
      <div className="flex flex-wrap gap-2 mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <input
          type="datetime-local"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="border px-3 py-2 rounded"
        />
        <select
          value={form.patientId}
          onChange={(e) => setForm({ ...form, patientId: e.target.value })}
          className="border px-3 py-2 rounded"
        >
          <option value="">Patient</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.firstName} {p.lastName}
            </option>
          ))}
        </select>
        <select
          value={form.serviceId}
          onChange={(e) => setForm({ ...form, serviceId: e.target.value })}
          className="border px-3 py-2 rounded"
        >
          <option value="">Service</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <select
          value={form.staffId}
          onChange={(e) => setForm({ ...form, staffId: e.target.value })}
          className="border px-3 py-2 rounded"
        >
          <option value="">Doctor</option>
          {staff.map((s) => (
            <option key={s.id} value={s.id}>
              {s.user?.name}
            </option>
          ))}
        </select>
        <input
          placeholder="Notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          className="border px-3 py-2 rounded flex-1"
        />
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
            <th className="p-3">Date</th>
            <th className="p-3">Patient</th>
            <th className="p-3">Service</th>
            <th className="p-3">Doctor</th>
            <th className="p-3">Statut</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((a) => (
            <tr key={a.id} className="border-t hover:bg-gray-50">
              <td className="p-3">{new Date(a.date).toLocaleString()}</td>
              <td className="p-3">{a.patient?.firstName} {a.patient?.lastName}</td>
              <td className="p-3">{a.service?.name}</td>
              <td className="p-3">{a.staff?.user?.name || "-"}</td>
              <td className="p-3">
                <select
                  value={a.status}
                  onChange={(e) => updateStatus(a.id, e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value="scheduled">Prévu</option>
                  <option value="done">Terminé</option>
                  <option value="cancelled">Annulé</option>
                </select>
              </td>
              <td className="p-3">
                <button
                  onClick={() => handleDelete(a.id)}
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
