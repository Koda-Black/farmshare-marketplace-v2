"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  Clock,
  Truck,
  Users,
  AlertCircle,
  ArrowLeft,
  Loader2,
  TrendingUp,
  Star,
  Shield,
  MapPin,
  Flame,
  Share2,
  Heart,
  ChevronRight,
  Package,
  Zap,
  MessageCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { EnhancedCheckoutModal } from "@/components/buyer/enhanced-checkout-modal";
import { httpRequest } from "@/lib/httpRequest";
import { MarketplacePoolCard } from "@/components/buyer/marketplace-pool-card";
import { useToast } from "@/hooks/use-toast";

export default function PoolDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [pool, setPool] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [popularPools, setPopularPools] = useState<any[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchPool = async () => {
      if (!params.id) {
        setError("Pool ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await httpRequest.get(`/pools/${params.id}`);
        setPool(response);
      } catch (err: any) {
        console.error("Failed to fetch pool:", err);
        setError(err?.response?.data?.message || "Pool not found");
        setPool(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPool();
  }, [params.id]);

  useEffect(() => {
    const fetchPopularPools = async () => {
      try {
        const response = await httpRequest.get("/pools");
        const allPools = response.data || response || [];
        const sorted = allPools
          .filter((p: any) => p.id !== params.id && p.status === "active")
          .sort((a: any, b: any) => {
            const aFillRate = a.slots_filled / a.slots_count;
            const bFillRate = b.slots_filled / b.slots_count;
            return bFillRate - aFillRate;
          })
          .slice(0, 4);
        setPopularPools(sorted);
      } catch (err) {
        console.warn("Failed to fetch popular pools:", err);
      }
    };

    if (params.id) {
      fetchPopularPools();
    }
  }, [params.id]);

  const handleJoinPool = () => {
    if (!pool) return;
    setIsCheckoutOpen(true);
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: pool?.product_name,
          text: `Check out this pool on FarmShare: ${pool?.product_name}`,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link copied!",
          description: "Pool link copied to clipboard",
        });
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? "Removed from saved" : "Pool saved!",
      description: isSaved
        ? "Pool removed from your wishlist"
        : "You'll be notified of updates",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <div className="container px-4 md:px-8 py-8 max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
              <p className="text-muted-foreground">Loading pool details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !pool) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <div className="container px-4 md:px-8 py-8 max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-10 w-10 text-destructive" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">Pool Not Found</h1>
              <p className="text-muted-foreground max-w-md">
                {error || "This pool may have been closed or doesn't exist."}
              </p>
            </div>
            <Button onClick={() => router.push("/marketplace")} size="lg">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Browse Marketplace
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const fillPercentage = (pool.slots_filled / pool.slots_count) * 100;
  const slotsRemaining = pool.slots_count - pool.slots_filled;
  const daysLeft = Math.ceil(
    (new Date(pool.delivery_deadline).getTime() - Date.now()) /
      (1000 * 60 * 60 * 24)
  );
  const isHot = fillPercentage > 70;
  const isUrgent = daysLeft <= 3;
  const isFull = slotsRemaining <= 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container px-4 md:px-8 py-6 max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link
            href="/buyer/marketplace"
            className="hover:text-primary transition-colors"
          >
            Marketplace
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link
            href={`/buyer/marketplace?category=${pool.category}`}
            className="hover:text-primary transition-colors capitalize"
          >
            {pool.category || "Products"}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium truncate max-w-[200px]">
            {pool.product_name}
          </span>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left Column - Image Gallery */}
          <div className="lg:col-span-3 space-y-4">
            {/* Main Image */}
            <div className="relative rounded-2xl overflow-hidden bg-muted aspect-[4/3]">
              <Image
                src={pool.product_image || "/placeholder.svg"}
                alt={pool.product_name}
                fill
                className="object-cover"
                priority
              />

              {/* Overlay Badges */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {pool.vendor_verified && (
                  <Badge className="bg-blue-500 text-white shadow-lg">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
                {isHot && (
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg">
                    <Flame className="w-3 h-3 mr-1" />
                    Hot Deal
                  </Badge>
                )}
                {isUrgent && !isFull && (
                  <Badge className="bg-amber-500 text-white shadow-lg animate-pulse">
                    <Zap className="w-3 h-3 mr-1" />
                    Ending Soon
                  </Badge>
                )}
              </div>

              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full bg-white/90 hover:bg-white shadow-lg"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className={`rounded-full shadow-lg ${
                    isSaved
                      ? "bg-red-50 text-red-500"
                      : "bg-white/90 hover:bg-white"
                  }`}
                  onClick={handleSave}
                >
                  <Heart
                    className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`}
                  />
                </Button>
              </div>

              {/* Slots Badge */}
              <div className="absolute bottom-4 left-4">
                <Badge
                  className={`text-sm px-3 py-1.5 shadow-lg ${
                    isFull
                      ? "bg-gray-500 text-white"
                      : slotsRemaining <= 3
                      ? "bg-red-500 text-white"
                      : "bg-white/95 text-gray-800"
                  }`}
                >
                  {isFull ? "Pool Full" : `${slotsRemaining} slots left`}
                </Badge>
              </div>
            </div>

            {/* Product Details Card */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 space-y-6">
                {/* Header */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="capitalize">
                      {pool.category || "Product"}
                    </Badge>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                    {pool.product_name}
                  </h1>

                  {/* Vendor Info */}
                  <Link
                    href={`/vendor/profile/${pool.vendor_id}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
                  >
                    <Avatar className="h-12 w-12 border-2 border-primary/20">
                      <AvatarImage src={pool.vendor_image} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {pool.vendor_name?.charAt(0) || "V"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold group-hover:text-primary transition-colors">
                          {pool.vendor_name}
                        </span>
                        {pool.vendor_verified && (
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {pool.vendor_city || pool.vendor_state || "Nigeria"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          4.9
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </Link>
                </div>

                <Separator />

                {/* Description */}
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    Product Description
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {pool.product_description ||
                      "Fresh quality produce direct from verified farmers. Join this pool to get wholesale pricing on premium agricultural products."}
                  </p>
                </div>

                <Separator />

                {/* Key Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 rounded-xl bg-primary/5">
                    <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">{pool.slots_filled}</p>
                    <p className="text-xs text-muted-foreground">
                      Buyers Joined
                    </p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-accent/10">
                    <Package className="h-6 w-6 mx-auto mb-2 text-accent" />
                    <p className="text-2xl font-bold">{pool.slots_count}</p>
                    <p className="text-xs text-muted-foreground">Total Slots</p>
                  </div>
                  <div
                    className={`text-center p-4 rounded-xl ${
                      isUrgent ? "bg-red-50" : "bg-muted/50"
                    }`}
                  >
                    <Clock
                      className={`h-6 w-6 mx-auto mb-2 ${
                        isUrgent ? "text-red-500" : "text-muted-foreground"
                      }`}
                    />
                    <p
                      className={`text-2xl font-bold ${
                        isUrgent ? "text-red-500" : ""
                      }`}
                    >
                      {daysLeft}d
                    </p>
                    <p className="text-xs text-muted-foreground">Time Left</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-green-50">
                    <Truck className="h-6 w-6 mx-auto mb-2 text-green-600" />
                    <p className="text-lg font-bold text-green-600">
                      {pool.allow_home_delivery ? "Yes" : "Pickup"}
                    </p>
                    <p className="text-xs text-muted-foreground">Delivery</p>
                  </div>
                </div>

                <Separator />

                {/* Pool Progress */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Pool Progress
                    </h3>
                    <span className="text-sm font-medium text-primary">
                      {Math.round(fillPercentage)}% Complete
                    </span>
                  </div>
                  <div className="relative h-4 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ${
                        fillPercentage > 80
                          ? "bg-gradient-to-r from-orange-400 to-red-500"
                          : fillPercentage > 50
                          ? "bg-gradient-to-r from-green-400 to-emerald-500"
                          : "bg-gradient-to-r from-blue-400 to-primary"
                      }`}
                      style={{ width: `${fillPercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>
                      {pool.slots_filled} of {pool.slots_count} slots filled
                    </span>
                    <span>{slotsRemaining} remaining</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trust Badges */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Why Buy on FarmShare?
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-green-50">
                  <CheckCircle className="h-6 w-6 text-green-600 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-green-800">
                      Verified Vendors
                    </h4>
                    <p className="text-sm text-green-700/80">
                      All vendors are KYC verified
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50">
                  <Shield className="h-6 w-6 text-blue-600 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-blue-800">
                      Secure Payments
                    </h4>
                    <p className="text-sm text-blue-700/80">
                      Escrow-protected transactions
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-purple-50">
                  <MessageCircle className="h-6 w-6 text-purple-600 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-purple-800">
                      24/7 Support
                    </h4>
                    <p className="text-sm text-purple-700/80">
                      Always here to help
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sticky Checkout */}
          <div className="lg:col-span-2">
            <div className="sticky top-6 space-y-6">
              {/* Pricing Card */}
              <Card className="border-0 shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-6">
                  <p className="text-sm opacity-90 mb-1">Price per slot</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">
                      ₦{pool.price_per_slot?.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm opacity-75 mt-2">
                    Pool value: ₦
                    {(pool.price_per_slot * pool.slots_count).toLocaleString()}
                  </p>
                </div>

                <CardContent className="p-6 space-y-6">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock
                        className={`h-4 w-4 ${
                          isUrgent ? "text-red-500" : "text-muted-foreground"
                        }`}
                      />
                      <span
                        className={isUrgent ? "text-red-500 font-medium" : ""}
                      >
                        {daysLeft} days left
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{pool.slots_filled} joined</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {pool.allow_home_delivery
                          ? `+₦${(
                              pool.home_delivery_cost || 0
                            ).toLocaleString()}`
                          : "Pickup only"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{pool.vendor_state || "Nigeria"}</span>
                    </div>
                  </div>

                  <Separator />

                  {/* CTA Button */}
                  <Button
                    onClick={handleJoinPool}
                    size="lg"
                    className={`w-full h-14 text-lg font-semibold rounded-xl shadow-lg transition-all ${
                      isFull ||
                      pool.status === "closed" ||
                      pool.status === "cancelled"
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-accent hover:bg-accent/90 hover:shadow-xl hover:scale-[1.02]"
                    }`}
                    disabled={
                      isFull ||
                      pool.status === "closed" ||
                      pool.status === "cancelled"
                    }
                  >
                    {isFull ? (
                      "Pool Full"
                    ) : pool.status === "closed" ||
                      pool.status === "cancelled" ? (
                      "Pool Closed"
                    ) : (
                      <>
                        Join Pool Now
                        <ArrowLeft className="ml-2 h-5 w-5 rotate-180" />
                      </>
                    )}
                  </Button>

                  {!isFull && (
                    <p className="text-center text-xs text-muted-foreground">
                      🔒 Secure checkout with Paystack
                    </p>
                  )}

                  {/* Urgency Message */}
                  {!isFull && slotsRemaining <= 5 && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                      <p className="text-sm text-red-700 font-medium">
                        ⚡ Only {slotsRemaining} slot
                        {slotsRemaining > 1 ? "s" : ""} remaining!
                      </p>
                      <p className="text-xs text-red-600 mt-1">
                        This pool is filling up fast
                      </p>
                    </div>
                  )}

                  {/* Money Back Guarantee */}
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                    <Shield className="h-8 w-8 text-green-600 shrink-0" />
                    <div>
                      <p className="font-semibold text-green-800 text-sm">
                        Money-Back Guarantee
                      </p>
                      <p className="text-xs text-green-700">
                        Full refund if not satisfied
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Vendor */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-4">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/vendor/profile/${pool.vendor_id}`}>
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Contact Vendor
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Popular Pools Section */}
        {popularPools.length > 0 && (
          <div className="mt-16 space-y-8">
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-orange-100">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">You May Also Like</h2>
                  <p className="text-muted-foreground">
                    Popular pools selling fast
                  </p>
                </div>
              </div>
              <Button variant="ghost" asChild>
                <Link href="/buyer/marketplace">
                  View All
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularPools.map((popularPool) => (
                <MarketplacePoolCard key={popularPool.id} pool={popularPool} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      <EnhancedCheckoutModal
        open={isCheckoutOpen}
        onOpenChange={setIsCheckoutOpen}
        pool={{
          ...pool,
          vendor_state: pool.vendor?.state || pool.vendor_state,
        }}
      />
    </div>
  );
}
