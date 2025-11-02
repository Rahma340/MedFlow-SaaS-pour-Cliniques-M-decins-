'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

type StaffMember = {
  firstName: string
  lastName: string
  email: string
  role: 'Doctor' | 'Receptionist'
}

interface StepTeamProps {
  onNext: () => void
    onPrev?: () => void
}

export default function StepTeam({ onNext }: StepTeamProps) {
  const [members, setMembers] = useState<StaffMember[]>([
    { firstName: '', lastName: '', email: '', role: 'Doctor' },
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
    setMembers([
      ...members,
      { firstName: '', lastName: '', email: '', role: 'Doctor' },
    ])
  }

  function removeMember(index: number) {
    setMembers(members.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/users/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ members }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? 'Erreur lors de l’invitation du staff')
      }
      onNext()
    } catch (err) {
      if (err instanceof Error) alert(err.message)
      else alert('Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">👩‍⚕️ Équipe médicale</h2>
      <p className="text-sm text-muted-foreground">
        Ajoutez les membres de votre équipe (médecins, réceptionnistes).
      </p>

      {members.map((m, i) => (
        <div
          key={i}
          className="grid grid-cols-5 items-end gap-2 border-b pb-2 mb-2"
        >
          <div className="col-span-1">
            <Label>Prénom</Label>
            <Input
              value={m.firstName}
              onChange={(e) =>
                updateMember(i, 'firstName', e.target.value)
              }
              placeholder="Ex. Ahmed"
            />
          </div>
          <div className="col-span-1">
            <Label>Nom</Label>
            <Input
              value={m.lastName}
              onChange={(e) => updateMember(i, 'lastName', e.target.value)}
              placeholder="Ex. Ben Ali"
            />
          </div>
          <div className="col-span-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={m.email}
              onChange={(e) => updateMember(i, 'email', e.target.value)}
              placeholder="exemple@domaine.com"
            />
          </div>
          <div className="col-span-1 flex items-center gap-2">
            <select
              value={m.role}
              onChange={(e) =>
                updateMember(i, 'role', e.target.value as StaffMember['role'])
              }
              className="border p-2 rounded w-full"
            >
              <option value="Doctor">Médecin</option>
              <option value="Receptionist">Réceptionniste</option>
            </select>
          </div>
          {members.length > 1 && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => removeMember(i)}
            >
              ✕
            </Button>
          )}
        </div>
      ))}

      <div className="flex justify-between">
        <Button type="button" onClick={addMember} variant="outline">
          + Ajouter un membre
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Envoi...' : 'Suivant'}
        </Button>
      </div>
    </form>
  )
}
