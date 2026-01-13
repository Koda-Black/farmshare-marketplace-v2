"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Repeat,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
}

function MetricCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  trend = "up",
}: MetricCardProps) {
  const isPositive = change >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full" />
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        <div className="flex items-center gap-2 mt-2">
          <div
            className={cn(
              "flex items-center gap-1 text-xs font-medium rounded-full px-2 py-0.5",
              isPositive
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            )}
          >
            <TrendIcon className="h-3 w-3" />
            {isPositive ? "+" : ""}
            {change.toFixed(1)}%
          </div>
          <span className="text-xs text-muted-foreground">{changeLabel}</span>
        </div>
      </CardContent>
    </Card>
  );
}

interface BusinessMetricsProps {
  escrow: {
    totalHeld: number;
    totalReleased: number;
  };
  users: {
    total: number;
    newThisWeek: number;
    vendors: number;
    buyers: number;
  };
  pools: {
    total: number;
    active: number;
    completed: number;
    completedThisWeek: number;
  };
}

export function BusinessMetrics({
  escrow,
  users,
  pools,
}: BusinessMetricsProps) {
  // Calculate MRR based on platform commission (assuming 5% commission on released)
  const commissionRate = 0.05;
  const mrr = (escrow.totalReleased || 0) * commissionRate;
  const arr = mrr * 12;

  // Calculate growth rates (simulated for now - you can connect to real historical data)
  const userGrowthRate =
    users.total > 0 ? ((users.newThisWeek || 0) / users.total) * 100 : 0;
  const vendorRetentionRate = users.vendors > 0 ? 92.5 : 0; // You can calculate this from actual data
  const poolCompletionRate =
    pools.total > 0 ? ((pools.completed || 0) / pools.total) * 100 : 0;

  // Format currency
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `₦${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `₦${(value / 1000).toFixed(0)}K`;
    }
    return `₦${value.toLocaleString()}`;
  };

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Monthly Recurring Revenue"
        value={formatCurrency(mrr)}
        change={8.2}
        changeLabel="vs last month"
        icon={<DollarSign className="h-4 w-4 text-primary" />}
      />
      <MetricCard
        title="Annual Run Rate"
        value={formatCurrency(arr)}
        change={12.5}
        changeLabel="vs last year"
        icon={<Target className="h-4 w-4 text-primary" />}
      />
      <MetricCard
        title="User Growth Rate"
        value={`${userGrowthRate.toFixed(1)}%`}
        change={userGrowthRate > 5 ? 3.2 : -1.5}
        changeLabel="weekly growth"
        icon={<Users className="h-4 w-4 text-primary" />}
      />
      <MetricCard
        title="Vendor Retention"
        value={`${vendorRetentionRate.toFixed(1)}%`}
        change={2.1}
        changeLabel="vs last quarter"
        icon={<Repeat className="h-4 w-4 text-primary" />}
      />
    </div>
  );
}
