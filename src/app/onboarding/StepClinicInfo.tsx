'use client'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'


interface StepClinicInfoProps {
  onNext: () => Promise<void> | void
    onPrev?: () => void
}

export default function StepClinicInfo({ onNext }: StepClinicInfoProps) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/clinic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      const j = await res.json().catch(() => ({}))
      if (!res.ok) {
        alert(`Erreur création clinique: ${j.error ?? res.statusText}`)
        return
      }

      
      await onNext()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Créer votre clinique</h2>
      <p className="text-sm text-muted-foreground">
        Entrez les informations principales de votre clinique pour commencer.
      </p>

      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <Label>Nom de la clinique</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex. Clinique Ibn Khaldoun"
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Création…' : 'Créer la clinique'}
        </Button>
      </form>
    </div>
  )
}
