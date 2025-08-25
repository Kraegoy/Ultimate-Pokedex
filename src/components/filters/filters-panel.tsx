'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { TypeBadge } from '@/components/cards/type-badge'
import { useFiltersStore } from '@/store/filters'
import { TYPE_COLORS } from '@/lib/theme'
import { TypeName } from '@/types/pokemon'
import { 
  Filter, 
  X, 
  ArrowUpDown, 
  RotateCcw,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

interface FiltersPanelProps {
  className?: string
  compact?: boolean
}

export function FiltersPanel({ className, compact = false }: FiltersPanelProps) {
  const [collapsed, setCollapsed] = useState(compact)
  const {
    types,
    generations,
    sortBy,
    sortOrder,
    statRanges,
    addType,
    removeType,
    addGeneration,
    removeGeneration,
    setSortBy,
    toggleSortOrder,
    setStatRange,
    reset,
    saveFilters,
  } = useFiltersStore()
  
  const typeOptions = Object.keys(TYPE_COLORS) as TypeName[]
  const generationOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  const sortOptions = [
    { value: 'id' as const, label: 'ID' },
    { value: 'name' as const, label: 'Name' },
    { value: 'base_stat_total' as const, label: 'Total Stats' },
    { value: 'height' as const, label: 'Height' },
    { value: 'weight' as const, label: 'Weight' },
  ]
  
  
  const activeFiltersCount = types.length + generations.length + 
    Object.values(statRanges).filter(([min, max]) => min > 0 || max < 255).length
  
  if (compact && collapsed) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-sm">
              <Filter className="mr-2 h-4 w-4" />
              Filters {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFiltersCount}
                </Badge>
              )}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(false)}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>
    )
  }
  
  return (
    <Card className={className}>
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex gap-2">
            {compact && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCollapsed(true)}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={reset}>
              <RotateCcw className="mr-1 h-3 w-3" />
              Reset
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <div className="flex-1 overflow-y-auto">
        <CardContent className="space-y-6 max-h-[calc(100vh-12rem)] overflow-y-auto">
        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Active Filters</h4>
            <div className="flex flex-wrap gap-2">
              {types.map((type) => (
                <div key={type} className="relative">
                  <TypeBadge type={type} className="pr-6" />
                  <button
                    onClick={() => removeType(type)}
                    className="absolute top-0 right-1 h-full flex items-center"
                  >
                    <X className="h-3 w-3 text-white hover:text-gray-200" />
                  </button>
                </div>
              ))}
              {generations.map((gen) => (
                <Badge key={gen} variant="outline" className="pr-6 relative">
                  Gen {gen}
                  <button
                    onClick={() => removeGeneration(gen)}
                    className="absolute top-0 right-1 h-full flex items-center"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Types */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Types</h4>
          <div className="grid grid-cols-2 gap-2">
            {typeOptions.map((type) => (
              <button
                key={type}
                onClick={() => types.includes(type) ? removeType(type) : addType(type)}
                className={`transition-all ${
                  types.includes(type) 
                    ? 'scale-105 ring-2 ring-blue-500 ring-offset-2' 
                    : 'opacity-70 hover:opacity-100 hover:scale-105'
                }`}
              >
                <TypeBadge type={type} className="w-full" />
              </button>
            ))}
          </div>
        </div>
        
        {/* Generations */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Generations</h4>
          <div className="grid grid-cols-3 gap-2">
            {generationOptions.map((gen) => (
              <Button
                key={gen}
                variant={generations.includes(gen) ? "default" : "outline"}
                size="sm"
                onClick={() => 
                  generations.includes(gen) ? removeGeneration(gen) : addGeneration(gen)
                }
              >
                Gen {gen}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Sort */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Sort By</h4>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="flex-1 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSortOrder}
              className="px-3"
            >
              <ArrowUpDown className="h-4 w-4 mr-1" />
              {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
            </Button>
          </div>
        </div>
        
        {/* Stat Ranges */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Base Stats</h4>
          {Object.entries(statRanges).map(([stat, [min, max]]) => (
            <div key={stat} className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm capitalize">
                  {stat.replace('_', ' ')}
                </label>
                <span className="text-sm text-muted-foreground">
                  {min} - {max}
                </span>
              </div>
              <Slider
                value={[min, max]}
                onValueChange={([newMin, newMax]) => 
                  setStatRange(stat as keyof typeof statRanges, [newMin, newMax])
                }
                max={255}
                min={0}
                step={5}
                className="w-full"
              />
            </div>
          ))}
        </div>
        </CardContent>
      </div>
    </Card>
  )
}