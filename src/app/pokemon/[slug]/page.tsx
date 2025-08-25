'use client'

import { use } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TypeBadge } from '@/components/cards/type-badge'
import { AbilityCard } from '@/components/cards/ability-card'
import { EvolutionChainDisplay } from '@/components/cards/evolution-chain'
import { StatBar } from '@/components/charts/stat-bar'
import { PokemonRadarChart } from '@/components/charts/radar-chart'
import { usePokemonDetails } from '@/hooks/use-pokemon'
import { useCompareStore } from '@/store/compare'
import { applyTypeTheme } from '@/lib/theme'
import { capitalizeFirst, formatNumber } from '@/lib/utils'
import { formatStatName } from '@/lib/poke-api'
import { Heart, ArrowLeft, Share2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

interface PokemonDetailPageProps {
  params: Promise<{ slug: string }>
}

export default function PokemonDetailPage({ params }: PokemonDetailPageProps) {
  const { slug } = use(params)
  const { data: pokemon, isLoading, error } = usePokemonDetails(slug)
  const { addPokemon, removePokemon, isPokemonSelected, canAddMore } = useCompareStore()
  
  useEffect(() => {
    if (pokemon && pokemon.types.length > 0) {
      applyTypeTheme(pokemon.types.map(t => t.type.name))
    }
  }, [pokemon])
  
  const handleToggleCompare = () => {
    if (!pokemon) return
    
    if (isPokemonSelected(pokemon.id)) {
      removePokemon(pokemon.id)
    } else if (canAddMore()) {
      addPokemon({
        id: pokemon.id,
        name: pokemon.name,
        types: pokemon.types.map(t => t.type.name),
        baseStats: pokemon.base_stats.reduce((acc, stat) => {
          acc[stat.stat.name] = stat.base_stat
          return acc
        }, {} as Record<string, number>),
        sprite: pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default || '',
      })
    }
  }
  
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="aspect-square bg-gray-200 rounded-lg" />
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-32" />
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="flex gap-2">
              <div className="h-6 bg-gray-200 rounded-full w-16" />
              <div className="h-6 bg-gray-200 rounded-full w-16" />
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  if (error || !pokemon) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-2xl font-bold mb-4">Pokémon not found</h1>
        <p className="text-muted-foreground mb-6">
          The Pokémon you&apos;re looking for doesn&apos;t exist or couldn&apos;t be loaded.
        </p>
        <Button asChild>
          <Link href="/pokedex">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Pokédex
          </Link>
        </Button>
      </div>
    )
  }
  
  const imageUrl = pokemon.sprites.other?.['official-artwork']?.front_default 
    || pokemon.sprites.front_default 
    || '/placeholder-pokemon.png'
  
  const shinyImageUrl = pokemon.sprites.other?.['official-artwork']?.front_shiny 
    || pokemon.sprites.front_shiny
  
  const baseStat = pokemon.base_stats.reduce((total, stat) => total + stat.base_stat, 0)
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost">
          <Link href="/pokedex">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Pokédex
          </Link>
        </Button>
        
        <div className="flex gap-2">
          <Button
            variant={isPokemonSelected(pokemon.id) ? "default" : "outline"}
            onClick={handleToggleCompare}
            disabled={!isPokemonSelected(pokemon.id) && !canAddMore()}
          >
            <Heart className={`mr-2 h-4 w-4 ${isPokemonSelected(pokemon.id) ? 'fill-current' : ''}`} />
            {isPokemonSelected(pokemon.id) ? 'Remove from Compare' : 'Add to Compare'}
          </Button>
          
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>
      
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start"
      >
        <div className="relative">
          <div className="aspect-square brand-gradient rounded-lg p-8 flex items-center justify-center">
            <Image
              src={imageUrl}
              alt={pokemon.name}
              width={400}
              height={400}
              className="object-contain"
              priority
            />
          </div>
          
          {shinyImageUrl && (
            <div className="mt-4 relative">
              <div className="aspect-square bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg p-6 flex items-center justify-center">
                <Image
                  src={shinyImageUrl}
                  alt={`Shiny ${pokemon.name}`}
                  width={200}
                  height={200}
                  className="object-contain"
                />
              </div>
              <Badge variant="secondary" className="absolute top-2 left-2">
                ✨ Shiny
              </Badge>
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-4xl font-bold brand-text">
                {capitalizeFirst(pokemon.name)}
              </h1>
              <span className="text-2xl text-muted-foreground">
                #{pokemon.id.toString().padStart(3, '0')}
              </span>
            </div>
            
            <div className="flex gap-2 mb-4">
              {pokemon.types.map((type) => (
                <TypeBadge key={type.slot} type={type.type.name} />
              ))}
            </div>
            
            {pokemon.flavor_text && (
              <p className="text-lg text-muted-foreground leading-relaxed">
                {pokemon.flavor_text}
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-4 text-center">
                <div className="text-xl sm:text-2xl font-bold">{pokemon.height / 10}m</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Height</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-4 text-center">
                <div className="text-xl sm:text-2xl font-bold">{pokemon.weight / 10}kg</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Weight</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
      
      {/* Detailed Information */}
      <Tabs defaultValue="stats" className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-auto">
          <TabsTrigger value="stats" className="text-xs sm:text-sm px-2 py-2">Stats</TabsTrigger>
          <TabsTrigger value="abilities" className="text-xs sm:text-sm px-2 py-2">Abilities</TabsTrigger>
          <TabsTrigger value="moves" className="text-xs sm:text-sm px-2 py-2">Moves</TabsTrigger>
          <TabsTrigger value="evolution" className="text-xs sm:text-sm px-2 py-2">Evolution</TabsTrigger>
        </TabsList>
        
        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Base Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pokemon.base_stats.map((stat) => (
                  <StatBar
                    key={stat.stat.name}
                    name={stat.stat.name}
                    value={stat.base_stat}
                    color="hsl(var(--brand))"
                  />
                ))}
                <div className="pt-4 border-t">
                  <StatBar
                    name="Total"
                    value={baseStat}
                    maxValue={800}
                    color="hsl(var(--brand))"
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Stats Radar</CardTitle>
              </CardHeader>
              <CardContent>
                <PokemonRadarChart pokemon={pokemon} height={250} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="abilities" className="space-y-4">
          {pokemon.abilities.map((ability) => (
            <AbilityCard
              key={ability.ability.name}
              abilityName={ability.ability.name}
              isHidden={ability.is_hidden}
            />
          ))}
        </TabsContent>
        
        <TabsContent value="moves" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pokemon.moves.slice(0, 12).map((move) => (
              <Card key={move.move.name}>
                <CardContent className="pt-4">
                  <h4 className="font-semibold">
                    {capitalizeFirst(move.move.name.replace('-', ' '))}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Level {move.version_group_details[0]?.level_learned_at || '?'}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {pokemon.moves.length > 12 && (
            <div className="text-center">
              <Button variant="outline">
                Show All {pokemon.moves.length} Moves
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="evolution">
          <EvolutionChainDisplay evolutionChain={pokemon.evolution_chain} />
        </TabsContent>
      </Tabs>
    </div>
  )
}