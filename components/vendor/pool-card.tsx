"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MoreVertical,
  Users,
  Calendar,
  Truck,
  Share2,
  ArrowRight,
  Flame,
  Eye,
  CheckCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Pool } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import Link from "next/link";

interface PoolCardProps {
  pool: Pool & {
    product_image?: string;
    vendor_verified?: boolean;
  };
}

export function PoolCard({ pool }: PoolCardProps) {
  const { toast } = useToast();
  const fillPercentage = (pool.slots_filled / pool.slots_count) * 100;
  const slotsRemaining = pool.slots_count - pool.slots_filled;
  const daysUntilDeadline = Math.ceil(
    (new Date(pool.delivery_deadline).getTime() - Date.now()) /
      (1000 * 60 * 60 * 24)
  );
  const isHot = fillPercentage > 70;
  const isUrgent = daysUntilDeadline <= 3;
  const isAlmostFull = slotsRemaining <= 3;

  const statusColors = {
    active: "bg-green-500 text-white",
    full: "bg-blue-500 text-white",
    completed: "bg-primary text-white",
    cancelled: "bg-destructive text-white",
  };

  const copyPoolLink = async () => {
    const poolUrl = `${window.location.origin}/buyer/pool/${pool.id}`;
    try {
      await navigator.clipboard.writeText(poolUrl);
      toast({
        title: "Link copied!",
        description: "Pool link has been copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="overflow-hidden group border-border/50 rounded-2xl hover:shadow-xl transition-all duration-300">
      {/* Product Image - Full Width Top */}
      <div className="relative h-40 overflow-hidden bg-muted">
        <Image
          src={pool.product_image || "/placeholder.svg"}
          alt={pool.product_name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {pool.vendor_verified && (
            <Badge className="bg-blue-500 text-white border-0 shadow-lg text-xs">
              <CheckCircle className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          )}
          {isHot && (
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg text-xs">
              <Flame className="h-3 w-3 mr-1" />
              Hot
            </Badge>
          )}
        </div>

        {/* Status Badge - Top Right */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <Badge className={`${statusColors[pool.status]} shadow-lg text-xs`}>
            {pool.status.toUpperCase()}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-lg bg-white/90 hover:bg-white text-gray-700"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link href={`/buyer/pool/${pool.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={copyPoolLink}
                className="cursor-pointer"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share Pool
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Edit Pool
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={pool.slots_filled > 0}
                className="text-destructive cursor-pointer"
              >
                Delete Pool
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Slots Badge - Bottom Left */}
        <div className="absolute bottom-3 left-3">
          <Badge
            className={`backdrop-blur-md border-0 shadow-lg font-semibold text-xs ${
              isAlmostFull
                ? "bg-red-500/90 text-white"
                : "bg-white/90 text-gray-800"
            }`}
          >
            {slotsRemaining} slots left
          </Badge>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Product Name */}
        <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">
          {pool.product_name}
        </h3>

        {/* Product Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
          {pool.product_description ||
            "Fresh quality produce direct from the farm"}
        </p>

        {/* Progress Bar Section */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground font-medium">
              Pool Progress
            </span>
            <span className="font-bold">
              {pool.slots_filled}/{pool.slots_count} slots
            </span>
          </div>
          <div className="relative h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
                fillPercentage > 80
                  ? "bg-gradient-to-r from-orange-400 to-red-500"
                  : fillPercentage > 50
                  ? "bg-gradient-to-r from-green-400 to-emerald-500"
                  : "bg-gradient-to-r from-blue-400 to-primary"
              }`}
              style={{ width: `${fillPercentage}%` }}
            />
          </div>
        </div>

        {/* Price and Stats Grid */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          {/* Price */}
          <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-3">
            <p className="text-xs text-muted-foreground mb-0.5">Price</p>
            <p className="text-lg font-bold text-primary">
              ₦{(pool.price_per_slot || 0).toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">per slot</p>
          </div>

          {/* Stats */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-accent" />
              <span className="font-medium">{pool.slots_filled} buyers</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar
                className={`h-4 w-4 ${
                  isUrgent ? "text-red-500" : "text-muted-foreground"
                }`}
              />
              <span className={`font-medium ${isUrgent ? "text-red-500" : ""}`}>
                {daysUntilDeadline}d left
              </span>
            </div>
            {pool.allow_home_delivery && (
              <div className="flex items-center gap-2 text-sm">
                <Truck className="h-4 w-4 text-accent" />
                <span className="text-accent font-medium text-xs">
                  +₦{(pool.home_delivery_cost || 0).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          asChild
          variant="outline"
          className="w-full h-10 rounded-xl font-semibold border-border/50 hover:bg-muted group/btn"
        >
          <Link
            href={`/buyer/pool/${pool.id}`}
            className="flex items-center justify-center gap-2"
          >
            View Details
            <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
