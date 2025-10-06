"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, TrendingUp, Clock, Users, Star, Award, Package, CheckCircle } from "lucide-react"
import { MarketplacePoolCard } from "@/components/buyer/marketplace-pool-card"
import { useStore } from "@/lib/store"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

export default function BuyerMarketplacePage() {
  const user = useStore((state) => state.user)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  // Mock marketplace pools
  const marketplacePools = [
    {
      id: "pool_1",
      vendor_id: "vendor_1",
      vendor_name: "FarmCo Supplies",
      vendor_verified: true,
      product_name: "Premium Rice",
      product_description: "50kg bags of premium quality rice from northern farms",
      product_image: "/rice-bags.jpg",
      slots_count: 10,
      slots_filled: 8,
      price_total: 500000,
      price_per_slot: 50000,
      allow_home_delivery: true,
      home_delivery_cost: 5000,
      delivery_deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active" as const,
      created_at: new Date().toISOString(),
      category: "grains",
      fill_rate: 80,
      join_velocity: 2.5, // slots per day
    },
    {
      id: "pool_2",
      vendor_id: "vendor_2",
      vendor_name: "Green Valley Farms",
      vendor_verified: true,
      product_name: "Organic Tomatoes",
      product_description: "Fresh organic tomatoes - 25kg crates, harvested daily",
      product_image: "/fresh-tomatoes.png",
      slots_count: 15,
      slots_filled: 12,
      price_total: 225000,
      price_per_slot: 15000,
      allow_home_delivery: false,
      delivery_deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active" as const,
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      category: "vegetables",
      fill_rate: 80,
      join_velocity: 6.0,
    },
    {
      id: "pool_3",
      vendor_id: "vendor_1",
      vendor_name: "FarmCo Supplies",
      vendor_verified: true,
      product_name: "Yellow Maize",
      product_description: "100kg bags of yellow maize, perfect for livestock feed",
      product_image: "/yellow-corn-maize.jpg",
      slots_count: 8,
      slots_filled: 3,
      price_total: 320000,
      price_per_slot: 40000,
      allow_home_delivery: true,
      home_delivery_cost: 8000,
      delivery_deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active" as const,
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      category: "grains",
      fill_rate: 37.5,
      join_velocity: 1.5,
    },
    {
      id: "pool_4",
      vendor_id: "vendor_3",
      vendor_name: "Tropical Harvest",
      vendor_verified: false,
      product_name: "Palm Oil",
      product_description: "Pure red palm oil - 25L containers, locally sourced",
      product_image: "/palm-oil-containers.jpg",
      slots_count: 12,
      slots_filled: 5,
      price_total: 360000,
      price_per_slot: 30000,
      allow_home_delivery: true,
      home_delivery_cost: 3000,
      delivery_deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active" as const,
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      category: "oils",
      fill_rate: 41.7,
      join_velocity: 1.7,
    },
  ]

  const trendingPools = [...marketplacePools].sort((a, b) => b.join_velocity - a.join_velocity).slice(0, 3)

  const topVendors = [
    {
      id: "vendor_1",
      name: "FarmCo Supplies",
      avatar: "/rice-bags.jpg",
      verified: true,
      pools_completed: 45,
      on_time_delivery: 98.5,
      complaints: 2,
      rating: 4.9,
    },
    {
      id: "vendor_2",
      name: "Green Valley Farms",
      avatar: "/fresh-tomatoes.png",
      verified: true,
      pools_completed: 38,
      on_time_delivery: 97.2,
      complaints: 1,
      rating: 4.8,
    },
    {
      id: "vendor_5",
      name: "Harvest Gold Co.",
      avatar: "/yellow-corn-maize.jpg",
      verified: true,
      pools_completed: 52,
      on_time_delivery: 99.1,
      complaints: 0,
      rating: 5.0,
    },
  ]

  return (
    <div className="container px-[30px] py-8">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Marketplace</h1>
          <p className="text-muted-foreground mt-1">Browse and join buying pools for agricultural products</p>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="grains">Grains</SelectItem>
                  <SelectItem value="vegetables">Vegetables</SelectItem>
                  <SelectItem value="oils">Oils</SelectItem>
                  <SelectItem value="legumes">Legumes</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="ending-soon">Ending Soon</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Pools</p>
                  <p className="text-2xl font-bold">{marketplacePools.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Users className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Buyers</p>
                  <p className="text-2xl font-bold">28</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/10 rounded-lg">
                  <Clock className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ending Soon</p>
                  <p className="text-2xl font-bold">2</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            <h2 className="text-2xl font-semibold">Trending Pools</h2>
            <Badge variant="secondary" className="ml-2">
              Fastest Filling
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Pools that are filling up quickly based on recent buyer activity
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {trendingPools.map((pool) => (
              <Card key={pool.id} className="border-accent/50 bg-accent/5">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{pool.product_name}</h3>
                        <p className="text-sm text-muted-foreground">{pool.vendor_name}</p>
                      </div>
                      <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Hot
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">
                          {pool.slots_filled}/{pool.slots_count} slots
                        </span>
                      </div>
                      <Progress value={pool.fill_rate} className="h-2" />
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-lg font-bold">₦{pool.price_per_slot.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground">{pool.join_velocity} joins/day</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-semibold">Top Vendors</h2>
            <Badge variant="secondary" className="ml-2">
              Top 5%
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Vendors with the best delivery records and customer satisfaction
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {topVendors.map((vendor) => (
              <Card key={vendor.id} className="border-primary/30 bg-primary/5">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={vendor.avatar || "/placeholder.svg"} alt={vendor.name} />
                        <AvatarFallback>{vendor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{vendor.name}</h3>
                          {vendor.verified && <CheckCircle className="h-4 w-4 text-primary" />}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                          <span className="text-sm font-medium">{vendor.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Package className="h-3 w-3" />
                          Pools Completed
                        </span>
                        <span className="font-medium">{vendor.pools_completed}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          On-Time Delivery
                        </span>
                        <span className="font-medium text-success">{vendor.on_time_delivery}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Complaints
                        </span>
                        <span className="font-medium">{vendor.complaints}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* All Pools Grid */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">All Available Pools</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {marketplacePools.map((pool) => (
              <MarketplacePoolCard key={pool.id} pool={pool} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
