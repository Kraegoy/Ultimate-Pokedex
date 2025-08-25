'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { KPICard } from '@/components/charts/kpi-card'
import { TypeDistributionChart } from '@/components/charts/type-distribution-chart'
import { usePokemonList, usePokemon } from '@/hooks/use-pokemon'
import { PokemonCard } from '@/components/cards/pokemon-card'
import { useFiltersStore } from '@/store/filters'
import { TYPE_COLORS } from '@/lib/theme'
import { TypeName, Pokemon } from '@/types/pokemon'
import { 
  Database, 
  Zap, 
  Shield, 
  Flame, 
  BookOpen, 
  BarChart3,
  TrendingUp 
} from 'lucide-react'

export default function Dashboard() {
  const { data } = usePokemonList()
  const { reset } = useFiltersStore()
  
  const mockTypeDistribution = Object.keys(TYPE_COLORS).slice(0, 8).map((type) => ({
    type: type as TypeName,
    count: Math.floor(Math.random() * 100) + 20,
  }))
  
  const featuredPokemon = [1, 25, 6, 150, 249] // Bulbasaur, Pikachu, Charizard, Mewtwo, Lugia
  
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-8 sm:py-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 rounded-lg px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
            Welcome to the Ultimate Pokédex
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
            Discover, explore, and compare your favorite Pokémon with lightning-fast search, 
            powerful filters, and beautiful adaptive themes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <Button asChild size="lg">
              <Link href="/pokedex">
                <BookOpen className="mr-2 h-5 w-5" />
                Explore Pokédex
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/compare">
                <BarChart3 className="mr-2 h-5 w-5" />
                Compare Pokémon
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* KPI Cards */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Total Pokémon"
            value={1008}
            description="Across all generations"
            icon={Database}
            trend={{ value: 12, isPositive: true }}
          />
          <KPICard
            title="Fastest Pokémon"
            value="Regieleki"
            description="200 base speed"
            icon={Zap}
            color="#F7D02C"
          />
          <KPICard
            title="Most Defensive"
            value="Shuckle"
            description="230 base defense"
            icon={Shield}
            color="#B6A136"
          />
          <KPICard
            title="Strongest Attack"
            value="Mega Mewtwo X"
            description="190 base attack"
            icon={Flame}
            color="#C22E28"
          />
        </div>
      </section>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Type Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TypeDistributionChart data={mockTypeDistribution} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={reset}
            >
              <Database className="mr-2 h-4 w-4" />
              Reset All Filters
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/pokedex?sort=base_stat_total,speed,attack&order=desc,desc,desc&collapse_forms=highest&dedupe_by_species=true&fully_evolved=true&allow_mega=true">
                <TrendingUp className="mr-2 h-4 w-4" />
                View Strongest Pokémon
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/pokedex?legendary=true">
                <Flame className="mr-2 h-4 w-4" />
                Legendary Pokémon
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Featured Pokémon */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Pokémon</h2>
          <Button asChild variant="outline">
            <Link href="/pokedex">View All</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
          <Suspense fallback={
            Array.from({ length: 5 }).map((_, i) => (
              <PokemonCard
                key={i}
                pokemon={{} as Pokemon}
                loading={true}
              />
            ))
          }>
            <FeaturedPokemonList pokemonIds={featuredPokemon} />
          </Suspense>
        </div>
      </section>
    </div>
  )
}

function FeaturedPokemonList({ pokemonIds }: { pokemonIds: number[] }) {
  return (
    <>
      {pokemonIds.map((id) => (
        <FeaturedPokemonCard key={id} pokemonId={id} />
      ))}
    </>
  )
}

function FeaturedPokemonCard({ pokemonId }: { pokemonId: number }) {
  const { data: pokemon, isLoading } = usePokemon(pokemonId)
  
  if (isLoading || !pokemon) {
    return (
      <PokemonCard
        pokemon={{} as Pokemon}
        loading={true}
      />
    )
  }
  
  return <PokemonCard pokemon={pokemon} />
}
