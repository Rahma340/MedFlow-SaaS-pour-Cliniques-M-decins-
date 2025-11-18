'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { X } from "lucide-react"
import { motion,  } from 'framer-motion'

type Service = {
  name: string
  duration: number | ""
  price: number | ""
}

interface StepServicesProps {
  onNext: () => void
  onPrev?: () => void
}

export default function StepServices({ onNext, onPrev }: StepServicesProps) {
  const [services, setServices] = useState<Service[]>([
    { name: '', duration: "", price: "" }
  ])
  const [loading, setLoading] = useState(false)

  function updateService<K extends keyof Service>(index: number, field: K, value: Service[K]) {
    const updated = [...services]
    updated[index] = { ...updated[index], [field]: value }
    setServices(updated)
  }

  function addService() {
    setServices([...services, { name: '', duration: "", price: "" }])
  }

  function removeService(index: number) {
    setServices(services.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const formattedServices = services.map(s => ({
      ...s,
      duration: Number(s.duration),
      price: Number(s.price)
    }))

    await fetch('/api/services/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ services: formattedServices }),
    })

    onNext()
    setLoading(false)
  }

  return (
    
      
           <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg border border-gray-200"
    >
       
        <div className="space-y-1 text-center">
          <h2 className="text-gray-500 font-bold text-sm flex items-center justify-center gap-2">
             Services & Tarifs
          </h2>
          <p className="text-gray-600 text-sm">
            Définissez les prestations proposées par votre clinique.
          </p>
          <div className="w-full h-px bg-gray-200 mt-2"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          
          {services.map((s, i) => (
            <div key={i} className="relative grid grid-cols-3 gap-3 items-end">
              
              <div>
                <Label className="text-[#646363]">Nom</Label>
                <Input
                  value={s.name}
                  onChange={(e) => updateService(i, 'name', e.target.value)}
                  placeholder="Ex. Consultation"
                  className="border-blue-200 focus:ring-blue-400"
                />
              </div>

              <div>
                <Label className="text-[#646363]">Durée (min)</Label>
                <Input
                  type="number"
                  value={s.duration}
                  onChange={(e) => updateService(i, 'duration', e.target.value === "" ? "" : Number(e.target.value))}
                  className="border-blue-200 focus:ring-blue-400"
                />
              </div>

              <div>
                <Label className="text-[#646363]">Prix (TND)</Label>
                <Input
                  type="number"
                  value={s.price}
                  onChange={(e) => updateService(i, 'price', e.target.value === "" ? "" : Number(e.target.value))}
                  className="border-blue-200 focus:ring-blue-400"
                />
              </div>

              {services.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeService(i)}
                  className="absolute -right-8 top-3 text-red-500 hover:text-red-700"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          ))}

          <Button type="button" onClick={addService} variant="outline" className="w-full border-blue-300 text-blue-600">
            + Ajouter un service
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
  )
}
