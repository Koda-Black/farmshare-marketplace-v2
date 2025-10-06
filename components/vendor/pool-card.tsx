"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { MoreVertical, Users, Calendar, Truck, Share2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Pool } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"

interface PoolCardProps {
  pool: Pool
}

export function PoolCard({ pool }: PoolCardProps) {
  const { toast } = useToast()
  const fillPercentage = (pool.slots_filled / pool.slots_count) * 100
  const daysUntilDeadline = Math.ceil((new Date(pool.delivery_deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  const statusColors = {
    active: "bg-primary text-primary-foreground",
    full: "bg-accent text-accent-foreground",
    completed: "bg-success text-success-foreground",
    cancelled: "bg-destructive text-destructive-foreground",
  }

  const copyPoolLink = async () => {
    const poolUrl = `${window.location.origin}/buyer/pool/${pool.id}`
    try {
      await navigator.clipboard.writeText(poolUrl)
      toast({
        title: "Link copied!",
        description: "Pool link has been copied to clipboard",
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <h3 className="font-semibold text-lg leading-tight">{pool.product_name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1">{pool.product_description}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuItem onClick={copyPoolLink}>
                <Share2 className="mr-2 h-4 w-4" />
                Share Pool
              </DropdownMenuItem>
              <DropdownMenuItem>Edit Pool</DropdownMenuItem>
              <DropdownMenuItem disabled={pool.slots_filled > 0} className="text-destructive">
                Delete Pool
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status Badge */}
        <Badge className={statusColors[pool.status]}>{pool.status.toUpperCase()}</Badge>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Pool Progress</span>
            <span className="font-medium">
              {pool.slots_filled}/{pool.slots_count} slots
            </span>
          </div>
          <Progress value={fillPercentage} className="h-2" />
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-primary">₦{pool.price_per_slot.toLocaleString()}</span>
          <span className="text-sm text-muted-foreground">per slot</span>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{pool.slots_filled} buyers</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{daysUntilDeadline}d left</span>
          </div>
          {pool.allow_home_delivery && (
            <>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Truck className="h-4 w-4" />
                <span>Delivery: ₦{pool.home_delivery_cost?.toLocaleString()}</span>
              </div>
            </>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button variant="outline" className="w-full bg-transparent">
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
}
