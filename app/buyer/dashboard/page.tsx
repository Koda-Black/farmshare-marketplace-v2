"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  Package,
  DollarSign,
  Eye,
  Filter,
  Plus,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Clock,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useStore } from "@/lib/store";

export default function BuyerDashboardPage() {
  const { user } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    activePools: 0,
    totalInvested: 0,
    pendingDisputes: 0,
    completedPools: 0,
  });

  // Mock data - in real implementation, this would come from API
  const [myPools, setMyPools] = useState([
    {
      id: "pool_1",
      product_name: "Organic Tomatoes",
      vendor_name: "Green Valley Farms",
      slots_count: 15,
      slots_filled: 15,
      my_slots: 2,
      price_per_slot: 15000,
      status: "completed",
      expected_return: 18000,
      created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "pool_2",
      product_name: "Fresh Vegetables Mix",
      vendor_name: "FarmCo Supplies",
      slots_count: 20,
      slots_filled: 18,
      my_slots: 1,
      price_per_slot: 12000,
      status: "active",
      expected_return: 14400,
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]);

  const [disputes, setDisputes] = useState([
    {
      id: "dispute_1",
      pool_id: "pool_3",
      pool_name: "Premium Rice",
      status: "open",
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      last_updated: new Date(
        Date.now() - 1 * 24 * 60 * 60 * 1000
      ).toISOString(),
    },
  ]);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setStats({
        activePools: myPools.filter((p) => p.status === "active").length,
        totalInvested: myPools.reduce(
          (sum, pool) => sum + pool.my_slots * pool.price_per_slot,
          0
        ),
        pendingDisputes: disputes.filter((d) => d.status === "open").length,
        completedPools: myPools.filter((p) => p.status === "completed").length,
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-muted" />
            <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-t-primary animate-spin" />
          </div>
          <p className="mt-4 text-lg text-muted-foreground">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-[30px] lg:px-[60px] py-10">
      {/* Header */}
      <div className="mb-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                <ShoppingCart className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold">
                Buyer Dashboard
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Welcome back,{" "}
              <span className="font-semibold text-foreground">
                {user?.name}
              </span>
            </p>
          </div>
          <Button asChild size="lg" className="shadow-lg shadow-primary/20">
            <Link href="/buyer/marketplace" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Browse Pools
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        <Card className="card-premium hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Pools
            </CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Package className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.activePools}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently participating
            </p>
          </CardContent>
        </Card>

        <Card className="card-premium hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Invested
            </CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              ₦{stats.totalInvested.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all pools
            </p>
          </CardContent>
        </Card>

        <Card className="card-premium hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Disputes
            </CardTitle>
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                stats.pendingDisputes > 0 ? "bg-yellow-100" : "bg-muted"
              }`}
            >
              <AlertTriangle
                className={`h-5 w-5 ${
                  stats.pendingDisputes > 0
                    ? "text-yellow-600"
                    : "text-muted-foreground"
                }`}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div
              className={`text-3xl font-bold ${
                stats.pendingDisputes > 0 ? "text-yellow-600" : ""
              }`}
            >
              {stats.pendingDisputes}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.pendingDisputes > 0 ? "Require attention" : "All clear!"}
            </p>
          </CardContent>
        </Card>

        <Card className="card-premium hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed Pools
            </CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20">
              <CheckCircle className="h-5 w-5 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.completedPools}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Successfully completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mb-10 overflow-hidden border-0 shadow-xl">
        <div className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <Button
                variant="outline"
                className="h-auto py-4 px-4 justify-start bg-background hover:bg-muted border-border/50 rounded-xl group"
                asChild
              >
                <Link
                  href="/buyer/marketplace"
                  className="flex items-center gap-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Browse Marketplace</div>
                    <div className="text-xs text-muted-foreground">
                      Find new pools
                    </div>
                  </div>
                </Link>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 px-4 justify-start bg-background hover:bg-muted border-border/50 rounded-xl group"
                asChild
              >
                <Link
                  href="/buyer/disputes"
                  className="flex items-center gap-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100 group-hover:bg-yellow-200 transition-colors">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">My Disputes</div>
                    <div className="text-xs text-muted-foreground">
                      Manage issues
                    </div>
                  </div>
                </Link>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 px-4 justify-start bg-background hover:bg-muted border-border/50 rounded-xl group"
                asChild
              >
                <Link href="/profile" className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20 group-hover:bg-accent/30 transition-colors">
                    <Eye className="h-5 w-5 text-accent" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Profile Settings</div>
                    <div className="text-xs text-muted-foreground">
                      Update info
                    </div>
                  </div>
                </Link>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 px-4 justify-start bg-background hover:bg-muted border-border/50 rounded-xl group"
                asChild
              >
                <Link href="/buyer/orders" className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted group-hover:bg-muted/80 transition-colors">
                    <Package className="h-5 w-5 text-foreground" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">My Orders</div>
                    <div className="text-xs text-muted-foreground">
                      Track deliveries
                    </div>
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>

      <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
        {/* My Pools */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>My Pool Investments</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/buyer/marketplace">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>My Slots</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Return</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myPools.slice(0, 5).map((pool) => (
                  <TableRow key={pool.id}>
                    <TableCell className="font-medium">
                      {pool.product_name}
                    </TableCell>
                    <TableCell>{pool.vendor_name}</TableCell>
                    <TableCell>
                      {pool.my_slots}/{pool.slots_count}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          pool.status === "completed"
                            ? "default"
                            : pool.status === "active"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {pool.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      ₦{pool.expected_return.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
                {myPools.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground py-4"
                    >
                      No pool investments yet. Start by browsing the
                      marketplace!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Disputes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Disputes</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/buyer/disputes">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {disputes.map((dispute) => (
                <div
                  key={dispute.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{dispute.pool_name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Created{" "}
                      {new Date(dispute.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        dispute.status === "open" ? "destructive" : "default"
                      }
                    >
                      {dispute.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      Updated{" "}
                      {new Date(dispute.last_updated).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {disputes.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  No disputes filed. Great job maintaining smooth transactions!
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
