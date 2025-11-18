'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Building2, CheckCircle, Loader2 } from 'lucide-react'

interface StepClinicInfoProps {
  onNext: () => Promise<void> | void
  onPrev?: () => void
}

export default function StepClinicInfo({ onNext }: StepClinicInfoProps) {
  const [name, setName] = useState('')
  const [focused, setFocused] = useState(false)
  const [loading, setLoading] = useState(false)

  const isValid = name.trim().length >= 7

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid) return
    setLoading(true)

    await fetch('/api/clinic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })

    await onNext()
    setLoading(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg border border-gray-200"
    >
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 text-blue-600 rounded-full shadow-sm">
          <Building2 size={32} />
        </div>
        <p className="text-gray-500 font-bold text-sm">Nommez votre établissement pour commencer.</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-2 relative">
          <Label className="text-sm font-medium text-[#1E88E5]">Nom de la clinique</Label>

          <motion.div
            animate={{
              boxShadow: focused
                ? '0 0 0 4px rgba(30,136,229,0.35)'
                : '0 0 0 0 transparent',
            }}
            className="rounded-lg transition"
          >
            <Input
              className="h-12 text-base border-blue-200 focus:ring-blue-400"
              placeholder="Ex : Clinique El Amen"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
          </motion.div>

          <AnimatePresence>
            {isValid && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2 text-green-600 text-sm mt-1"
              >
                <CheckCircle size={18} /> Nom valide
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div whileTap={{ scale: 0.97 }}>
          <Button
            type="submit"
            disabled={!isValid || loading}
            className="w-full h-12 text-base font-semibold flex items-center justify-center bg-[#1E88E5] hover:bg-[#1565C0]"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                Création…
              </>
            ) : (
              'Continuer'
            )}
          </Button>
        </motion.div>
      </form>
    </motion.div>
  )
}
