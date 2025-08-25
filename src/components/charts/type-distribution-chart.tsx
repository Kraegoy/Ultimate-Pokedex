'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { TYPE_COLORS } from '@/lib/theme'
import { TypeName } from '@/types/pokemon'
import { capitalizeFirst } from '@/lib/utils'

interface TypeDistributionData {
  type: TypeName
  count: number
}

interface TypeDistributionChartProps {
  data: TypeDistributionData[]
  height?: number
}

export function TypeDistributionChart({ data, height = 300 }: TypeDistributionChartProps) {
  const chartData = data.map(item => ({
    name: capitalizeFirst(item.type),
    value: item.count,
    color: TYPE_COLORS[item.type],
  }))

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="border rounded-lg p-2 shadow-lg" style={{ backgroundColor: 'hsl(var(--background))' }}>
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm text-muted-foreground">
            {payload[0].value} Pokémon ({((payload[0].value / data.reduce((sum, d) => sum + d.count, 0)) * 100).toFixed(1)}%)
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}