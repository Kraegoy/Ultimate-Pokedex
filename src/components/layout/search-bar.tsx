'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useFiltersStore } from '@/store/filters'
import { searchPokemon } from '@/lib/poke-api'
import { PokemonListItem } from '@/types/pokemon'
import { capitalizeFirst, debounce } from '@/lib/utils'
import Link from 'next/link'

interface SearchBarProps {
  className?: string
  placeholder?: string
}

export function SearchBar({ className, placeholder = "Search Pokémon..." }: SearchBarProps) {
  const { search, setSearch } = useFiltersStore()
  const [suggestions, setSuggestions] = useState<PokemonListItem[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  
  const debouncedSearch = debounce(async (query: string) => {
    if (query.trim().length < 2) {
      setSuggestions([])
      setLoading(false)
      return
    }
    
    try {
      const results = await searchPokemon(query)
      setSuggestions(results.slice(0, 8))
    } catch (error) {
      console.error('Search error:', error)
      setSuggestions([])
    }
    setLoading(false)
  }, 300)
  
  useEffect(() => {
    if (search) {
      setLoading(true)
      debouncedSearch(search)
    } else {
      setSuggestions([])
      setLoading(false)
    }
  }, [search])
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }
  
  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder={placeholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-10"
          aria-label="Search Pokémon by name or number"
          role="searchbox"
          aria-expanded={showSuggestions}
        />
        {search && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
            onClick={() => setSearch('')}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {showSuggestions && (search.length >= 2 || suggestions.length > 0) && (
      <div className="absolute top-full left-0 right-0 z-50 mt-1 border border-border rounded-md shadow-xl max-h-64 overflow-y-auto" style={{ backgroundColor: 'hsl(var(--background))' }}>
          {loading ? (
            <div className="p-3 text-sm text-foreground">Searching...</div>
          ) : suggestions.length > 0 ? (
            suggestions.map((pokemon) => (
              <Link
                key={pokemon.id}
                href={`/pokemon/${pokemon.id}`}
                className="block p-3 hover:bg-accent hover:text-accent-foreground transition-colors border-b border-border last:border-b-0"
                onClick={() => setShowSuggestions(false)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">{capitalizeFirst(pokemon.name)}</span>
                  <span className="text-sm text-muted-foreground">
                    #{pokemon.id.toString().padStart(3, '0')}
                  </span>
                </div>
              </Link>
            ))
          ) : search.length >= 2 ? (
            <div className="p-3 text-sm text-foreground">No Pokémon found</div>
          ) : null}
        </div>
      )}
    </div>
  )
}