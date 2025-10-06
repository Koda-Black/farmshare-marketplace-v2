"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Clock, Truck, MapPin, Users, Package, AlertCircle, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { CheckoutModal } from "@/components/buyer/checkout-modal"

export default function PoolDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  // Mock pool data
  const pool = {
    id: params.id,
    vendor_id: "vendor_1",
    vendor_name: "FarmCo Supplies",
    vendor_verified: true,
    vendor_rating: 4.8,
    vendor_total_sales: 156,
    product_name: "Premium Rice",
    product_description:
      "50kg bags of premium quality rice from northern farms. This rice is carefully selected and processed to ensure the highest quality. Perfect for both retail and wholesale purposes.",
    product_image: "/rice-bags-warehouse.jpg",
    slots_count: 10,
    slots_filled: 8,
    price_total: 500000,
    price_per_slot: 50000,
    allow_home_delivery: true,
    home_delivery_cost: 5000,
    pickup_location: "123 Farm Road, Kano State",
    delivery_deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active" as const,
    created_at: new Date().toISOString(),
    category: "grains",
  }

  const fillPercentage = (pool.slots_filled / pool.slots_count) * 100
  const slotsRemaining = pool.slots_count - pool.slots_filled
  const daysUntilDeadline = Math.ceil((new Date(pool.delivery_deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  return (
    <div className="container py-8">
      <div className="space-y-6">
        {/* Back Button */}
        <Button variant="ghost" asChild>
          <Link href="/buyer/marketplace">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Marketplace
          </Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Image */}
            <Card className="overflow-hidden">
              <div className="relative h-96 bg-muted">
                <Image
                  src={pool.product_image || "/placeholder.svg"}
                  alt={pool.product_name}
                  fill
                  className="object-cover"
                />
              </div>
            </Card>

            {/* Product Details */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <Badge variant="secondary">{pool.category}</Badge>
                    <CardTitle className="text-3xl">{pool.product_name}</CardTitle>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span>{pool.vendor_name}</span>
                      {pool.vendor_verified && <CheckCircle className="h-4 w-4 text-success" />}
                      <span>•</span>
                      <span>{pool.vendor_rating} ⭐</span>
                      <span>•</span>
                      <span>{pool.vendor_total_sales} sales</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">{pool.product_description}</p>
                </div>

                <Separator />

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold">Delivery Options</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>Pickup: {pool.pickup_location}</span>
                      </div>
                      {pool.allow_home_delivery && (
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-muted-foreground" />
                          <span>Home Delivery: +₦{pool.home_delivery_cost?.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold">Timeline</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Closes in {daysUntilDeadline} days</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span>Delivery within 7 days after pool fills</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Purchase Card */}
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Join This Pool</CardTitle>
                <CardDescription>Secure your slot now</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Price */}
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary">₦{pool.price_per_slot.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground">per slot</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total pool value: ₦{pool.price_total.toLocaleString()}
                  </p>
                </div>

                <Separator />

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pool Progress</span>
                    <span className="font-medium">
                      {pool.slots_filled}/{pool.slots_count} slots
                    </span>
                  </div>
                  <Progress value={fillPercentage} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    {slotsRemaining} {slotsRemaining === 1 ? "slot" : "slots"} remaining
                  </p>
                </div>

                <Separator />

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{pool.slots_filled} buyers</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{daysUntilDeadline}d left</span>
                  </div>
                </div>

                {/* Warning */}
                {slotsRemaining <= 3 && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs">Only {slotsRemaining} slots left! Join now.</AlertDescription>
                  </Alert>
                )}

                {/* Action Button */}
                <Button
                  size="lg"
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                  onClick={() => setIsCheckoutOpen(true)}
                  disabled={slotsRemaining === 0}
                >
                  {slotsRemaining === 0 ? "Pool Full" : "Join Pool"}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Secure payment via Paystack • Money-back guarantee
                </p>
              </CardContent>
            </Card>

            {/* Trust Badges */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Why Buy Here?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Verified Vendors</p>
                    <p className="text-muted-foreground text-xs">All vendors are verified and rated</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Secure Payments</p>
                    <p className="text-muted-foreground text-xs">Protected by Paystack escrow</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Quality Guarantee</p>
                    <p className="text-muted-foreground text-xs">Full refund if not satisfied</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <CheckoutModal open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen} pool={pool} />
    </div>
  )
}
