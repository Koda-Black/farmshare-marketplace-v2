"use client";

import { useState, useEffect, useCallback } from "react";
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
  RefreshCw,
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
import { httpRequest } from "@/lib/httpRequest";
import { useToast } from "@/hooks/use-toast";

interface Subscription {
  id: string;
  poolId: string;
  userId: string;
  slots: number;
  deliveryFee: number;
  paymentRef: string;
  createdAt: string;
  pool: {
    id: string;
    pricePerSlot: string;
    slotsCount: number;
    status: string;
    deliveryDeadlineUtc: string;
    product: {
      name: string;
      imageUrl?: string;
    };
    vendor: {
      name: string;
    };
  };
}

interface Dispute {
  id: string;
  poolId: string;
  status: string;
  reason: string;
  createdAt: string;
  updatedAt: string;
  pool?: {
    product?: {
      name: string;
    };
  };
}

export default function BuyerDashboardPage() {
  const { user } = useStore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState({
    activePools: 0,
    totalInvested: 0,
    pendingDisputes: 0,
    completedPools: 0,
  });
  const [mySubscriptions, setMySubscriptions] = useState<Subscription[]>([]);
  const [disputes, setDisputes] = useState<Dispute[]>([]);

  const fetchDashboardData = useCallback(async () => {
    try {
      // Fetch user's subscriptions (pools they've joined)
      const subscriptionsData = await httpRequest.get<Subscription[]>(
        "/pools/user/subscriptions"
      );
      const subscriptions = Array.isArray(subscriptionsData)
        ? subscriptionsData
        : [];
      setMySubscriptions(subscriptions);

      // Fetch user's disputes
      let disputesData: Dispute[] = [];
      try {
        const response = await httpRequest.get<Dispute[]>("/disputes/my");
        disputesData = Array.isArray(response) ? response : [];
      } catch (e) {
        // Disputes endpoint may not exist yet
        console.warn("Could not fetch disputes:", e);
      }
      setDisputes(disputesData);

      // Calculate stats from live data
      const activePoolsCount = subscriptions.filter(
        (s) => s.pool?.status === "OPEN" || s.pool?.status === "FILLED"
      ).length;

      const completedPoolsCount = subscriptions.filter(
        (s) => s.pool?.status === "DELIVERED" || s.pool?.status === "COMPLETED"
      ).length;

      // Ensure all values are properly converted to numbers before arithmetic
      const totalInvested = subscriptions.reduce((sum, sub) => {
        const pricePerSlot = Number(sub.pool?.pricePerSlot) || 0;
        const slots = Number(sub.slots) || 0;
        const deliveryFee = Number(sub.deliveryFee) || 0;
        return sum + slots * pricePerSlot + deliveryFee;
      }, 0);

      const pendingDisputesCount = disputesData.filter(
        (d) => d.status === "OPEN" || d.status === "PENDING"
      ).length;

      setStats({
        activePools: activePoolsCount,
        totalInvested,
        pendingDisputes: pendingDisputesCount,
        completedPools: completedPoolsCount,
      });
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [toast]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchDashboardData();
  };

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

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
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="ml-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
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
              <Link href="/buyer/orders">View All</Link>
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
                  <TableHead>Invested</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mySubscriptions.slice(0, 5).map((subscription) => {
                  const pricePerSlot =
                    Number(subscription.pool?.pricePerSlot) || 0;
                  const slots = Number(subscription.slots) || 0;
                  const deliveryFee = Number(subscription.deliveryFee) || 0;
                  const invested = slots * pricePerSlot + deliveryFee;
                  const status =
                    subscription.pool?.status?.toLowerCase() || "pending";

                  return (
                    <TableRow key={subscription.id}>
                      <TableCell className="font-medium">
                        {subscription.pool?.product?.name || "Unknown Product"}
                      </TableCell>
                      <TableCell>
                        {subscription.pool?.vendor?.name || "Unknown Vendor"}
                      </TableCell>
                      <TableCell>
                        {subscription.slots}/
                        {subscription.pool?.slotsCount || 0}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            status === "completed" || status === "delivered"
                              ? "default"
                              : status === "open" || status === "filled"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {status}
                        </Badge>
                      </TableCell>
                      <TableCell>₦{invested.toLocaleString()}</TableCell>
                    </TableRow>
                  );
                })}
                {mySubscriptions.length === 0 && (
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
              {disputes.slice(0, 5).map((dispute) => (
                <div
                  key={dispute.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium">
                      {dispute.pool?.product?.name ||
                        `Dispute #${dispute.id.slice(0, 8)}`}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Created {new Date(dispute.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        dispute.status === "OPEN" ||
                        dispute.status === "PENDING"
                          ? "destructive"
                          : dispute.status === "RESOLVED"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {dispute.status.toLowerCase()}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      Updated {new Date(dispute.updatedAt).toLocaleDateString()}
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
