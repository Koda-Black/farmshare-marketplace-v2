"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  TrendingUp,
  Users,
  Package,
  DollarSign,
  AlertCircle,
  Share2,
  Store,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { CreatePoolModal } from "@/components/vendor/create-pool-modal";
import { PoolCard } from "@/components/vendor/pool-card";
import { useStore } from "@/lib/store";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function VendorDashboardPage() {
  const user = useStore((state) => state.user);
  const pools = useStore((state) => state.pools);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { toast } = useToast();

  const isVerified =
    user?.verification_status === "verified" && user?.bank_verified;

  const copyProfileLink = async () => {
    const profileUrl = `${window.location.origin}/vendor/profile/${user?.id}`;
    try {
      await navigator.clipboard.writeText(profileUrl);
      toast({
        title: "Profile link copied!",
        description: "Share this link so people can browse your pools",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const stats = {
    totalPools: pools.length || 3,
    activePools: pools.filter((p) => p.status === "active").length || 2,
    totalRevenue: 450000,
    totalBuyers: 24,
  };

  const mockPools = [
    {
      id: "pool_1",
      vendor_id: user?.id || "",
      product_name: "Premium Rice",
      product_description: "50kg bags of premium quality rice",
      slots_count: 10,
      slots_filled: 8,
      price_total: 500000,
      price_per_slot: 50000,
      allow_home_delivery: true,
      home_delivery_cost: 5000,
      delivery_deadline: new Date(
        Date.now() + 3 * 24 * 60 * 60 * 1000
      ).toISOString(),
      status: "active" as const,
      created_at: new Date().toISOString(),
    },
    {
      id: "pool_2",
      vendor_id: user?.id || "",
      product_name: "Organic Tomatoes",
      product_description: "Fresh organic tomatoes - 25kg crates",
      slots_count: 15,
      slots_filled: 15,
      price_total: 225000,
      price_per_slot: 15000,
      allow_home_delivery: false,
      delivery_deadline: new Date(
        Date.now() + 1 * 24 * 60 * 60 * 1000
      ).toISOString(),
      status: "full" as const,
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "pool_3",
      vendor_id: user?.id || "",
      product_name: "Yellow Maize",
      product_description: "100kg bags of yellow maize",
      slots_count: 8,
      slots_filled: 3,
      price_total: 320000,
      price_per_slot: 40000,
      allow_home_delivery: true,
      home_delivery_cost: 8000,
      delivery_deadline: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
      status: "active" as const,
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  return (
    <div className="container px-[30px] lg:px-[60px] py-10">
      <div className="space-y-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/20">
                <Store className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold">
                  Vendor Dashboard
                </h1>
                {isVerified && (
                  <Badge className="mt-1 bg-green-100 text-green-700 border-0">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Verified Vendor
                  </Badge>
                )}
              </div>
            </div>
            <p className="text-muted-foreground text-lg mt-2">
              Welcome back,{" "}
              <span className="font-semibold text-foreground">
                {user?.name}
              </span>
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={copyProfileLink}
              className="border-accent/50 text-accent hover:bg-accent/10 bg-transparent rounded-xl"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share Profile
            </Button>
            <Button
              size="lg"
              onClick={() => setIsCreateModalOpen(true)}
              disabled={!isVerified}
              className="bg-accent hover:bg-accent/90 text-white rounded-xl shadow-lg shadow-accent/25 hover:shadow-xl transition-all"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Pool
            </Button>
          </div>
        </div>

        {/* Verification Warning */}
        {!isVerified && (
          <Alert variant="destructive" className="rounded-xl border-2">
            <AlertCircle className="h-5 w-5" />
            <AlertDescription className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-semibold">Verification Required</p>
                <p className="text-sm opacity-90">
                  You must complete verification before creating pools
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="bg-background hover:bg-background/80 shrink-0"
              >
                <Link href="/vendor/verification">Complete Verification</Link>
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="card-premium hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Pools
              </CardTitle>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Package className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalPools}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.activePools} currently active
              </p>
            </CardContent>
          </Card>

          <Card className="card-premium hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </CardTitle>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                ₦{stats.totalRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                From completed pools
              </p>
            </CardContent>
          </Card>

          <Card className="card-premium hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Buyers
              </CardTitle>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20">
                <Users className="h-5 w-5 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalBuyers}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Across all pools
              </p>
            </CardContent>
          </Card>

          <Card className="card-premium hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Fill Rate
              </CardTitle>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground mt-1">
                Pool completion rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pools Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold">My Pools</h2>
            <div className="flex gap-2 flex-wrap">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer">
                All
              </Badge>
              <Badge
                variant="outline"
                className="hover:bg-muted cursor-pointer"
              >
                Active
              </Badge>
              <Badge
                variant="outline"
                className="hover:bg-muted cursor-pointer"
              >
                Full
              </Badge>
              <Badge
                variant="outline"
                className="hover:bg-muted cursor-pointer"
              >
                Completed
              </Badge>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockPools.map((pool, index) => (
              <div
                key={pool.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <PoolCard pool={pool} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <CreatePoolModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </div>
  );
}
