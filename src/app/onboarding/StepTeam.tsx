'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { X } from "lucide-react"
import { motion } from "framer-motion"

type StaffMember = {
  firstName: string
  lastName: string
  email: string
  role: 'doctor' | 'Receptionist'
}

interface StepTeamProps {
  onNext: () => void
  onPrev?: () => void
}

export default function StepTeam({ onNext, onPrev }: StepTeamProps) {
  const [members, setMembers] = useState<StaffMember[]>([
    { firstName: '', lastName: '', email: '', role: 'doctor' }
  ])

  const [loading, setLoading] = useState(false)

  function updateMember<K extends keyof StaffMember>(
    index: number,
    field: K,
    value: StaffMember[K]
  ) {
    const updated = [...members]
    updated[index] = { ...updated[index], [field]: value }
    setMembers(updated)
  }

  function addMember() {
    setMembers([...members, { firstName: '', lastName: '', email: '', role: 'doctor' }])
  }

  function removeMember(index: number) {
    setMembers(members.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    await fetch('/api/users/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ members }),
    })

    setLoading(false)
    onNext()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg border border-gray-200"
      >

        <div className="space-y-1 text-center">
          <h2 className="text-gray-500 font-bold text-sm flex items-center justify-center gap-2">
            👩‍⚕️ Équipe & Collaborateurs
          </h2>
          <p className="text-gray-600 text-sm">Ajoutez les membres de votre clinique.</p>
          <div className="w-full h-px bg-gray-200 mt-2"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          {members.map((m, i) => (
            <div key={i} className="relative grid grid-cols-2 gap-3 items-end">
              
              <div>
                <Label className="text-[#1E88E5]">Prénom</Label>
                <Input
                  value={m.firstName}
                  onChange={(e) => updateMember(i, 'firstName', e.target.value)}
                  placeholder="Ex. Ahmed"
                  className="border-blue-200 focus:ring-blue-400"
                />
              </div>

              <div>
                <Label className="text-[#1E88E5]">Nom</Label>
                <Input
                  value={m.lastName}
                  onChange={(e) => updateMember(i, 'lastName', e.target.value)}
                  placeholder="Ex. Ben Ali"
                  className="border-blue-200 focus:ring-blue-400"
                />
              </div>

              <div className="col-span-2">
                <Label className="text-[#1E88E5]">Email</Label>
                <Input
                  type="email"
                  value={m.email}
                  onChange={(e) => updateMember(i, 'email', e.target.value)}
                  placeholder="exemple@domaine.com"
                  className="border-blue-200 focus:ring-blue-400"
                />
              </div>

              <div className="col-span-2">
                <Label className="text-[#1E88E5]">Rôle</Label>
                <select
                  value={m.role}
                  onChange={(e) => updateMember(i, 'role', e.target.value as StaffMember['role'])}
                  className="border-blue-300 rounded px-2 py-2 w-full"
                >
                  <option value="doctor">Docteur</option>
                  <option value="Receptionist">Réceptionniste</option>
                </select>
              </div>

              {members.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMember(i)}
                  className="absolute -right-6 top-8 text-red-500 hover:text-red-700"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          ))}

          <Button
            type="button"
            onClick={addMember}
            variant="outline"
            className="w-full border-blue-300 text-[#1E88E5]"
          >
            + Ajouter un membre
          </Button>

          <div className="flex justify-between pt-4">
            {onPrev && (
              <Button type="button" variant="ghost" onClick={onPrev}>
                ← Retour
              </Button>
            )}

            <Button type="submit" className="bg-[#1E88E5] hover:bg-[#1565C0]" disabled={loading}>
              {loading ? "Enregistrement..." : "Suivant →"}
            </Button>
          </div>

        </form>
      </motion.div>
    </div>
  )
}
