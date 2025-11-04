"use client";

import { useState } from "react";
import StaffList from "./staff/StaffList";
import PatientsList from "./patients/PatientsList";
import AppointmentsList from "./appointments/AppointmentsList";
import ServiceList from "./services/ServiceList";

export default function DashboardClient({ session, clinic }: any) {
  const [active, setActive] = useState<
    "dashboard" | "staff" | "services" | "settings" | "patients" | "appointments"
  >("dashboard");

  const navItems = [
    { key: "dashboard", label: "Dashboard" },
    { key: "staff", label: `Staff (${clinic.memberships?.length || 0})` },
    { key: "services", label: `Services (${clinic.services?.length || 0})` },
    { key: "patients", label: `Patients (${clinic.patients?.length || 0})` },
    { key: "appointments", label: "Rendez-vous" },
    { key: "settings", label: "Paramètres" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#E3F2FD] shadow-sm min-h-screen p-6">
        <h1 className="text-xl font-bold text-gray-800 mb-8">{clinic.name}</h1>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActive(item.key as any)}
              className={`w-full text-left flex items-center gap-3 p-3 rounded-lg transition ${
                active === item.key
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-blue-100"
              }`}
            >
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        {active === "dashboard" && <DashboardOverview clinic={clinic} session={session} />}
        {active === "staff" && <StaffList clinic={clinic} />}
        {active === "services" && (
        <ServiceList clinicId={clinic.id} currency={clinic.currency} />
)}

        {active === "patients" && <PatientsList clinicId={clinic.id} />}
        {active === "appointments" && <AppointmentsList clinicId={clinic.id} />}
        {active === "settings" && <SettingsView clinic={clinic} />}
      </main>
    </div>
  );
}

function DashboardOverview({ clinic, session }: any) {
  return (
    <>
      <h2 className="text-2xl font-bold mb-4 text-gray-900">
        Bienvenue, {session.user?.name}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Staff" value={clinic.memberships.length} subtitle="Membres" />
        <StatCard title="Services" value={clinic.services.length} subtitle="Offerts" />
        <StatCard title="TVA" value={`${clinic.taxRate}%`} subtitle="Taxe" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité récente</h3>
        <p className="text-gray-500">À venir : affichage dynamique du journal d’activité.</p>
      </div>
    </>
  );
}




function SettingsView({ clinic }: any) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Paramètres</h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <p><strong>Nom :</strong> {clinic.name}</p>
        <p><strong>Devise :</strong> {clinic.currency}</p>
        <p><strong>TVA :</strong> {clinic.taxRate}%</p>
        <p><strong>Mode Stripe Test :</strong> {clinic.stripeTestMode ? "Oui" : "Non"}</p>
        <p><strong>Date de création :</strong> {new Date(clinic.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-gray-600 font-medium mb-2">{title}</h3>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
      <p className="text-sm text-gray-500 mt-2">{subtitle}</p>
    </div>
  );
}
