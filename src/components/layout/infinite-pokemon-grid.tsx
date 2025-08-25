'use client'

import { useMemo, useRef, useEffect, useState, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import { usePokemonList, usePokemon } from '@/hooks/use-pokemon'
import { PokemonCard } from '@/components/cards/pokemon-card'
import { useFiltersStore } from '@/store/filters'
import { PokemonListItem, Pokemon } from '@/types/pokemon'
import { Button } from '@/components/ui/button'
import { Loader2, AlertCircle } from 'lucide-react'

interface InfinitePokemonGridProps {
  className?: string
}

// List of legendary Pokemon IDs
const LEGENDARY_POKEMON_IDS = [
  150, 151, // Mewtwo, Mew
  144, 145, 146, // Articuno, Zapdos, Moltres
  243, 244, 245, // Raikou, Entei, Suicune
  249, 250, // Lugia, Ho-Oh
  251, // Celebi
  377, 378, 379, 380, 381, // Regirock, Regice, Registeel, Latias, Latios
  382, 383, 384, // Kyogre, Groudon, Rayquaza
  385, 386, // Jirachi, Deoxys
  480, 481, 482, // Uxie, Mesprit, Azelf
  483, 484, 485, // Dialga, Palkia, Heatran
  486, 487, 488, // Regigigas, Giratina, Cresselia
  489, 490, 491, 492, 493, // Phione, Manaphy, Darkrai, Shaymin, Arceus
  494, // Victini
  638, 639, 640, 641, 642, 643, 644, 645, 646, 647, 648, 649 // Unova legendaries
];

function InfinitePokemonGridContent({ className }: InfinitePokemonGridProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = usePokemonList()
  
  const { 
    search, 
    types, 
    generations, 
    sortBy, 
    sortOrder 
  } = useFiltersStore()
  
  const searchParams = useSearchParams()
  const isLegendaryFilter = searchParams?.get('legendary') === 'true'
  
  const allPokemon = useMemo(() => {
    return data?.pages.flatMap(page => page.results) || []
  }, [data])
  
  // Filter and sort logic would go here
  // For demo purposes, we'll show all pokemon
  const filteredPokemon = useMemo(() => {
    let filtered = allPokemon
    
    // Apply search filter
    if (search) {
      filtered = filtered.filter(pokemon => 
        pokemon.name.toLowerCase().includes(search.toLowerCase()) ||
        pokemon.id.toString().includes(search)
      )
    }
    
    // Apply type filters
    if (types.length > 0) {
      // Note: This is a simplified approach. In a real app, you'd want to
      // pre-fetch type data or filter on the server side for better performance
      // For now, we'll skip type filtering at the list level since it requires
      // individual Pokemon data. The actual filtering happens in the PokemonCardWrapper
      // where we have access to full Pokemon data
    }
    
    // Apply generation filters
    if (generations.length > 0) {
      filtered = filtered.filter(pokemon => {
        // Simple generation logic based on ID ranges
        const gen = getGenerationFromId(pokemon.id)
        return generations.includes(gen)
      })
    }
    
    // Apply legendary filter
    if (isLegendaryFilter) {
      filtered = filtered.filter(pokemon => 
        LEGENDARY_POKEMON_IDS.includes(pokemon.id)
      )
    }
    
    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'id':
          comparison = a.id - b.id
          break
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        default:
          comparison = a.id - b.id
      }
      
      return sortOrder === 'desc' ? -comparison : comparison
    })
    
    return filtered
  }, [allPokemon, search, types, generations, sortBy, sortOrder, isLegendaryFilter])
  
  const { ref: loadMoreRef } = useIntersectionObserver({
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
    threshold: 0.1,
  })
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Failed to load Pokémon</h3>
        <p className="text-muted-foreground text-center mb-4">
          There was an error loading the Pokémon data. Please try again.
        </p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    )
  }
  
  if (isLoading) {
    return (
      <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6 ${className}`}>
        {Array.from({ length: 20 }).map((_, i) => (
          <PokemonCard
            key={i}
            pokemon={{} as Pokemon}
            loading={true}
          />
        ))}
      </div>
    )
  }
  
  if (filteredPokemon.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-4xl mb-4">🔍</div>
        <h3 className="text-lg font-semibold mb-2">No Pokémon found</h3>
        <p className="text-muted-foreground text-center">
          Try adjusting your filters or search terms to find what you&apos;re looking for.
        </p>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6 ${className}`}>
        {filteredPokemon.map((pokemon) => (
          <PokemonCardWrapper key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>
      
      {/* Load more trigger */}
      <div ref={loadMoreRef} className="flex justify-center py-8">
        <AnimatePresence mode="wait">
          {isFetchingNextPage ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="relative">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-primary/40 rounded-full animate-ping" />
              </div>
              <motion.div
                animate={{ 
                  opacity: [0.5, 1, 0.5],
                  scale: [0.95, 1, 0.95]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-center"
              >
                <p className="font-medium text-foreground">Catching more Pokémon...</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {Math.floor(Math.random() * 3) === 0 ? "Almost there!" : 
                   Math.floor(Math.random() * 2) === 0 ? "Loading amazing Pokémon..." : 
                   "Searching the tall grass..."}
                </p>
              </motion.div>
            </motion.div>
          ) : hasNextPage ? (
            <motion.div
              key="load-button"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Button
                variant="outline"
                size="lg"
                onClick={() => fetchNextPage()}
                className="hover:scale-105 transition-transform"
              >
                Load More Pokémon
              </Button>
            </motion.div>
          ) : filteredPokemon.length > 0 ? (
            <motion.div
              key="complete"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-2"
            >
              <div className="text-4xl">🎉</div>
              <p className="text-muted-foreground">
                You&apos;ve caught all {filteredPokemon.length} Pokémon!
              </p>
              <p className="text-sm text-muted-foreground">
                Master Trainer Achievement Unlocked! 
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  )
}

export function InfinitePokemonGrid({ className }: InfinitePokemonGridProps) {
  return (
    <Suspense fallback={<InfinitePokemonGridSkeleton className={className} />}>
      <InfinitePokemonGridContent className={className} />
    </Suspense>
  )
}

function InfinitePokemonGridSkeleton({ className }: InfinitePokemonGridProps) {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6 ${className}`}>
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} className="aspect-[3/4] bg-gray-200 rounded-lg animate-pulse" />
      ))}
    </div>
  )
}

function PokemonCardWrapper({ pokemon }: { pokemon: PokemonListItem }) {
  const { data: fullPokemon, isLoading } = usePokemon(pokemon.id)
  const { types, sortBy } = useFiltersStore()
  
  if (isLoading || !fullPokemon) {
    return <PokemonCard pokemon={{} as Pokemon} loading={true} />
  }
  
  // Apply type filtering at the card level where we have full Pokemon data
  if (types.length > 0) {
    const pokemonTypes = fullPokemon.types.map(t => t.type.name)
    const hasMatchingType = types.some(filterType => 
      pokemonTypes.includes(filterType)
    )
    
    if (!hasMatchingType) {
      return null
    }
  }
  
  return <PokemonCard pokemon={fullPokemon} />
}

function getGenerationFromId(id: number): number {
  if (id <= 151) return 1
  if (id <= 251) return 2
  if (id <= 386) return 3
  if (id <= 493) return 4
  if (id <= 649) return 5
  if (id <= 721) return 6
  if (id <= 809) return 7
  if (id <= 898) return 8
  if (id <= 1008) return 9
  return 9
}