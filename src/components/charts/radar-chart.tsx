'use client'

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts'
import { Pokemon } from '@/types/pokemon'
import { formatStatName } from '@/lib/poke-api'

interface PokemonRadarChartProps {
  pokemon: Pokemon | Pokemon[]
  height?: number
}

export function PokemonRadarChart({ pokemon, height = 300 }: PokemonRadarChartProps) {
  const pokemonArray = Array.isArray(pokemon) ? pokemon : [pokemon]
  
  const data = pokemonArray[0].base_stats.map((stat) => {
    const dataPoint: any = {
      stat: formatStatName(stat.stat.name),
      fullMark: 255,
    }
    
    pokemonArray.forEach((p, index) => {
      const pokemonStat = p.base_stats.find(s => s.stat.name === stat.stat.name)
      dataPoint[`pokemon${index}`] = pokemonStat?.base_stat || 0
    })
    
    return dataPoint
  })
  
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c']
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="stat" />
        <PolarRadiusAxis 
          angle={90} 
          domain={[0, 255]} 
          tick={false}
        />
        {pokemonArray.map((p, index) => (
          <Radar
            key={p.id}
            name={p.name}
            dataKey={`pokemon${index}`}
            stroke={colors[index]}
            fill={colors[index]}
            fillOpacity={0.1}
            strokeWidth={2}
          />
        ))}
        {pokemonArray.length > 1 && <Legend />}
      </RadarChart>
    </ResponsiveContainer>
  )
}