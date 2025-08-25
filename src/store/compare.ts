import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ComparisonPokemon } from '@/types/pokemon'

interface CompareState {
  pokemon: ComparisonPokemon[]
  addPokemon: (pokemon: ComparisonPokemon) => void
  removePokemon: (id: number) => void
  clearAll: () => void
  isPokemonSelected: (id: number) => boolean
  canAddMore: () => boolean
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      pokemon: [],
      
      addPokemon: (pokemon) => set((state) => {
        if (state.pokemon.length >= 4 || state.pokemon.some(p => p.id === pokemon.id)) {
          return state
        }
        return { pokemon: [...state.pokemon, pokemon] }
      }),
      
      removePokemon: (id) => set((state) => ({
        pokemon: state.pokemon.filter(p => p.id !== id)
      })),
      
      clearAll: () => set({ pokemon: [] }),
      
      isPokemonSelected: (id) => get().pokemon.some(p => p.id === id),
      
      canAddMore: () => get().pokemon.length < 4,
    }),
    {
      name: 'pokemon-comparison',
    }
  )
)