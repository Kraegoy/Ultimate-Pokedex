'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { TypeBadge } from './type-badge'
import { Pokemon } from '@/types/pokemon'
import { getTypeTheme } from '@/lib/theme'
import { capitalizeFirst } from '@/lib/utils'
import { Heart, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCompareStore } from '@/store/compare'

interface PokemonCardProps {
  pokemon: Pokemon
  loading?: boolean
}

export function PokemonCard({ pokemon, loading = false }: PokemonCardProps) {
  const { addPokemon, isPokemonSelected, canAddMore } = useCompareStore()
  
  if (loading || !pokemon || !pokemon.types) {
    return (
      <Card className="group relative overflow-hidden animate-pulse">
        <div className="aspect-square bg-gray-200 rounded-t-lg" />
        <CardContent className="p-4">
          <div className="h-4 bg-gray-200 rounded mb-2" />
          <div className="h-3 bg-gray-200 rounded mb-3 w-16" />
          <div className="flex gap-1">
            <div className="h-5 bg-gray-200 rounded-full w-16" />
            <div className="h-5 bg-gray-200 rounded-full w-16" />
          </div>
        </CardContent>
      </Card>
    )
  }
  
  const theme = getTypeTheme(pokemon.types.map(t => t.type.name))
  const imageUrl = pokemon.sprites?.other?.['official-artwork']?.front_default 
    || pokemon.sprites?.front_default 
    || '/placeholder-pokemon.png'
  
  const handleAddToCompare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!isPokemonSelected(pokemon.id) && canAddMore()) {
      addPokemon({
        id: pokemon.id,
        name: pokemon.name,
        types: pokemon.types.map(t => t.type.name),
        baseStats: pokemon.base_stats.reduce((acc, stat) => {
          acc[stat.stat.name] = stat.base_stat
          return acc
        }, {} as Record<string, number>),
        sprite: imageUrl,
      })
    }
  }
  
  if (loading) {
    return (
      <Card className="group relative overflow-hidden animate-pulse">
        <div className="aspect-square bg-gray-200 rounded-t-lg" />
        <CardContent className="p-4">
          <div className="h-4 bg-gray-200 rounded mb-2" />
          <div className="h-3 bg-gray-200 rounded mb-3 w-16" />
          <div className="flex gap-1">
            <div className="h-5 bg-gray-200 rounded-full w-16" />
            <div className="h-5 bg-gray-200 rounded-full w-16" />
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/pokemon/${pokemon.id}`} aria-label={`View details for ${capitalizeFirst(pokemon.name)}`}>
        <Card className="group relative overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg border-2 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2">
          <div 
            className="absolute inset-0 opacity-10 transition-opacity group-hover:opacity-20"
            style={{ background: theme.gradient }}
          />
          
          <div className="relative aspect-square p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
            <Image
              src={imageUrl}
              alt={pokemon.name}
              fill
              className="object-contain transition-transform group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
            
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 rounded-full"
                onClick={handleAddToCompare}
                disabled={isPokemonSelected(pokemon.id) || !canAddMore()}
              >
                {isPokemonSelected(pokemon.id) ? (
                  <Heart className="h-4 w-4 fill-current" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          <CardContent className="p-3 sm:p-4">
            <h3 className="font-semibold text-base sm:text-lg mb-1 line-clamp-1">
              {capitalizeFirst(pokemon.name)}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
              #{pokemon.id.toString().padStart(3, '0')}
            </p>
            
            <div className="flex gap-1 flex-wrap">
              {pokemon.types.map((type) => (
                <TypeBadge 
                  key={type.slot} 
                  type={type.type.name} 
                  className="text-xs"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}