"use client";
import { useState } from "react";
import { createStaff, updateStaff } from "./actions";

export default function StaffForm({ staff, clinicId, onClose }: any) {
  const [email, setEmail] = useState(staff?.user?.email || "");
  const [name, setName] = useState(staff?.user?.name || "");
  const [role, setRole] = useState(staff?.role?.name || "doctor");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (staff) {
      await updateStaff(staff.id, { name, role });
    } else {
      await createStaff({ email, name, role, clinicId });
    }

    setLoading(false);
    onClose();
    window.location.reload();
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-[400px] shadow-lg">
        <h2 className="text-lg font-semibold mb-4">
          {staff ? "Modifier le membre" : "Ajouter un membre"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!staff && (
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className="border rounded p-2 w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Nom</label>
            <input
              type="text"
              className="border rounded p-2 w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Rôle</label>
            <select
              className="border rounded p-2 w-full"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option>doctor</option>
              <option>Réceptionniste</option>
              <option>Infirmier</option>
              <option>Administrateur</option>
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="border border-gray-300 px-4 py-2 rounded"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {loading ? "En cours..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
