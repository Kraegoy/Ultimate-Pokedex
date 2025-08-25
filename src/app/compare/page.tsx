'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PokemonRadarChart } from '@/components/charts/radar-chart'
import { TypeBadge } from '@/components/cards/type-badge'
import { useCompareStore } from '@/store/compare'
import { capitalizeFirst, formatNumber } from '@/lib/utils'
import { X, Download, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function ComparePage() {
  const { pokemon, removePokemon, clearAll } = useCompareStore()
  
  if (pokemon.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-4xl mb-4">⚖️</div>
        <h1 className="text-2xl font-bold mb-4">No Pokémon to Compare</h1>
        <p className="text-muted-foreground mb-6 text-center max-w-md">
          Add Pokémon from the Pokédex to start comparing their stats, types, and abilities.
        </p>
        <Button asChild>
          <Link href="/pokedex">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Browse Pokédex
          </Link>
        </Button>
      </div>
    )
  }
  
  // Create mock Pokemon objects with the required structure
  const mockPokemonForRadar = pokemon.map(p => ({
    id: p.id,
    name: p.name,
    base_stats: Object.entries(p.baseStats).map(([name, value]) => ({
      base_stat: value,
      effort: 0,
      stat: { name, url: '' }
    })),
    sprites: { front_default: p.sprite, front_shiny: null, other: undefined },
    types: p.types.map((type, index) => ({
      slot: index + 1,
      type: { name: type, url: '' }
    })),
    abilities: [],
    moves: [],
    height: 0,
    weight: 0,
    egg_groups: [],
    generation: 1,
  }))
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Compare Pokémon</h1>
          <p className="text-muted-foreground">
            Compare stats and abilities of your selected Pokémon ({pokemon.length}/4)
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          {pokemon.length > 1 && (
            <Button variant="outline" onClick={clearAll}>
              Clear All
            </Button>
          )}
        </div>
      </div>
      
      {/* Pokemon Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {pokemon.map((p) => (
          <Card key={p.id} className="relative">
            <button
              onClick={() => removePokemon(p.id)}
              className="absolute top-2 right-2 z-10 p-1 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            
            <CardHeader className="pb-2">
              <div className="aspect-square relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg">
                <Image
                  src={p.sprite}
                  alt={p.name}
                  fill
                  className="object-contain p-4"
                />
              </div>
            </CardHeader>
            
            <CardContent>
              <h3 className="font-semibold text-lg mb-2">
                {capitalizeFirst(p.name)}
              </h3>
              <div className="flex gap-1 flex-wrap mb-3">
                {p.types.map((type) => (
                  <TypeBadge key={type} type={type} className="text-xs" />
                ))}
              </div>
              
              <div className="space-y-1 text-sm">
                {Object.entries(p.baseStats).slice(0, 3).map(([stat, value]) => (
                  <div key={stat} className="flex justify-between">
                    <span className="capitalize text-muted-foreground">
                      {stat.replace('_', ' ')}:
                    </span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Add more placeholder */}
        {pokemon.length < 4 && (
          <Card className="border-dashed border-2 flex items-center justify-center min-h-[250px] sm:min-h-[300px]">
            <div className="text-center p-4">
              <div className="text-3xl sm:text-4xl mb-2">➕</div>
              <p className="text-muted-foreground mb-4 text-sm sm:text-base">Add another Pokémon</p>
              <Button asChild variant="outline" size="sm" className="sm:size-default">
                <Link href="/pokedex">Browse Pokédex</Link>
              </Button>
            </div>
          </Card>
        )}
      </div>
      
      {/* Comparison Charts */}
      {pokemon.length > 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Stats Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <PokemonRadarChart pokemon={mockPokemonForRadar} height={300} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Detailed Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Stat</th>
                      {pokemon.map((p) => (
                        <th key={p.id} className="text-center py-2 min-w-[80px]">
                          {capitalizeFirst(p.name)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(pokemon[0].baseStats).map((stat) => (
                      <tr key={stat} className="border-b">
                        <td className="py-2 font-medium capitalize">
                          {stat.replace('_', ' ')}
                        </td>
                        {pokemon.map((p) => (
                          <td key={p.id} className="text-center py-2">
                            <span className="font-mono">
                              {p.baseStats[stat]}
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr className="border-b font-semibold">
                      <td className="py-2">Total</td>
                      {pokemon.map((p) => (
                        <td key={p.id} className="text-center py-2">
                          <span className="font-mono">
                            {Object.values(p.baseStats).reduce((sum, val) => sum + val, 0)}
                          </span>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}