'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { capitalizeFirst } from '@/lib/utils'
import { EvolutionChain } from '@/types/pokemon'
import { ChevronRight, Loader2 } from 'lucide-react'

interface EvolutionChainProps {
  evolutionChain?: EvolutionChain
}

interface EvolutionStage {
  id: number
  name: string
  sprite: string
  trigger?: string
  level?: number
  item?: string
}

export function EvolutionChainDisplay({ evolutionChain }: EvolutionChainProps) {
  const [evolutionStages, setEvolutionStages] = useState<EvolutionStage[]>([])
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    if (!evolutionChain) return
    
    const parseEvolutionChain = async (chain: any): Promise<EvolutionStage[]> => {
      const stages: EvolutionStage[] = []
      let currentChain = chain
      
      while (currentChain) {
        const pokemonId = extractIdFromUrl(currentChain.species.url)
        
        // Fetch Pokemon data to get sprite
        try {
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
          const pokemonData = await response.json()
          
          const stage: EvolutionStage = {
            id: pokemonId,
            name: currentChain.species.name,
            sprite: pokemonData.sprites?.other?.['official-artwork']?.front_default || 
                    pokemonData.sprites?.front_default || 
                    '/placeholder-pokemon.png'
          }
          
          // Add evolution details for non-base forms
          if (currentChain.evolution_details && currentChain.evolution_details.length > 0) {
            const details = currentChain.evolution_details[0]
            stage.trigger = details.trigger?.name
            stage.level = details.min_level
            stage.item = details.item?.name
          }
          
          stages.push(stage)
        } catch (error) {
          console.error('Failed to fetch Pokemon data for evolution chain:', error)
        }
        
        // Move to next evolution (just take the first one if there are multiple)
        currentChain = currentChain.evolves_to?.[0]
      }
      
      return stages
    }
    
    const loadEvolutionChain = async () => {
      setLoading(true)
      try {
        const stages = await parseEvolutionChain(evolutionChain.chain)
        setEvolutionStages(stages)
      } catch (error) {
        console.error('Failed to parse evolution chain:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadEvolutionChain()
  }, [evolutionChain])
  
  if (!evolutionChain) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">
            No evolution data available for this Pokémon.
          </p>
        </CardContent>
      </Card>
    )
  }
  
  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-muted-foreground">Loading evolution chain...</span>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  if (evolutionStages.length <= 1) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">
            This Pokémon does not evolve.
          </p>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {evolutionStages.map((stage, index) => (
            <div key={stage.id} className="flex items-center gap-4">
              <Link 
                href={`/pokemon/${stage.id}`}
                className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-colors group"
              >
                <div className="relative w-20 h-20">
                  <Image
                    src={stage.sprite}
                    alt={stage.name}
                    fill
                    className="object-contain group-hover:scale-110 transition-transform"
                  />
                </div>
                <span className="font-medium text-center">
                  {capitalizeFirst(stage.name)}
                </span>
                <span className="text-xs text-muted-foreground">
                  #{stage.id.toString().padStart(3, '0')}
                </span>
              </Link>
              
              {index < evolutionStages.length - 1 && (
                <div className="flex flex-col items-center gap-1 mx-2">
                  <ChevronRight className="h-6 w-6 text-muted-foreground" />
                  <div className="text-xs text-center space-y-1">
                    {stage.level && (
                      <Badge variant="outline" className="text-xs">
                        Lv. {stage.level}
                      </Badge>
                    )}
                    {stage.item && (
                      <Badge variant="outline" className="text-xs">
                        {capitalizeFirst(stage.item.replace('-', ' '))}
                      </Badge>
                    )}
                    {stage.trigger && !stage.level && !stage.item && (
                      <Badge variant="outline" className="text-xs">
                        {capitalizeFirst(stage.trigger)}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function extractIdFromUrl(url: string): number {
  return parseInt(url.split('/').slice(-2, -1)[0])
}