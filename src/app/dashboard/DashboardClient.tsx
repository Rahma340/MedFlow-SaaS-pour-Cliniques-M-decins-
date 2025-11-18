"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Users, Layers, UserCheck } from "lucide-react";

import StaffList from "./staff/StaffList";
import PatientsList from "./patients/PatientsList";
import AppointmentsList from "./appointments/AppointmentsList";
import ServiceList from "./services/ServiceList";

export default function DashboardClient({ session, clinic }: any) {
  const [active, setActive] = useState<
    "dashboard" | "staff" | "services" | "settings" | "patients" | "appointments"
  >("dashboard");

  const navItems = [
    { key: "dashboard", label: "🏠 Dashboard" },
    { key: "staff", label: `👨‍⚕️ Staff (${clinic.memberships?.length || 0})` },
    { key: "services", label: `🩺 Services (${clinic.services?.length || 0})` },
    { key: "patients", label: `🧑 Patients (${clinic.patients?.length || 0})` },
    { key: "appointments", label: "📅 Rendez-vous" },
    { key: "settings", label: "⚙️ Paramètres" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">

      {/* === SIDEBAR === */}
      <aside className="w-64 bg-white border-r shadow-sm p-6 flex flex-col">
        <h1 className="text-xl font-bold text-gray-800 mb-8">🩺 {clinic.name}</h1>

        <nav className="space-y-2 flex-1">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActive(item.key as any)}
              className={`w-full text-left flex items-center gap-3 p-3 rounded-lg transition ${
                active === item.key
                  ? "bg-[#1E88E5] text-white shadow"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* === RIGHT SIDE === */}
      <div className="flex-1 flex flex-col">

        {/* ✅ HEADER */}
        <header className="flex justify-between items-center bg-white border-b px-8 py-4 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 capitalize">{active}</h2>

          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-medium">{session.user?.name}</span>

            <button
              onClick={() => signOut()}
              className="px-4 py-2 rounded-md text-white bg-red-500 hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </header>

        {/* === MAIN CONTENT === */}
        <main className="flex-1 p-10">
          {active === "dashboard" && <DashboardOverview clinic={clinic} session={session} />}
          {active === "staff" && <StaffList clinic={clinic} />}
          {active === "services" && <ServiceList clinicId={clinic.id} currency={clinic.currency} />}
          {active === "patients" && <PatientsList clinicId={clinic.id} />}
          {active === "appointments" && (
           <AppointmentsList clinicId={clinic.id} session={session} />
)}

          {active === "settings" && <SettingsView clinic={clinic} />}
        </main>

      </div>
    </div>
  );
}

/* === DASHBOARD OVERVIEW CARDS === */
function DashboardOverview({ clinic, session }: any) {
  return (
    <>
      <h2 className="text-2xl font-bold mb-6 text-gray-900">
        Bienvenue, {session.user?.name}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard title="Staff" value={clinic.memberships?.length ?? 0} subtitle="Membres" icon={Users} />
        <StatCard title="Services" value={clinic.services?.length ?? 0} subtitle="Offerts" icon={Layers} />
        <StatCard title="Patients" value={clinic.patients?.length ?? 0} subtitle="Enregistrés" icon={UserCheck} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">📊 Activité récente</h3>
        <p className="text-gray-500">Affichage dynamique des derniers rendez-vous à venir.</p>
      </div>
    </>
  );
}

/* === STAT CARD === */
function StatCard({ title, value, subtitle, icon: Icon }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
      <div className="bg-blue-100 text-[#1E88E5] p-3 rounded-full">
        <Icon size={24} />
      </div>
      <div>
        <h3 className="text-gray-600 text-sm">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
}

/* === SETTINGS PAGE === */
function SettingsView({ clinic }: any) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">⚙️ Paramètres</h2>
      <p><strong>Nom :</strong> {clinic.name}</p>
      <p><strong>Devise :</strong> {clinic.currency}</p>
      <p><strong>TVA :</strong> {clinic.taxRate}%</p>
      <p><strong>Mode Stripe Test :</strong> {clinic.stripeTestMode ? "Oui" : "Non"}</p>
      <p><strong>Date de création :</strong> {new Date(clinic.createdAt).toLocaleDateString()}</p>
    </div>
  );
}
