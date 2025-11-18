"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import PatientsList from "../patients/PatientsList";
import AppointmentsList from "../appointments/AppointmentsList";

export default function ReceptionDashboardClient({ session, clinic }: any) {
  const [active, setActive] = useState<"patients" | "appointments">("patients");

  const navItems = [
    { key: "patients", label: `🧑 Patients (${clinic.patients.length})` },
    { key: "appointments", label: "📅 Rendez-vous" },
  ];

  return (
    <div className="min-h-screen flex">
      <aside className="w-60 p-6 bg-white border-r">
        <h1 className="font-bold text-xl mb-6">Réception</h1>

        {navItems.map((i) => (
          <button
            key={i.key}
            onClick={() => setActive(i.key as any)}
            className={`w-full text-left p-3 rounded ${
              active === i.key ? "bg-blue-600 text-white" : "hover:bg-gray-100"
            }`}
          >
            {i.label}
          </button>
        ))}
      </aside>

      <main className="p-8 flex-1">
        {active === "patients" && <PatientsList clinicId={clinic.id} />}
        {active === "appointments" && <AppointmentsList clinicId={clinic.id} />}
      </main>
    </div>
  );
}
