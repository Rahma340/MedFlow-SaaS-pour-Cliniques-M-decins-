"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import AppointmentsList from "../appointments/AppointmentsList";

export default function DoctorDashboardClient({ session, clinic }: any) {
  const [active, setActive] = useState<"appointments">("appointments");

  return (
    <div className="min-h-screen flex">
      <aside className="w-60 p-6 bg-white border-r">
        <h1 className="font-bold text-xl mb-6">Docteur</h1>

        <button
          onClick={() => setActive("appointments")}
          className="w-full text-left p-3 rounded hover:bg-gray-100 bg-blue-600 text-white"
        >
          📅 Mes Rendez-vous
        </button>
      </aside>

      <main className="p-8 flex-1">
        <AppointmentsList clinicId={clinic.id} />
      </main>
    </div>
  );
}
