"use client"

import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star, MapPin, Package, TrendingUp, CheckCircle2 } from "lucide-react"
import { MarketplacePoolCard } from "@/components/buyer/marketplace-pool-card"
import Link from "next/link"

export default function VendorProfilePage() {
  const params = useParams()
  const vendorId = params.id as string

  // Mock vendor data - in production, fetch from API
  const vendor = {
    id: vendorId,
    name: "Adebayo Farms",
    location: "Lagos, Nigeria",
    rating: 4.8,
    totalReviews: 156,
    completedPools: 48,
    onTimeDelivery: 98,
    responseTime: "2 hours",
    memberSince: "2023",
    verified: true,
    bio: "Premium agricultural products supplier with over 10 years of experience. We specialize in bulk rice, maize, and fresh produce delivery across Lagos and surrounding states.",
  }

  // Mock pools from this vendor
  const vendorPools = [
    {
      id: "pool_1",
      vendor_id: vendorId,
      vendor_name: vendor.name,
      vendor_rating: vendor.rating,
      product_name: "Premium Rice",
      product_description: "50kg bags of premium quality rice",
      image_url: "/rice-bags.jpg",
      slots_count: 10,
      slots_filled: 8,
      price_per_slot: 50000,
      allow_home_delivery: true,
      home_delivery_cost: 5000,
      delivery_deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active" as const,
    },
    {
      id: "pool_3",
      vendor_id: vendorId,
      vendor_name: vendor.name,
      vendor_rating: vendor.rating,
      product_name: "Yellow Maize",
      product_description: "100kg bags of yellow maize",
      image_url: "/yellow-corn-maize.jpg",
      slots_count: 8,
      slots_filled: 3,
      price_per_slot: 40000,
      allow_home_delivery: true,
      home_delivery_cost: 8000,
      delivery_deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active" as const,
    },
    {
      id: "pool_5",
      vendor_id: vendorId,
      vendor_name: vendor.name,
      vendor_rating: vendor.rating,
      product_name: "Fresh Tomatoes",
      product_description: "25kg crates of fresh organic tomatoes",
      image_url: "/fresh-tomatoes.png",
      slots_count: 12,
      slots_filled: 9,
      price_per_slot: 18000,
      allow_home_delivery: false,
      delivery_deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active" as const,
    },
  ]

  return (
    <div className="container px-[30px] lg:px-[60px] py-8">
      <div className="space-y-8">
        {/* Vendor Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar and Basic Info */}
              <div className="flex flex-col items-center md:items-start gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {vendor.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {vendor.verified && (
                  <Badge className="bg-primary text-primary-foreground">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Verified Vendor
                  </Badge>
                )}
              </div>

              {/* Vendor Details */}
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-3xl font-bold">{vendor.name}</h1>
                  <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{vendor.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-accent text-accent" />
                      <span className="font-medium text-foreground">{vendor.rating}</span>
                      <span>({vendor.totalReviews} reviews)</span>
                    </div>
                  </div>
                </div>

                <p className="text-muted-foreground">{vendor.bio}</p>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Package className="h-4 w-4" />
                      <span>Completed Pools</span>
                    </div>
                    <p className="text-2xl font-bold">{vendor.completedPools}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <TrendingUp className="h-4 w-4" />
                      <span>On-Time Delivery</span>
                    </div>
                    <p className="text-2xl font-bold">{vendor.onTimeDelivery}%</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm">Response Time</p>
                    <p className="text-2xl font-bold">{vendor.responseTime}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm">Member Since</p>
                    <p className="text-2xl font-bold">{vendor.memberSince}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Pools Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Active Pools</h2>
              <p className="text-muted-foreground">Browse and join available pools from this vendor</p>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {vendorPools.length} Active
            </Badge>
          </div>

          {vendorPools.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {vendorPools.map((pool) => (
                <MarketplacePoolCard key={pool.id} pool={pool} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Active Pools</h3>
                <p className="text-muted-foreground mb-4">This vendor doesn't have any active pools at the moment.</p>
                <Button asChild>
                  <Link href="/buyer/marketplace">Browse All Pools</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
