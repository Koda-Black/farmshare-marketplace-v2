"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  MoreVertical,
  Ban,
  Package,
  Loader2,
  RefreshCw,
  CheckCircle,
  Clock,
  Truck,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminBreadcrumbs } from "@/components/admin/admin-breadcrumbs";
import { useAdminAuth } from "@/hooks/use-admin";
import { PoolsService, type Pool } from "@/lib/api/pools";

export default function AdminPoolsPage() {
  const { isAdminAuthenticated } = useAdminAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Real data state
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load pools from API
  const loadPools = useCallback(async () => {
    if (!isAdminAuthenticated) return;

    setLoading(true);
    setError(null);
    try {
      const response = await PoolsService.getPools({
        search: debouncedSearch || undefined,
        limit: 50,
      });
      setPools(response || []);
    } catch (err) {
      console.error("Failed to load pools:", err);
      setError(err instanceof Error ? err.message : "Failed to load pools");
      setPools([]);
    } finally {
      setLoading(false);
    }
  }, [isAdminAuthenticated, debouncedSearch]);

  useEffect(() => {
    loadPools();
  }, [loadPools]);

  // Check if admin is authenticated
  if (!isAdminAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">
            Admin Authentication Required
          </h1>
          <p className="text-muted-foreground mb-4">
            Please log in to access pool management
          </p>
          <Button asChild>
            <a href="/admin/login">Go to Admin Login</a>
          </Button>
        </div>
      </div>
    );
  }

  // Count by status
  const openCount = pools.filter((p) => p.status === "OPEN").length;
  const filledCount = pools.filter((p) => p.status === "FILLED").length;
  const completedCount = pools.filter((p) => p.status === "COMPLETED").length;
  const inDeliveryCount = pools.filter(
    (p) => p.status === "IN_DELIVERY"
  ).length;

  // Calculate average fill rate
  const avgFillRate =
    pools.length > 0
      ? Math.round(
          pools.reduce((sum, p) => sum + (p.fillPercentage || 0), 0) /
            pools.length
        )
      : 0;

  // Status configuration
  const statusConfig: Record<
    string,
    { label: string; className: string; icon: any }
  > = {
    OPEN: {
      label: "Open",
      className:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      icon: Clock,
    },
    FILLED: {
      label: "Filled",
      className:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      icon: CheckCircle,
    },
    IN_DELIVERY: {
      label: "Delivering",
      className:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      icon: Truck,
    },
    COMPLETED: {
      label: "Completed",
      className:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      icon: CheckCircle,
    },
    DISPUTED: {
      label: "Disputed",
      className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      icon: Ban,
    },
    CANCELLED: {
      label: "Cancelled",
      className:
        "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
      icon: Ban,
    },
  };

  // Format currency
  const formatCurrency = (value: string | number) => {
    const num = typeof value === "string" ? parseFloat(value) : value;
    if (num >= 1000000) {
      return `₦${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `₦${(num / 1000).toFixed(0)}K`;
    }
    return `₦${num.toLocaleString()}`;
  };

  // Filter pools by search query
  const filteredPools = pools.filter((p) => {
    const query = debouncedSearch.toLowerCase();
    if (!query) return true;
    return (
      p.product?.name?.toLowerCase().includes(query) ||
      p.vendor?.name?.toLowerCase().includes(query) ||
      p.id.toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 space-y-6 p-4 pt-20 md:pt-6 md:p-6 lg:p-8">
          {/* Breadcrumbs */}
          <AdminBreadcrumbs items={[{ label: "Pools" }]} />

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Pool Management
              </h1>
              <p className="text-muted-foreground mt-1">
                Monitor and manage all buying pools
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadPools}
              disabled={loading}
              className="w-fit"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>

          {/* Stats */}
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Pools
                </CardTitle>
                <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Package className="h-4 w-4 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? "—" : pools.length}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active (Open)
                </CardTitle>
                <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? "—" : openCount}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Filled
                </CardTitle>
                <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-purple-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? "—" : filledCount}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Avg Fill Rate
                </CardTitle>
                <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Package className="h-4 w-4 text-amber-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? "—" : `${avgFillRate}%`}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search pools by product or vendor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardContent>
          </Card>

          {/* Error State */}
          {error && (
            <Card className="border-destructive/50 bg-destructive/5">
              <CardContent className="pt-6">
                <p className="text-destructive text-sm">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Pools Table */}
          <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">All Pools</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-[200px]">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : filteredPools.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                  <Package className="h-12 w-12 mb-4 opacity-20" />
                  <p>No pools found</p>
                  {searchQuery && (
                    <p className="text-sm mt-1">
                      Try adjusting your search query
                    </p>
                  )}
                </div>
              ) : (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Pool ID</TableHead>
                        <TableHead className="text-xs">Product</TableHead>
                        <TableHead className="text-xs">Vendor</TableHead>
                        <TableHead className="text-xs">Progress</TableHead>
                        <TableHead className="text-xs">Price/Slot</TableHead>
                        <TableHead className="text-xs">Status</TableHead>
                        <TableHead className="text-xs">Created</TableHead>
                        <TableHead className="text-xs">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPools.map((pool) => {
                        const config =
                          statusConfig[pool.status] || statusConfig.OPEN;
                        const StatusIcon = config.icon;
                        const fillPercent = pool.fillPercentage || 0;

                        return (
                          <TableRow key={pool.id}>
                            <TableCell className="py-3 font-mono text-xs">
                              {pool.id.slice(0, 8)}...
                            </TableCell>
                            <TableCell className="py-3">
                              <div className="flex items-center gap-2">
                                {pool.product?.imageUrl && (
                                  <img
                                    src={pool.product.imageUrl}
                                    alt={pool.product.name}
                                    className="h-8 w-8 rounded object-cover"
                                  />
                                )}
                                <span className="font-medium text-sm">
                                  {pool.product?.name || "Unknown"}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="py-3 text-sm">
                              {pool.vendor?.name || "Unknown"}
                            </TableCell>
                            <TableCell className="py-3">
                              <div className="w-24">
                                <div className="flex items-center justify-between text-xs mb-1">
                                  <span>
                                    {pool.takenSlots || 0}/{pool.slotsCount}
                                  </span>
                                  <span className="text-muted-foreground">
                                    {fillPercent}%
                                  </span>
                                </div>
                                <Progress
                                  value={fillPercent}
                                  className="h-1.5"
                                />
                              </div>
                            </TableCell>
                            <TableCell className="py-3 text-sm font-medium">
                              {formatCurrency(pool.pricePerSlot)}
                            </TableCell>
                            <TableCell className="py-3">
                              <Badge
                                variant="secondary"
                                className={`${config.className} text-xs`}
                              >
                                <StatusIcon className="mr-1 h-3 w-3" />
                                {config.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-3 text-xs text-muted-foreground">
                              {new Date(pool.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="py-3">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    View Subscribers
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    View Escrow
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-destructive">
                                    <Ban className="mr-2 h-4 w-4" />
                                    Cancel Pool
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
