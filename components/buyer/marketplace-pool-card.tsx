"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  Clock,
  Truck,
  Users,
  ArrowRight,
  Flame,
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
  const isHot = fillPercentage > 70;
  const isAlmostFull = slotsRemaining <= 3;

  return (
    <Card className="card-premium overflow-hidden group border-border/50">
      {/* Product Image */}
      <div className="relative h-52 overflow-hidden bg-muted">
        <Image
          src={pool.product_image || "/placeholder.svg"}
          alt={pool.product_name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {isHot && (
            <Badge className="bg-accent text-white border-0 shadow-lg shadow-accent/25">
              <Flame className="h-3 w-3 mr-1" />
              Hot
            </Badge>
          )}
          {pool.vendor_verified && (
            <Badge className="bg-primary text-primary-foreground border-0">
              <CheckCircle className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          )}
        </div>

        <div className="absolute top-3 right-3">
          <Badge
            className={`backdrop-blur-md border-0 shadow-lg ${
              isAlmostFull
                ? "bg-red-500/90 text-white"
                : "bg-background/90 text-foreground"
            }`}
          >
            {slotsRemaining} slots left
          </Badge>
        </div>

        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <Badge
            variant="secondary"
            className="bg-background/90 backdrop-blur-md"
          >
            {pool.category}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground font-medium">
              {pool.vendor_name}
            </span>
          </div>
          <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
            {pool.product_name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {pool.product_description}
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Pool Progress</span>
            <span className="font-semibold">{Math.round(fillPercentage)}%</span>
          </div>
          <div className="relative h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
                fillPercentage > 80
                  ? "bg-gradient-to-r from-accent to-red-500"
                  : "bg-gradient-to-r from-primary to-accent"
              }`}
              style={{ width: `${fillPercentage}%` }}
            />
          </div>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-primary">
            ₦{pool.price_per_slot.toLocaleString()}
          </span>
          <span className="text-sm text-muted-foreground">per slot</span>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-3.5 w-3.5 text-primary" />
            </div>
            <span>{pool.slots_filled} joined</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                daysUntilDeadline <= 3 ? "bg-red-100" : "bg-muted"
              }`}
            >
              <Clock
                className={`h-3.5 w-3.5 ${
                  daysUntilDeadline <= 3 ? "text-red-600" : ""
                }`}
              />
            </div>
            <span
              className={
                daysUntilDeadline <= 3 ? "text-red-600 font-medium" : ""
              }
            >
              {daysUntilDeadline}d left
            </span>
          </div>
          {pool.allow_home_delivery && (
            <div className="flex items-center gap-2 text-muted-foreground col-span-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted">
                <Truck className="h-3.5 w-3.5" />
              </div>
              <span>
                Delivery: +₦{pool.home_delivery_cost?.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0">
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
