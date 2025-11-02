'use client'

import { useState } from 'react'
import StepClinicInfo from './StepClinicInfo'
import StepServices from './StepServices'
import StepSettings from './StepSettings'
import StepTeam from './StepTeam'
import StepFinish from './StepFinish'

export default function OnboardingPage() {
  const [step, setStep] = useState(0)

  const next = () => setStep((s) => s + 1)
  const prev = () => setStep((s) => Math.max(0, s - 1))

  return (
    <div className="max-w-2xl mx-auto p-6">
      {step === 0 && <StepClinicInfo onNext={next} />}
      {step === 1 && <StepServices onNext={next} onPrev={prev} />}
      {step === 2 && <StepSettings onNext={next} onPrev={prev} />}
      {step === 3 && <StepTeam onNext={next} onPrev={prev} />}
      {step === 4 && <StepFinish />}
    </div>
  )
}
