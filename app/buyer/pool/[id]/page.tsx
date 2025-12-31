"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Clock, Truck, MapPin, Users, Package, AlertCircle, ArrowLeft, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { EnhancedCheckoutModal } from "@/components/buyer/enhanced-checkout-modal"
import { httpRequest } from "@/lib/httpRequest"

export default function PoolDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [pool, setPool] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPool = async () => {
      if (!params.id) {
        setError("Pool ID is required")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const response = await httpRequest.get(`/pools/${params.id}`)
        setPool(response)
      } catch (err: any) {
        console.error('Failed to fetch pool:', err)
        setError(err?.response?.data?.message || 'Pool not found')
        setPool(null)
      } finally {
        setLoading(false)
      }
    }

    fetchPool()
  }, [params.id])

  const handleJoinPool = () => {
    if (!pool) return
    setIsCheckoutOpen(true)
  }

  if (loading) {
    return (
      <div className="container px-[30px] py-8">
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span>Loading pool details...</span>
        </div>
      </div>
    )
  }

  if (error || !pool) {
    return (
      <div className="container px-[30px] py-8">
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
          <AlertCircle className="h-16 w-16 text-destructive" />
          <h1 className="text-2xl font-bold text-destructive">Pool Not Found</h1>
          <p className="text-muted-foreground max-w-md">{error || 'This pool may have been closed or does not exist.'}</p>
          <Button onClick={() => router.push('/buyer/marketplace')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Marketplace
          </Button>
        </div>
      </div>
    )
  }

  const fillPercentage = (pool.slots_filled / pool.slots_count) * 100

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-[30px] py-8 max-w-6xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          className="mb-6"
          onClick={() => router.push('/buyer/marketplace')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Marketplace
        </Button>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="relative h-64 lg:h-80">
                <Image
                  src={pool.product_image || "/placeholder.svg"}
                  alt={pool.product_name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {pool.category?.toUpperCase() || 'OTHER'}
                  </Badge>
                </div>
                {pool.vendor_verified && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-green-500 text-white">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified Vendor
                    </Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-balance mb-2">
                      {pool.product_name}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {pool.vendor_name}
                      </span>
                      <span>•</span>
                      <span>{pool.slots_filled}/{pool.slots_count} slots filled</span>
                    </div>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed mb-6">
                  {pool.product_description}
                </p>

                <Separator className="my-6" />

                {/* Delivery Options */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Truck className="w-5 h-5 text-primary" />
                      <span className="font-medium">Home Delivery</span>
                    </div>
                    <Badge variant={pool.allow_home_delivery ? "default" : "secondary"}>
                      {pool.allow_home_delivery ? "Available (+₦" + (pool.home_delivery_cost || 0).toLocaleString() + ")" : "Not Available"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      <span className="font-medium">Delivery Timeline</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Closes {new Date(pool.delivery_deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Pool Progress */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Pool Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {Math.round(fillPercentage)}% Complete
                    </span>
                  </div>
                  <Progress value={fillPercentage} className="h-3" />
                  <div className="flex items-center justify-between text-sm">
                    <span>{pool.slots_filled} buyers joined</span>
                    <span>{pool.slots_count - pool.slots_filled} slots remaining</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Why Buy Here */}
            <Card>
              <CardHeader>
                <CardTitle>Why Buy Here?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Verified Vendors</h4>
                    <p className="text-sm text-muted-foreground">All vendors are verified and rated</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Secure Payments</h4>
                    <p className="text-sm text-muted-foreground">Protected by Paystack escrow</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Quality Guarantee</h4>
                    <p className="text-sm text-muted-foreground">Full refund if not satisfied</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Payment */}
          <div className="space-y-6">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="text-3xl font-bold text-primary">
                    ₦{pool.price_per_slot.toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">per slot</p>
                  <p className="text-xs text-muted-foreground">
                    Total pool value: ₦{pool.price_total?.toLocaleString() || (pool.price_per_slot * pool.slots_count).toLocaleString()}
                  </p>
                </div>

                <Separator />

                <Button
                  onClick={handleJoinPool}
                  className="w-full"
                  disabled={pool.status !== 'open' || pool.slots_filled >= pool.slots_count}
                >
                  {pool.status !== 'open'
                    ? 'Pool Closed'
                    : pool.slots_filled >= pool.slots_count
                    ? 'Pool Full'
                    : 'Join Pool'
                  }
                </Button>

                <div className="text-center space-y-2 text-xs text-muted-foreground">
                  <p>Secure payment via Paystack</p>
                  <p>Money-back guarantee</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <EnhancedCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        pool={pool}
      />
    </div>
  )
}