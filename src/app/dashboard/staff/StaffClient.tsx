"use client";
import { useState } from "react";
import StaffForm from "./StaffForm";
import { deleteStaff } from "./actions";

export default function StaffClient({ staff, clinicId }: any) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Liste du personnel</h2>
        <button
          onClick={() => { setSelected(null); setOpen(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Ajouter un membre
        </button>
      </div>

      <table className="w-full text-left border-t border-gray-200">
        <thead>
          <tr className="border-b text-gray-600">
            <th className="p-2">Nom</th>
            <th className="p-2">Email</th>
            <th className="p-2">Rôle</th>
            <th className="p-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((m: any) => (
            <tr key={m.id} className="border-b hover:bg-gray-50">
              <td className="p-2">{m.user?.name || "—"}</td>
              <td className="p-2">{m.user?.email}</td>
              <td className="p-2">{m.role?.name}</td>
              <td className="p-2 text-right space-x-2">
                <button
                  onClick={() => { setSelected(m); setOpen(true); }}
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

      {open && (
        <StaffForm
          onClose={() => setOpen(false)}
          staff={selected}
          clinicId={clinicId}
        />
      )}
    </div>
  );
}
