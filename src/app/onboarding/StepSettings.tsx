'use client'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'

type Settings = {
  taxRate: number
  currency: string
  stripeTestMode: boolean
}

interface StepSettingsProps {
  onNext: () => void
    onPrev?: () => void
}

export default function StepSettings({ onNext }: StepSettingsProps) {
  const [settings, setSettings] = useState<Settings>({
    taxRate: 0,
    currency: 'EUR',
    stripeTestMode: true,
  })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/clinic/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      if (!res.ok) throw new Error('Erreur lors de la sauvegarde des paramètres')
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
      <h2 className="text-xl font-semibold">⚙️ Paramètres généraux</h2>
      <p className="text-sm text-muted-foreground">
        Définissez vos préférences de facturation et de paiement.
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Devise</Label>
          <Input
            value={settings.currency}
            onChange={(e) =>
              setSettings({ ...settings, currency: e.target.value })
            }
            placeholder="EUR, USD, etc."
          />
        </div>
        <div>
          <Label>Taux de taxe (%)</Label>
          <Input
            type="number"
            value={settings.taxRate}
            onChange={(e) =>
              setSettings({ ...settings, taxRate: Number(e.target.value) })
            }
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          checked={settings.stripeTestMode}
          onCheckedChange={(v: boolean) =>
            setSettings({ ...settings, stripeTestMode: v })
          }
        />
        <Label>Activer le mode test Stripe</Label>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Enregistrement...' : 'Terminer la configuration'}
      </Button>
    </form>
  )
}
