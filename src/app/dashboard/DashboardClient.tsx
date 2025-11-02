'use client';

import { useState } from "react";

export default function DashboardClient({ session, clinic }: any) {
  const [active, setActive] = useState<"dashboard" | "staff" | "services" | "settings">("dashboard");

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#E3F2FD] shadow-sm min-h-screen p-6">
        <h1 className="text-xl font-bold text-gray-800 mb-8">{clinic.name}</h1>

        <nav className="space-y-2">
          {[
            { key: "dashboard", label: "Dashboard" },
            { key: "staff", label: `Staff (${clinic.memberships.length})` },
            { key: "services", label: `Services (${clinic.services.length})` },
            { key: "settings", label: "Settings" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setActive(item.key as any)}
              className={`w-full text-left flex items-center gap-3 p-3 rounded-lg ${
                active === item.key
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-blue-100"
              }`}
            >
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8">
        {active === "dashboard" && <DashboardOverview clinic={clinic} session={session} />}
        {active === "staff" && <StaffList clinic={clinic} />}
        {active === "services" && <ServiceList clinic={clinic} />}
        {active === "settings" && <SettingsView clinic={clinic} />}
      </div>
    </div>
  );
}
function DashboardOverview({ clinic, session }: any) {
  return (
    <>
      <h2 className="text-2xl font-bold mb-4 text-gray-900">
        Welcome, {session.user?.name}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Staff" value={clinic.memberships.length} subtitle="Members" />
        <StatCard title="Services" value={clinic.services.length} subtitle="Offered" />
        <StatCard title="Tax" value={`${clinic.taxRate}%`} subtitle="TVA" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <p className="text-gray-500">À venir : affichage dynamique du journal d’activité.</p>
      </div>
    </>
  );
}

function StaffList({ clinic }: any) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Staff</h2>
      <table className="w-full bg-white rounded-lg shadow-sm border border-gray-200">
        <thead className="bg-blue-50">
          <tr className="text-left text-gray-600">
            <th className="p-3">Nom</th>
            <th className="p-3">Email</th>
            <th className="p-3">Rôle</th>
            <th className="p-3">Date d’ajout</th>
          </tr>
        </thead>
        <tbody>
          {clinic.memberships.map((m: any) => (
            <tr key={m.id} className="border-t hover:bg-gray-50">
              <td className="p-3">{m.user?.name || "-"}</td>
              <td className="p-3">{m.user?.email}</td>
              <td className="p-3">{m.role?.name}</td>
              <td className="p-3">{new Date(m.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ServiceList({ clinic }: any) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Services</h2>
      <table className="w-full bg-white rounded-lg shadow-sm border border-gray-200">
        <thead className="bg-blue-50">
          <tr className="text-left text-gray-600">
            <th className="p-3">Nom</th>
            <th className="p-3">Durée</th>
            <th className="p-3">Prix</th>
            <th className="p-3">Créé le</th>
          </tr>
        </thead>
        <tbody>
          {clinic.services.map((s: any) => (
            <tr key={s.id} className="border-t hover:bg-gray-50">
              <td className="p-3">{s.name}</td>
              <td className="p-3">{s.duration} min</td>
              <td className="p-3">{s.price} {clinic.currency}</td>
              <td className="p-3">{new Date(s.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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

