import { TypeName } from '@/types/pokemon'
import { TYPE_COLORS } from '@/lib/theme'
import { Badge } from '@/components/ui/badge'
import { capitalizeFirst } from '@/lib/utils'

interface TypeBadgeProps {
  type: TypeName
  className?: string
}

export function TypeBadge({ type, className }: TypeBadgeProps) {
  const color = TYPE_COLORS[type]
  
  return (
    <Badge
      className={className}
      style={{
        backgroundColor: color,
        color: '#fff',
        border: 'none',
      }}
    >
      {capitalizeFirst(type)}
    </Badge>
  )
}