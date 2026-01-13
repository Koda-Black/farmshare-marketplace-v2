"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from "recharts";

interface UserGrowthChartProps {
  data: Array<{
    name: string;
    users: number;
    vendors: number;
    buyers: number;
  }>;
}

// Format numbers with K, M abbreviations
const formatNumber = (value: number) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  }
  return value.toString();
};

export function UserGrowthChart({ data }: UserGrowthChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="usersGradient" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor="hsl(var(--primary))"
              stopOpacity={0.3}
            />
            <stop
              offset="100%"
              stopColor="hsl(var(--primary))"
              stopOpacity={0}
            />
          </linearGradient>
          <linearGradient id="vendorsGradient" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor="hsl(var(--chart-2))"
              stopOpacity={0.3}
            />
            <stop
              offset="100%"
              stopColor="hsl(var(--chart-2))"
              stopOpacity={0}
            />
          </linearGradient>
          <linearGradient id="buyersGradient" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor="hsl(var(--chart-3))"
              stopOpacity={0.3}
            />
            <stop
              offset="100%"
              stopColor="hsl(var(--chart-3))"
              stopOpacity={0}
            />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="hsl(var(--border))"
          strokeOpacity={0.5}
        />
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
          dy={10}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
          tickFormatter={formatNumber}
          width={40}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--popover))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            fontSize: "12px",
            padding: "8px 12px",
          }}
          labelStyle={{ fontWeight: 600, marginBottom: "4px" }}
          formatter={(value: number, name: string) => [
            formatNumber(value),
            name.charAt(0).toUpperCase() + name.slice(1),
          ]}
        />
        <Legend
          verticalAlign="top"
          height={36}
          formatter={(value) => (
            <span className="text-xs capitalize text-muted-foreground">
              {value}
            </span>
          )}
        />
        <Area
          type="monotone"
          dataKey="users"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          fill="url(#usersGradient)"
          dot={false}
          activeDot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 0 }}
        />
        <Area
          type="monotone"
          dataKey="vendors"
          stroke="hsl(var(--chart-2))"
          strokeWidth={2}
          fill="url(#vendorsGradient)"
          dot={false}
          activeDot={{ r: 4, fill: "hsl(var(--chart-2))", strokeWidth: 0 }}
        />
        <Area
          type="monotone"
          dataKey="buyers"
          stroke="hsl(var(--chart-3))"
          strokeWidth={2}
          fill="url(#buyersGradient)"
          dot={false}
          activeDot={{ r: 4, fill: "hsl(var(--chart-3))", strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
