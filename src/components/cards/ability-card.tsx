'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAbilityDetails } from '@/hooks/use-pokemon'
import { capitalizeFirst } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface AbilityCardProps {
  abilityName: string
  isHidden?: boolean
}

export function AbilityCard({ abilityName, isHidden = false }: AbilityCardProps) {
  const { data: abilityDetails, isLoading, error } = useAbilityDetails(abilityName)
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {capitalizeFirst(abilityName.replace('-', ' '))}
          </CardTitle>
          {isHidden && (
            <Badge variant="secondary">Hidden Ability</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading ability description...</span>
          </div>
        ) : error ? (
          <p className="text-muted-foreground">
            Failed to load ability description.
          </p>
        ) : (
          <p className="text-muted-foreground leading-relaxed">
            {abilityDetails?.description}
          </p>
        )}
      </CardContent>
    </Card>
  )
}