'use client'

import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { fetchPokemon, fetchPokemonList, fetchPokemonDetails, fetchAbilityDetails } from '@/lib/poke-api'

export function usePokemon(idOrName: string | number) {
  return useQuery({
    queryKey: ['pokemon', idOrName],
    queryFn: () => fetchPokemon(idOrName),
    enabled: !!idOrName,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function usePokemonDetails(idOrName: string | number) {
  return useQuery({
    queryKey: ['pokemon-details', idOrName],
    queryFn: () => fetchPokemonDetails(idOrName),
    enabled: !!idOrName,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function usePokemonList() {
  return useInfiniteQuery({
    queryKey: ['pokemon-list'],
    queryFn: ({ pageParam = 0 }) => fetchPokemonList(20, pageParam * 20),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.next) {
        return pages.length
      }
      return undefined
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}

export function useAbilityDetails(abilityName: string) {
  return useQuery({
    queryKey: ['ability-details', abilityName],
    queryFn: () => fetchAbilityDetails(abilityName),
    enabled: !!abilityName,
    staleTime: 1000 * 60 * 30, // 30 minutes
  })
}