"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface UserGrowthChartProps {
  data: Array<{
    name: string
    users: number
    vendors: number
    buyers: number
  }>
}

export function UserGrowthChart({ data }: UserGrowthChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "6px"
          }}
        />
        <Line
          type="monotone"
          dataKey="users"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={{ fill: "hsl(var(--primary))" }}
        />
        <Line
          type="monotone"
          dataKey="vendors"
          stroke="hsl(var(--chart-2))"
          strokeWidth={2}
          dot={{ fill: "hsl(var(--chart-2))" }}
        />
        <Line
          type="monotone"
          dataKey="buyers"
          stroke="hsl(var(--chart-3))"
          strokeWidth={2}
          dot={{ fill: "hsl(var(--chart-3))" }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}