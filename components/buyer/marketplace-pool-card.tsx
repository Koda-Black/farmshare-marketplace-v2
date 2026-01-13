"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Clock,
  Truck,
  Users,
  ArrowRight,
  Flame,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface MarketplacePool {
  id: string;
  vendor_name: string;
  vendor_verified: boolean;
  product_name: string;
  product_description: string;
  product_image: string;
  slots_count: number;
  slots_filled: number;
  price_per_slot: number;
  allow_home_delivery: boolean;
  home_delivery_cost?: number;
  delivery_deadline: string;
  status: string;
  category: string;
  joins_per_day?: number;
}

interface MarketplacePoolCardProps {
  pool: MarketplacePool;
}

export function MarketplacePoolCard({ pool }: MarketplacePoolCardProps) {
  const fillPercentage = (pool.slots_filled / pool.slots_count) * 100;
  const slotsRemaining = pool.slots_count - pool.slots_filled;
  const daysUntilDeadline = Math.ceil(
    (new Date(pool.delivery_deadline).getTime() - Date.now()) /
      (1000 * 60 * 60 * 24)
  );
  const isHot =
    fillPercentage > 70 || (pool.joins_per_day && pool.joins_per_day > 1.5);
  const isAlmostFull = slotsRemaining <= 3;

  return (
    <Card className="overflow-hidden group border-border/50 rounded-2xl hover:shadow-xl transition-all duration-300">
      {/* Product Image - Full Width Top */}
      <div className="relative h-48 overflow-hidden">
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
            <Badge className="bg-blue-500 text-white border-0 shadow-lg">
              <CheckCircle className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          )}
          {isHot && (
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg">
              <Flame className="h-3 w-3 mr-1" />
              Hot
            </Badge>
          )}
        </div>

        {/* Slots Badge - Top Right */}
        <div className="absolute top-3 right-3">
          <Badge
            className={`backdrop-blur-md border-0 shadow-lg font-semibold ${
              isAlmostFull
                ? "bg-red-500/90 text-white"
                : "bg-white/90 text-gray-800"
            }`}
          >
            {slotsRemaining} slots left
          </Badge>
        </div>

        {/* Category Badge - Bottom Left */}
        <div className="absolute bottom-3 left-3">
          <Badge
            variant="secondary"
            className="bg-white/90 backdrop-blur-md text-gray-700 capitalize"
          >
            {pool.category}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Vendor Name */}
        <p className="text-sm text-muted-foreground font-medium truncate">
          {pool.vendor_name}
        </p>

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
        <div className="space-y-2 pt-1">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground font-medium">
              Pool Progress
            </span>
            <span className="font-bold text-primary">
              {Math.round(fillPercentage)}%
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
        <div className="grid grid-cols-2 gap-3 pt-2">
          {/* Price */}
          <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-3">
            <p className="text-xs text-muted-foreground mb-0.5">Price</p>
            <p className="text-lg font-bold text-primary">
              ₦{pool.price_per_slot.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">per slot</p>
          </div>

          {/* Stats */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-primary" />
              <span className="font-medium">{pool.slots_filled} joined</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock
                className={`h-4 w-4 ${
                  daysUntilDeadline <= 3
                    ? "text-red-500"
                    : "text-muted-foreground"
                }`}
              />
              <span
                className={`font-medium ${
                  daysUntilDeadline <= 3 ? "text-red-500" : ""
                }`}
              >
                {daysUntilDeadline}d left
              </span>
            </div>
            {pool.allow_home_delivery && (
              <div className="flex items-center gap-2 text-sm">
                <Truck className="h-4 w-4 text-accent" />
                <span className="text-accent font-medium">
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
          className="w-full h-11 bg-accent hover:bg-accent/90 text-white rounded-xl font-semibold shadow-lg shadow-accent/20 hover:shadow-xl transition-all duration-300 group/btn"
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
