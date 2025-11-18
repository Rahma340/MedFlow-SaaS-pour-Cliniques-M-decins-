"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createStaff, updateStaff } from "./actions";

export default function StaffForm({ staff, clinicId, onClose }: any) {
  const router = useRouter();
  const [email, setEmail] = useState(staff?.user?.email || "");
  const [firstName, setFirstName] = useState(staff?.user?.firstName || "");
  const [lastName, setLastName] = useState(staff?.user?.lastName || "");
  const [role, setRole] = useState(staff?.role?.name || "DOCTOR");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (staff) {
        // Update staff
        await updateStaff(staff.id, { firstName, lastName, role });
      } else {
        // Create staff
        await createStaff({ clinicId, email, firstName, lastName, role });
      }

      onClose();
      router.refresh(); // ✅ Recharge les données sans reload complet
    } catch (err) {
      console.error("Erreur:", err);
      alert("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-[420px] shadow-xl space-y-4">
        <h2 className="text-lg font-semibold">
          {staff ? "Modifier le membre" : "Ajouter un membre"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!staff && (
            <div>
              <label>Email</label>
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}

          <div className="flex gap-3">
            <div className="flex-1">
              <label>Prénom</label>
              <input
                className="input"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div className="flex-1">
              <label>Nom</label>
              <input
                className="input"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label>Rôle</label>
            <select className="input" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="DOCTOR">Docteur</option>
              <option value="RECEPTIONIST">Réceptionniste</option>
              <option value="NURSE">Infirmier</option>
              <option value="ADMIN">Administrateur</option>
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="btn-secondary">
              Annuler
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "En cours..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
