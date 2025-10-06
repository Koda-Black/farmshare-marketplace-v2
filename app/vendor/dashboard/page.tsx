"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, TrendingUp, Users, Package, DollarSign, AlertCircle, Share2 } from "lucide-react"
import { CreatePoolModal } from "@/components/vendor/create-pool-modal"
import { PoolCard } from "@/components/vendor/pool-card"
import { useStore } from "@/lib/store"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function VendorDashboardPage() {
  const user = useStore((state) => state.user)
  const pools = useStore((state) => state.pools)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const { toast } = useToast()

  const isVerified = user?.verification_status === "verified" && user?.bank_verified

  const copyProfileLink = async () => {
    const profileUrl = `${window.location.origin}/vendor/profile/${user?.id}`
    try {
      await navigator.clipboard.writeText(profileUrl)
      toast({
        title: "Profile link copied!",
        description: "Share this link so people can browse your pools",
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }

  const stats = {
    totalPools: pools.length || 3,
    activePools: pools.filter((p) => p.status === "active").length || 2,
    totalRevenue: 450000,
    totalBuyers: 24,
  }

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
      delivery_deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
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
      delivery_deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
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
      delivery_deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active" as const,
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  return (
    <div className="container px-[30px] py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your pools and track your sales</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={copyProfileLink}
              className="border-accent text-accent hover:bg-accent/10 bg-transparent"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share Profile
            </Button>
            <Button
              size="lg"
              onClick={() => setIsCreateModalOpen(true)}
              disabled={!isVerified}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Pool
            </Button>
          </div>
        </div>

        {/* Verification Warning */}
        {!isVerified && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>You must complete verification before creating pools</span>
              <Button variant="outline" size="sm" asChild className="bg-background">
                <Link href="/vendor/verification">Complete Verification</Link>
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pools</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPools}</div>
              <p className="text-xs text-muted-foreground">{stats.activePools} active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦{stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">From completed pools</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Buyers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBuyers}</div>
              <p className="text-xs text-muted-foreground">Across all pools</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Fill Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground">Pool completion rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Pools Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">My Pools</h2>
            <div className="flex gap-2">
              <Badge variant="secondary">All</Badge>
              <Badge variant="outline">Active</Badge>
              <Badge variant="outline">Full</Badge>
              <Badge variant="outline">Completed</Badge>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockPools.map((pool) => (
              <PoolCard key={pool.id} pool={pool} />
            ))}
          </div>
        </div>
      </div>

      <CreatePoolModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
    </div>
  )
}
