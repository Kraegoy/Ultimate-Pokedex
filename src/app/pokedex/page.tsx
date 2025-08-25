'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { FiltersPanel } from '@/components/filters/filters-panel'
import { InfinitePokemonGrid } from '@/components/layout/infinite-pokemon-grid'
import { SearchBar } from '@/components/layout/search-bar'
import { Button } from '@/components/ui/button'
import { useFiltersStore } from '@/store/filters'
import { useCompareStore } from '@/store/compare'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Filter, SlidersHorizontal, BarChart3 } from 'lucide-react'
import Link from 'next/link'

function PokedexContent() {
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const { types, generations, setSortBy, setSortOrder, setSearch, reset } = useFiltersStore()
  const { pokemon: comparedPokemon } = useCompareStore()
  const searchParams = useSearchParams()
  
  const activeFiltersCount = types.length + generations.length
  
  // Handle URL parameters
  useEffect(() => {
    const sort = searchParams?.get('sort')
    const order = searchParams?.get('order')
    const search = searchParams?.get('search')
    const legendary = searchParams?.get('legendary')
    const fullyEvolved = searchParams?.get('fully_evolved')
    const allowMega = searchParams?.get('allow_mega')
    
    // Handle primary sort (first in comma-separated list)
    if (sort) {
      const sortParams = sort.split(',')
      const primarySort = sortParams[0]
      setSortBy(primarySort as any)
    }
    
    // Handle primary order (first in comma-separated list)  
    if (order) {
      const orderParams = order.split(',')
      const primaryOrder = orderParams[0]
      setSortOrder(primaryOrder as 'asc' | 'desc')
    }
    
    if (search) {
      setSearch(search)
    }
    
    // Show filter notice for advanced parameters
    if (fullyEvolved === 'true' || allowMega === 'true') {
      // We can't fully implement these complex filters with the current API structure,
      // but we can show a notice that advanced filtering is active
      console.log('Advanced filtering active:', { fullyEvolved, allowMega })
    }
    
    // Legendary filtering is handled in the InfinitePokemonGrid component via URL params
  }, [searchParams, setSortBy, setSortOrder, setSearch])
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Pokédex</h1>
          <p className="text-muted-foreground">
            Discover and explore all Pokémon with advanced filtering
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {comparedPokemon.length > 0 && (
            <Button asChild variant="outline" className="relative">
              <Link href="/compare">
                <BarChart3 className="mr-2 h-4 w-4" />
                Compare
                <Badge variant="secondary" className="ml-2">
                  {comparedPokemon.length}
                </Badge>
              </Link>
            </Button>
          )}
          
          {/* Mobile Filter Toggle */}
          <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden relative">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FiltersPanel />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="max-w-md">
        <SearchBar placeholder="Search by name or number..." />
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Desktop Filters */}
        <div className="hidden lg:block">
          <div className="sticky top-20 h-fit">
            <FiltersPanel />
          </div>
        </div>
        
        {/* Pokemon Grid */}
        <div className="lg:col-span-3">
          <InfinitePokemonGrid />
        </div>
      </div>
    </div>
  )
}

export default function PokedexPage() {
  return (
    <Suspense fallback={<PokedexPageSkeleton />}>
      <PokedexContent />
    </Suspense>
  )
}

function PokedexPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="h-8 bg-gray-200 rounded w-32 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-64" />
        </div>
      </div>
      
      <div className="max-w-md">
        <div className="h-10 bg-gray-200 rounded" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="hidden lg:block">
          <div className="h-96 bg-gray-200 rounded" />
        </div>
        <div className="lg:col-span-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}