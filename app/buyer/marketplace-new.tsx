"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search,
  TrendingUp,
  Clock,
  Users,
  Star,
  Award,
  Package,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { MarketplacePoolCard } from "@/components/buyer/marketplace-pool-card";
import { useStore } from "@/lib/store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { PoolsService, Pool } from "@/lib/api/pools";
import Link from "next/link";

export default function BuyerMarketplacePage() {
  const user = useStore((state) => state.user);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch pools from API
  useEffect(() => {
    const fetchPools = async () => {
      try {
        setLoading(true);
        const params: any = {};
        if (categoryFilter !== "all") params.category = categoryFilter;
        if (searchQuery) params.search = searchQuery;

        const poolsData = await PoolsService.getPools(params);
        setPools(poolsData);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch pools:", err);
        setError("Failed to load pools. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPools();
  }, [categoryFilter, searchQuery]);

  // Filter and sort pools
  const filteredPools = pools
    .filter((pool) => {
      if (
        searchQuery &&
        !pool.product.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      if (
        categoryFilter !== "all" &&
        pool.product.category !== categoryFilter
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "price_low":
          return Number(a.pricePerSlot) - Number(b.pricePerSlot);
        case "price_high":
          return Number(b.pricePerSlot) - Number(a.pricePerSlot);
        case "filling_fast":
          return b.takenSlots / b.slotsCount - a.takenSlots / a.slotsCount;
        default:
          return 0;
      }
    });

  // Mock trending vendors based on real pools
  const trendingPools = [...pools]
    .sort((a, b) => b.takenSlots / b.slotsCount - a.takenSlots / a.slotsCount)
    .slice(0, 3);

  const topVendors = pools
    .reduce((acc, pool) => {
      const existingVendor = acc.find((v) => v.id === pool.vendorId);
      if (existingVendor) {
        existingVendor.poolCount++;
        existingVendor.avgFillRate =
          (existingVendor.avgFillRate * existingVendor.poolCount +
            pool.takenSlots / pool.slotsCount) /
          (existingVendor.poolCount + 1);
      } else {
        acc.push({
          id: pool.vendorId,
          name: pool.vendor.name,
          verified: pool.vendor.isVerified,
          poolCount: 1,
          avgFillRate: pool.takenSlots / pool.slotsCount,
          rating: 4.5 + Math.random() * 0.5, // Mock rating
        });
      }
      return acc;
    }, [] as any[])
    .sort((a, b) => b.avgFillRate - a.avgFillRate)
    .slice(0, 3);

  if (loading) {
    return (
      <div className="container px-[30px] py-8">
        <div className="flex justify-center items-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading pools...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container px-[30px] py-8">
        <div className="text-center py-12">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold text-muted-foreground mb-2">
            Unable to load pools
          </h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-[30px] py-8">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Marketplace</h1>
          <p className="text-muted-foreground mt-1">
            Discover agricultural products from verified local farmers and join
            pool purchases to get better prices.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pools.length}</p>
                  <p className="text-xs text-muted-foreground">Active Pools</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {pools.reduce((acc, pool) => acc + pool.takenSlots, 0)}
                  </p>
                  <p className="text-xs text-muted-foreground">Active Buyers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{topVendors.length}</p>
                  <p className="text-xs text-muted-foreground">Top Vendors</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Star className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {
                      pools.filter((p) => p.takenSlots / p.slotsCount > 0.8)
                        .length
                    }
                  </p>
                  <p className="text-xs text-muted-foreground">Filling Fast</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:flex-1">
            <div className="relative flex-1 md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products, vendors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="grains">Grains</SelectItem>
                  <SelectItem value="vegetables">Vegetables</SelectItem>
                  <SelectItem value="livestock">Livestock</SelectItem>
                  <SelectItem value="dairy">Dairy</SelectItem>
                  <SelectItem value="oils">Oils</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price_low">Price: Low to High</SelectItem>
                  <SelectItem value="price_high">Price: High to Low</SelectItem>
                  <SelectItem value="filling_fast">Filling Fast</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Top Vendors */}
        {topVendors.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Top Vendors</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topVendors.map((vendor) => (
                <Card
                  key={vendor.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={vendor.avatar} alt={vendor.name} />
                        <AvatarFallback>
                          {vendor.name
                            .split(" ")
                            .map((word: string) => word[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">{vendor.name}</p>
                          {vendor.verified && (
                            <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{vendor.poolCount} pools</span>
                          <span>•</span>
                          <span>★ {vendor.rating.toFixed(1)}</span>
                          <span>•</span>
                          <span>
                            {(vendor.avgFillRate * 100).toFixed(0)}% filled
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Trending Pools */}
        {trendingPools.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Trending Pools</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {trendingPools.map((pool) => (
                <Link
                  key={pool.id}
                  href={`/buyer/pool/${pool.id}`}
                  className="block hover:no-underline"
                >
                  <MarketplacePoolCard
                    id={pool.id}
                    vendorName={pool.vendor.name}
                    vendorVerified={pool.vendor.isVerified}
                    productName={pool.product.name}
                    productImage={pool.product.imageUrl}
                    slotsCount={pool.slotsCount}
                    slotsFilled={pool.takenSlots}
                    pricePerSlot={Number(pool.pricePerSlot)}
                    allowHomeDelivery={pool.allowHomeDelivery}
                    homeDeliveryCost={pool.homeDeliveryCost}
                    deliveryDeadline={pool.deliveryDeadlineUtc}
                    status={pool.status}
                    category={pool.product.category}
                  />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All Pools */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            All Pools ({filteredPools.length})
          </h2>
          {filteredPools.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                No pools found
              </h3>
              <p className="text-muted-foreground">
                {searchQuery || categoryFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Check back later for new pools"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPools.map((pool) => (
                <Link
                  key={pool.id}
                  href={`/buyer/pool/${pool.id}`}
                  className="block hover:no-underline"
                >
                  <MarketplacePoolCard
                    id={pool.id}
                    vendorName={pool.vendor.name}
                    vendorVerified={pool.vendor.isVerified}
                    productName={pool.product.name}
                    productImage={pool.product.imageUrl}
                    slotsCount={pool.slotsCount}
                    slotsFilled={pool.takenSlots}
                    pricePerSlot={Number(pool.pricePerSlot)}
                    allowHomeDelivery={pool.allowHomeDelivery}
                    homeDeliveryCost={pool.homeDeliveryCost}
                    deliveryDeadline={pool.deliveryDeadlineUtc}
                    status={pool.status}
                    category={pool.product.category}
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
