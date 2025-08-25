import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { PokemonFilters, TypeName } from '@/types/pokemon'

interface FiltersState extends PokemonFilters {
  setSearch: (search: string) => void
  setTypes: (types: TypeName[]) => void
  addType: (type: TypeName) => void
  removeType: (type: TypeName) => void
  setGenerations: (generations: number[]) => void
  addGeneration: (generation: number) => void
  removeGeneration: (generation: number) => void
  setEggGroups: (eggGroups: string[]) => void
  setSortBy: (sortBy: PokemonFilters['sortBy']) => void
  setSortOrder: (sortOrder: PokemonFilters['sortOrder']) => void
  toggleSortOrder: () => void
  setStatRange: (stat: keyof PokemonFilters['statRanges'], range: [number, number]) => void
  reset: () => void
  saveFilters: (name: string) => void
  loadFilters: (name: string) => void
  getSavedFilters: () => Record<string, PokemonFilters>
  deleteSavedFilters: (name: string) => void
}

const initialState: PokemonFilters = {
  search: '',
  types: [],
  generations: [],
  eggGroups: [],
  sortBy: 'id',
  sortOrder: 'asc',
  statRanges: {
    hp: [0, 255],
    attack: [0, 255],
    defense: [0, 255],
    special_attack: [0, 255],
    special_defense: [0, 255],
    speed: [0, 255],
  },
}

export const useFiltersStore = create<FiltersState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setSearch: (search) => set({ search }),
      
      setTypes: (types) => set({ types }),
      
      addType: (type) => set((state) => ({
        types: state.types.includes(type) ? state.types : [...state.types, type]
      })),
      
      removeType: (type) => set((state) => ({
        types: state.types.filter(t => t !== type)
      })),
      
      setGenerations: (generations) => set({ generations }),
      
      addGeneration: (generation) => set((state) => ({
        generations: state.generations.includes(generation) 
          ? state.generations 
          : [...state.generations, generation]
      })),
      
      removeGeneration: (generation) => set((state) => ({
        generations: state.generations.filter(g => g !== generation)
      })),
      
      setEggGroups: (eggGroups) => set({ eggGroups }),
      
      setSortBy: (sortBy) => set({ sortBy }),
      
      setSortOrder: (sortOrder) => set({ sortOrder }),
      
      toggleSortOrder: () => set((state) => ({
        sortOrder: state.sortOrder === 'asc' ? 'desc' : 'asc'
      })),
      
      setStatRange: (stat, range) => set((state) => ({
        statRanges: { ...state.statRanges, [stat]: range }
      })),
      
      reset: () => set(initialState),
      
      saveFilters: (name) => {
        const currentFilters = {
          search: get().search,
          types: get().types,
          generations: get().generations,
          eggGroups: get().eggGroups,
          sortBy: get().sortBy,
          sortOrder: get().sortOrder,
          statRanges: get().statRanges,
        }
        
        const saved = JSON.parse(localStorage.getItem('saved-filters') || '{}')
        saved[name] = currentFilters
        localStorage.setItem('saved-filters', JSON.stringify(saved))
      },
      
      loadFilters: (name) => {
        const saved = JSON.parse(localStorage.getItem('saved-filters') || '{}')
        const filters = saved[name]
        if (filters) {
          set(filters)
        }
      },
      
      getSavedFilters: () => {
        return JSON.parse(localStorage.getItem('saved-filters') || '{}')
      },
      
      deleteSavedFilters: (name) => {
        const saved = JSON.parse(localStorage.getItem('saved-filters') || '{}')
        delete saved[name]
        localStorage.setItem('saved-filters', JSON.stringify(saved))
      },
    }),
    {
      name: 'pokemon-filters',
      partialize: (state) => ({
        types: state.types,
        generations: state.generations,
        eggGroups: state.eggGroups,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
        statRanges: state.statRanges,
      }),
    }
  )
)