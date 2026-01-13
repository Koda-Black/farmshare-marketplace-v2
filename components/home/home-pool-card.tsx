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
} from "lucide-react";
import Image from "next/image";

interface HomePool {
  id: string;
  product_name: string;
  product_description?: string;
  product_image: string;
  price_per_slot: number;
  slots_count: number;
  slots_filled: number;
  vendor_name: string;
  vendor_verified?: boolean;
  allow_home_delivery: boolean;
  home_delivery_cost?: number;
  delivery_deadline: string;
  category?: string;
}

interface HomePoolCardProps {
  pool: HomePool;
  onJoin: (poolId: string) => void;
  index?: number;
}

export function HomePoolCard({ pool, onJoin, index = 0 }: HomePoolCardProps) {
  const fillPercentage = (pool.slots_filled / pool.slots_count) * 100;
  const slotsRemaining = pool.slots_count - pool.slots_filled;
  const daysUntilDeadline = Math.ceil(
    (new Date(pool.delivery_deadline).getTime() - Date.now()) /
      (1000 * 60 * 60 * 24)
  );
  const isHot = fillPercentage > 70;
  const isAlmostFull = slotsRemaining <= 3;
  const isFull = slotsRemaining <= 0;

  return (
    <Card
      className="overflow-hidden group border-border/50 rounded-2xl hover:shadow-xl transition-all duration-300 animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Product Image - Full Width Top */}
      <div className="relative h-44 overflow-hidden">
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

        {/* Slots Badge - Top Right */}
        <div className="absolute top-3 right-3">
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

        {/* Category Badge - Bottom Left */}
        {pool.category && (
          <div className="absolute bottom-3 left-3">
            <Badge
              variant="secondary"
              className="bg-white/90 backdrop-blur-md text-gray-700 capitalize text-xs"
            >
              {pool.category}
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Vendor Name */}
        <p className="text-xs text-muted-foreground font-medium truncate">
          {pool.vendor_name}
        </p>

        {/* Product Name */}
        <h3 className="font-bold text-base leading-tight group-hover:text-primary transition-colors line-clamp-1">
          {pool.product_name}
        </h3>

        {/* Product Description */}
        <p className="text-xs text-muted-foreground line-clamp-2 min-h-[32px]">
          {pool.product_description ||
            "Fresh quality produce direct from the farm"}
        </p>

        {/* Progress Bar Section */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground font-medium">
              Pool Progress
            </span>
            <span className="font-bold text-primary">
              {Math.round(fillPercentage)}%
            </span>
          </div>
          <div className="relative h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
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

        {/* Price and Stats */}
        <div className="flex items-center justify-between pt-1">
          {/* Price */}
          <div>
            <p className="text-lg font-bold text-primary">
              ₦{pool.price_per_slot.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">per slot</p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-primary" />
              <span>{pool.slots_filled}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock
                className={`h-3.5 w-3.5 ${
                  daysUntilDeadline <= 3 ? "text-red-500" : ""
                }`}
              />
              <span
                className={
                  daysUntilDeadline <= 3 ? "text-red-500 font-medium" : ""
                }
              >
                {daysUntilDeadline}d
              </span>
            </div>
            {pool.allow_home_delivery && (
              <Truck className="h-3.5 w-3.5 text-accent" />
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          onClick={() => onJoin(pool.id)}
          disabled={isFull}
          className="w-full h-10 bg-accent hover:bg-accent/90 text-white rounded-xl font-semibold shadow-lg shadow-accent/20 hover:shadow-xl transition-all duration-300 group/btn text-sm"
        >
          {isFull ? "Pool Full" : "Join Pool"}
          {!isFull && (
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
