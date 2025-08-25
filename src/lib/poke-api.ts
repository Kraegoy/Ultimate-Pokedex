import { Pokemon, PokemonListItem, PokemonDetails, EvolutionChain, TypeName } from '@/types/pokemon'

const BASE_URL = 'https://pokeapi.co/api/v2'

export async function fetchPokemonList(limit = 20, offset = 0): Promise<{
  results: PokemonListItem[]
  count: number
  next: string | null
  previous: string | null
}> {
  const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`)
  if (!response.ok) throw new Error('Failed to fetch Pokemon list')
  
  const data = await response.json()
  const results = data.results.map((pokemon: any, index: number) => ({
    ...pokemon,
    id: offset + index + 1,
  }))
  
  return {
    results,
    count: data.count,
    next: data.next,
    previous: data.previous,
  }
}

export async function fetchPokemon(idOrName: string | number): Promise<Pokemon> {
  const response = await fetch(`${BASE_URL}/pokemon/${idOrName}`)
  if (!response.ok) throw new Error(`Failed to fetch Pokemon ${idOrName}`)
  
  const data = await response.json()
  return normalizePokemon(data)
}

export async function fetchPokemonDetails(idOrName: string | number): Promise<PokemonDetails> {
  const pokemon = await fetchPokemon(idOrName)
  
  const speciesResponse = await fetch(`${BASE_URL}/pokemon-species/${pokemon.id}`)
  if (!speciesResponse.ok) throw new Error(`Failed to fetch Pokemon species ${idOrName}`)
  
  const speciesData = await speciesResponse.json()
  
  const flavorText = speciesData.flavor_text_entries
    .find((entry: any) => entry.language.name === 'en')?.flavor_text
    .replace(/\f/g, ' ') || ''
  
  let evolutionChain: EvolutionChain | undefined
  if (speciesData.evolution_chain?.url) {
    try {
      const evolutionResponse = await fetch(speciesData.evolution_chain.url)
      if (evolutionResponse.ok) {
        evolutionChain = await evolutionResponse.json()
      }
    } catch (error) {
      console.warn('Failed to fetch evolution chain:', error)
    }
  }
  
  return {
    ...pokemon,
    flavor_text: flavorText,
    generation: speciesData.generation.url.split('/').slice(-2, -1)[0],
    egg_groups: speciesData.egg_groups || [],
    evolution_chain: evolutionChain,
  }
}

export async function searchPokemon(query: string): Promise<PokemonListItem[]> {
  if (!query.trim()) return []
  
  const isNumeric = /^\d+$/.test(query)
  
  if (isNumeric) {
    try {
      const pokemon = await fetchPokemon(parseInt(query))
      return [{ name: pokemon.name, url: `${BASE_URL}/pokemon/${pokemon.id}`, id: pokemon.id }]
    } catch {
      return []
    }
  }
  
  const { results } = await fetchPokemonList(1000, 0)
  return results.filter(pokemon => 
    pokemon.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 20)
}

function normalizePokemon(data: any): Pokemon {
  return {
    id: data.id,
    name: data.name,
    sprites: {
      front_default: data.sprites.front_default,
      front_shiny: data.sprites.front_shiny,
      other: data.sprites.other,
    },
    types: data.types,
    base_stats: data.stats,
    abilities: data.abilities,
    moves: data.moves,
    height: data.height,
    weight: data.weight,
    egg_groups: [],
    generation: 1,
  }
}

export async function fetchTypeDetails(typeName: TypeName) {
  const response = await fetch(`${BASE_URL}/type/${typeName}`)
  if (!response.ok) throw new Error(`Failed to fetch type ${typeName}`)
  
  return response.json()
}

export async function fetchPokemonByType(typeName: TypeName): Promise<PokemonListItem[]> {
  const typeData = await fetchTypeDetails(typeName)
  return typeData.pokemon.map((p: any) => ({
    name: p.pokemon.name,
    url: p.pokemon.url,
    id: parseInt(p.pokemon.url.split('/').slice(-2, -1)[0]),
  }))
}

export async function fetchAbilityDetails(abilityName: string) {
  const response = await fetch(`${BASE_URL}/ability/${abilityName}`)
  if (!response.ok) throw new Error(`Failed to fetch ability ${abilityName}`)
  
  const data = await response.json()
  
  // Find English description
  const englishEntry = data.effect_entries.find(
    (entry: any) => entry.language.name === 'en'
  )
  
  return {
    name: data.name,
    description: englishEntry?.effect || englishEntry?.short_effect || 'No description available.',
    id: data.id
  }
}

export function getGenerationFromId(id: number): number {
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

export function getStatTotal(pokemon: Pokemon): number {
  return pokemon.base_stats.reduce((total, stat) => total + stat.base_stat, 0)
}

export function formatStatName(statName: string): string {
  return statName
    .replace(/^special-/, 'sp. ')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
}