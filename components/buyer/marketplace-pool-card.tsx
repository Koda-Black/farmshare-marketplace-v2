"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, Truck, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface MarketplacePool {
  id: string
  vendor_name: string
  vendor_verified: boolean
  product_name: string
  product_description: string
  product_image: string
  slots_count: number
  slots_filled: number
  price_per_slot: number
  allow_home_delivery: boolean
  home_delivery_cost?: number
  delivery_deadline: string
  status: string
  category: string
}

interface MarketplacePoolCardProps {
  pool: MarketplacePool
}

export function MarketplacePoolCard({ pool }: MarketplacePoolCardProps) {
  const fillPercentage = (pool.slots_filled / pool.slots_count) * 100
  const slotsRemaining = pool.slots_count - pool.slots_filled
  const daysUntilDeadline = Math.ceil((new Date(pool.delivery_deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      {/* Product Image */}
      <div className="relative h-48 overflow-hidden bg-muted">
        <Image
          src={pool.product_image || "/placeholder.svg"}
          alt={pool.product_name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <Badge className="bg-background/90 text-foreground backdrop-blur-sm">{slotsRemaining} slots left</Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{pool.vendor_name}</span>
            {pool.vendor_verified && <CheckCircle className="h-4 w-4 text-success" />}
          </div>
          <h3 className="font-semibold text-lg leading-tight">{pool.product_name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{pool.product_description}</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Pool Progress</span>
            <span className="font-medium">{Math.round(fillPercentage)}%</span>
          </div>
          <Progress value={fillPercentage} className="h-2" />
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-primary">₦{pool.price_per_slot.toLocaleString()}</span>
          <span className="text-sm text-muted-foreground">per slot</span>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{pool.slots_filled} joined</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{daysUntilDeadline}d left</span>
          </div>
          {pool.allow_home_delivery && (
            <div className="flex items-center gap-2 text-muted-foreground col-span-2">
              <Truck className="h-4 w-4" />
              <span>Delivery: +₦{pool.home_delivery_cost?.toLocaleString()}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href={`/buyer/pool/${pool.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
