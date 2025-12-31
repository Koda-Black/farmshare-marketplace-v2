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
  MoreVertical,
  Users,
  Calendar,
  Truck,
  Share2,
  ArrowRight,
  Flame,
  Eye,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Pool } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

interface PoolCardProps {
  pool: Pool;
}

export function PoolCard({ pool }: PoolCardProps) {
  const { toast } = useToast();
  const fillPercentage = (pool.slots_filled / pool.slots_count) * 100;
  const daysUntilDeadline = Math.ceil(
    (new Date(pool.delivery_deadline).getTime() - Date.now()) /
      (1000 * 60 * 60 * 24)
  );
  const isHot = fillPercentage > 70;
  const isUrgent = daysUntilDeadline <= 3;

  const statusColors = {
    active: "bg-green-100 text-green-700 border-0",
    full: "bg-accent/20 text-accent border-0",
    completed: "bg-primary/20 text-primary border-0",
    cancelled: "bg-destructive/20 text-destructive border-0",
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
    <Card className="card-premium hover-lift group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                {pool.product_name}
              </h3>
              {isHot && (
                <Badge className="bg-accent text-white border-0 text-xs">
                  <Flame className="h-3 w-3 mr-1" />
                  Hot
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {pool.product_description}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="cursor-pointer">
                <Eye className="mr-2 h-4 w-4" />
                View Details
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
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status Badge */}
        <Badge className={statusColors[pool.status]}>
          {pool.status.toUpperCase()}
        </Badge>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Pool Progress</span>
            <span className="font-semibold">
              {pool.slots_filled}/{pool.slots_count} slots
            </span>
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
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10">
              <Users className="h-3.5 w-3.5 text-accent" />
            </div>
            <span>{pool.slots_filled} buyers</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                isUrgent ? "bg-red-100" : "bg-muted"
              }`}
            >
              <Calendar
                className={`h-3.5 w-3.5 ${isUrgent ? "text-red-600" : ""}`}
              />
            </div>
            <span className={isUrgent ? "text-red-600 font-medium" : ""}>
              {daysUntilDeadline}d left
            </span>
          </div>
          {pool.allow_home_delivery && (
            <div className="flex items-center gap-2 text-muted-foreground col-span-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted">
                <Truck className="h-3.5 w-3.5" />
              </div>
              <span>
                Delivery: ₦{pool.home_delivery_cost?.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          variant="outline"
          className="w-full rounded-xl bg-transparent border-border/50 hover:bg-muted group/btn"
        >
          <span>View Details</span>
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
        </Button>
      </CardFooter>
    </Card>
  );
}
