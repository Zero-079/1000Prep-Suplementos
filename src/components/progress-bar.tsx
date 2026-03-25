"use client"

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const percentage = (currentStep / totalSteps) * 100

  return (
    <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
      <div
        className="bg-primary h-full transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}
