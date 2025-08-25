export interface Pokemon {
  id: number
  name: string
  sprites: {
    front_default: string | null
    front_shiny: string | null
    other?: {
      'official-artwork': {
        front_default: string | null
      }
    }
  }
  types: PokemonType[]
  base_stats: BaseStat[]
  abilities: Ability[]
  moves: Move[]
  height: number
  weight: number
  egg_groups: EggGroup[]
  generation: number
  species_url?: string
}

export interface PokemonType {
  slot: number
  type: {
    name: TypeName
    url: string
  }
}

export interface BaseStat {
  base_stat: number
  effort: number
  stat: {
    name: string
    url: string
  }
}

export interface Ability {
  ability: {
    name: string
    url: string
  }
  is_hidden: boolean
  slot: number
}

export interface Move {
  move: {
    name: string
    url: string
  }
  version_group_details: {
    level_learned_at: number
    move_learn_method: {
      name: string
      url: string
    }
    version_group: {
      name: string
      url: string
    }
  }[]
}

export interface EggGroup {
  name: string
  url: string
}

export type TypeName = 
  | 'normal' | 'fire' | 'water' | 'electric' | 'grass' | 'ice'
  | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug'
  | 'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy'

export interface PokemonListItem {
  name: string
  url: string
  id: number
}

export interface PokemonDetails extends Pokemon {
  flavor_text: string
  evolution_chain?: EvolutionChain
}

export interface EvolutionChain {
  id: number
  chain: EvolutionLink
}

export interface EvolutionLink {
  species: {
    name: string
    url: string
  }
  evolves_to: EvolutionLink[]
  evolution_details: {
    trigger: {
      name: string
    }
    min_level?: number
    item?: {
      name: string
    }
  }[]
}

export interface PokemonFilters {
  search: string
  types: TypeName[]
  generations: number[]
  eggGroups: string[]
  sortBy: 'id' | 'name' | 'base_stat_total' | 'height' | 'weight'
  sortOrder: 'asc' | 'desc'
  statRanges: {
    hp: [number, number]
    attack: [number, number]
    defense: [number, number]
    special_attack: [number, number]
    special_defense: [number, number]
    speed: [number, number]
  }
}

export interface ComparisonPokemon {
  id: number
  name: string
  types: TypeName[]
  baseStats: Record<string, number>
  sprite: string
}