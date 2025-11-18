"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteStaff } from "./actions";
import StaffForm from "./StaffForm";

export default function StaffList({ clinic }: any) {
  const router = useRouter();
  const [selected, setSelected] = useState<any | null>(null);
  const [openForm, setOpenForm] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce membre ?")) return;
    await deleteStaff(id);
    router.refresh(); // ✅ recharge propre sans reload
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">👨‍⚕️ Staff</h2>

        <button
          onClick={() => { 
            setSelected(null); 
            setOpenForm(true); 
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Ajouter un membre
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden border rounded-xl shadow-sm bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr className="text-left text-gray-600">
              <th className="p-3 font-medium">Nom</th>
              <th className="p-3 font-medium">Email</th>
              <th className="p-3 font-medium">Rôle</th>
              <th className="p-3 font-medium">Date d’ajout</th>
              <th className="p-3 font-medium text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {clinic.memberships?.map((m: any) => (
              <tr key={m.id} className="border-t hover:bg-gray-50 transition">
                
                {/* ✅ Correction du nom */}
                <td className="p-3">
                  {m.user?.firstName || m.user?.lastName
                    ? `${m.user?.firstName ?? ""} ${m.user?.lastName ?? ""}`.trim()
                    : "(À définir)"}
                </td>

                <td className="p-3">{m.user?.email}</td>
                <td className="p-3">{m.role?.name}</td>
                <td className="p-3">
                  {new Date(m.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3 text-right space-x-3">
                  <button
                    onClick={() => { setSelected(m); setOpenForm(true); }}
                    className="text-blue-600 hover:underline"
                  >
                    Modifier
                  </button>

                  <button
                    onClick={() => handleDelete(m.id)}
                    className="text-red-600 hover:underline"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}

            {clinic.memberships?.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  Aucun membre pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* FORM MODAL */}
      {openForm && (
        <StaffForm
          staff={selected}
          clinicId={clinic.id}
          onClose={() => {
            setOpenForm(false);
            router.refresh(); // ✅ mise à jour automatique
          }}
        />
      )}
    </div>
  );
}
