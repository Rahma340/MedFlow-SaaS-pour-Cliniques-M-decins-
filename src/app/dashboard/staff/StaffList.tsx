"use client";
import { useState } from "react";
import { deleteStaff } from "./actions";
import StaffForm from "./StaffForm";

export default function StaffList({ clinic }: any) {
  const [selected, setSelected] = useState<any | null>(null);
  const [openForm, setOpenForm] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Staff</h2>
        <button
          onClick={() => { setSelected(null); setOpenForm(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Ajouter un membre
        </button>
      </div>

      <table className="w-full bg-white rounded-lg shadow-sm border border-gray-200">
        <thead className="bg-blue-50">
          <tr className="text-left text-gray-600">
            <th className="p-3">Nom</th>
            <th className="p-3">Email</th>
            <th className="p-3">Rôle</th>
            <th className="p-3">Date d’ajout</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clinic.memberships.map((m: any) => (
            <tr key={m.id} className="border-t hover:bg-gray-50">
              <td className="p-3">{m.user?.name || "-"}</td>
              <td className="p-3">{m.user?.email}</td>
              <td className="p-3">{m.role?.name}</td>
              <td className="p-3">{new Date(m.createdAt).toLocaleDateString()}</td>
              <td className="p-3 text-right space-x-2">
                <button
                  onClick={() => { setSelected(m); setOpenForm(true); }}
                  className="text-blue-600 hover:underline"
                >
                  Modifier
                </button>
                <button
                  onClick={async () => {
                    if (confirm("Supprimer ce membre ?")) {
                      await deleteStaff(m.id);
                      window.location.reload();
                    }
                  }}
                  className="text-red-600 hover:underline"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {openForm && (
        <StaffForm
          staff={selected}
          onClose={() => setOpenForm(false)}
          clinicId={clinic.id}
        />
      )}
    </div>
  );
}
