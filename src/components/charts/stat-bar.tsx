import { Progress } from '@/components/ui/progress'
import { formatStatName } from '@/lib/poke-api'

interface StatBarProps {
  name: string
  value: number
  maxValue?: number
  color?: string
}

export function StatBar({ name, value, maxValue = 255, color = 'hsl(var(--primary))' }: StatBarProps) {
  const percentage = Math.round((value / maxValue) * 100)
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{formatStatName(name)}</span>
        <span className="text-sm font-bold">{value}</span>
      </div>
      <Progress 
        value={percentage} 
        className="h-2"
        style={{
          '--progress-color': color
        } as React.CSSProperties}
      />
    </div>
  )
}