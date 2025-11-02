'use client'
import { Button } from '@/components/ui/button'

export default function StepFinish() {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-4 py-10">
      <h2 className="text-2xl font-semibold">Félicitations !</h2>
      <p className="text-muted-foreground max-w-sm">
        Votre clinique est prête. Vous pouvez maintenant accéder à votre tableau de bord
        et commencer à gérer vos patients, rendez-vous et paiements.
      </p>
      <Button
        onClick={() => (window.location.href = '/dashboard')}
        className="mt-4"
      >
        Aller au tableau de bord
      </Button>
    </div>
  )
}
