'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

type Service = {
  name: string
  duration: number
  price: number
}

interface StepServicesProps {
  onNext: () => void
  onPrev?: () => void 
}

export default function StepServices({ onNext }: StepServicesProps) {
  const [services, setServices] = useState<Service[]>([
    { name: '', duration: 30, price: 0 },
  ])
  const [loading, setLoading] = useState(false)

 
  function updateService<K extends keyof Service>(
    index: number,
    field: K,
    value: Service[K]
  ) {
    const updated = [...services]
    updated[index] = { ...updated[index], [field]: value }
    setServices(updated)
  }

  function addService() {
    setServices([...services, { name: '', duration: 30, price: 0 }])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/services/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ services }),
      })

      if (!res.ok) throw new Error('Erreur lors de la création des services')
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
      <h2 className="text-xl font-semibold">🧾 Services & Tarifs</h2>
      <p className="text-sm text-muted-foreground">
        Définissez les prestations proposées par votre clinique.
      </p>

      {services.map((s, i) => (
        <div key={i} className="grid grid-cols-3 gap-3">
          <div>
            <Label>Nom</Label>
            <Input
              value={s.name}
              onChange={(e) => updateService(i, 'name', e.target.value)}
              placeholder="Ex. Consultation"
            />
          </div>
          <div>
            <Label>Durée (min)</Label>
            <Input
              type="number"
              value={s.duration}
              onChange={(e) =>
                updateService(i, 'duration', Number(e.target.value))
              }
            />
          </div>
          <div>
            <Label>Prix (€)</Label>
            <Input
              type="number"
              value={s.price}
              onChange={(e) =>
                updateService(i, 'price', Number(e.target.value))
              }
            />
          </div>
        </div>
      ))}

      <Button type="button" onClick={addService} variant="outline">
        + Ajouter un service
      </Button>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Enregistrement...' : 'Suivant'}
      </Button>
    </form>
  )
}
