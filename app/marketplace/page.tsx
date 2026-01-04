"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  MapPin,
  Clock,
  Users,
  DollarSign,
  Star,
  ArrowRight,
  Leaf,
  Package,
  Loader2,
  TrendingUp,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { httpRequest } from "@/lib/httpRequest";
import { MarketplacePoolCard } from "@/components/buyer/marketplace-pool-card";

const categories = [
  { value: "all", label: "All Categories" },
  { value: "vegetables", label: "Vegetables" },
  { value: "fruits", label: "Fruits" },
  { value: "grains", label: "Grains" },
  { value: "tubers", label: "Tubers" },
  { value: "livestock", label: "Livestock" },
  { value: "dairy", label: "Dairy Products" },
  { value: "poultry", label: "Poultry" },
  { value: "fish", label: "Fish & Seafood" },
  { value: "legumes", label: "Legumes" },
];

const locations = [
  { value: "all", label: "All Locations" },
  { value: "northwest", label: "North West" },
  { value: "northeast", label: "North East" },
  { value: "northcentral", label: "North Central" },
  { value: "southwest", label: "South West" },
  { value: "southsouth", label: "South South" },
];

// Nigerian states for filtering
const NIGERIAN_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

// Price ranges for filtering
const priceRanges = [
  { value: "all", label: "All Prices" },
  { value: "0-5000", label: "Under ₦5,000" },
  { value: "5000-20000", label: "₦5,000 - ₦20,000" },
  { value: "20000-50000", label: "₦20,000 - ₦50,000" },
  { value: "50000+", label: "Above ₦50,000" },
];

export default function MarketplacePage() {
  const [pools, setPools] = useState<any[]>([]);
  const [filteredPools, setFilteredPools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showSameStateOnly, setShowSameStateOnly] = useState(true);
  const [userState, setUserState] = useState<string | null>(null);
  const [topVendors, setTopVendors] = useState<any[]>([]);

  const fetchPools = useCallback(async () => {
    try {
      setLoading(true);
      const data = await httpRequest.get<any[]>("/pools");
      setPools(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch pools:", error);
      setPools([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTopVendors = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (showSameStateOnly && userState) {
        params.append("state", userState);
      }
      params.append("limit", "6");
      const data = await httpRequest.get<any[]>(
        `/user/vendors/top?${params.toString()}`
      );
      setTopVendors(Array.isArray(data) ? data : []);
    } catch (error) {
      console.warn("Failed to fetch top vendors:", error);
      setTopVendors([]);
    }
  }, [showSameStateOnly, userState]);

  const applyFilters = useCallback(() => {
    let result = [...pools];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (pool: any) =>
          pool.product?.name?.toLowerCase().includes(term) ||
          pool.vendor?.name?.toLowerCase().includes(term) ||
          pool.product?.category?.toLowerCase().includes(term)
      );
    }

    // Category filter
    if (categoryFilter && categoryFilter !== "all") {
      result = result.filter(
        (pool: any) =>
          pool.product?.category?.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    // State filter (location-based)
    if (showSameStateOnly && userState) {
      result = result.filter((pool: any) => pool.vendor?.state === userState);
    } else if (stateFilter && stateFilter !== "all") {
      result = result.filter((pool: any) => pool.vendor?.state === stateFilter);
    }

    // Price filter
    if (priceFilter && priceFilter !== "all") {
      result = result.filter((pool: any) => {
        const price = Number(pool.pricePerSlot);
        switch (priceFilter) {
          case "0-5000":
            return price < 5000;
          case "5000-20000":
            return price >= 5000 && price < 20000;
          case "20000-50000":
            return price >= 20000 && price < 50000;
          case "50000+":
            return price >= 50000;
          default:
            return true;
        }
      });
    }

    // Sorting
    switch (sortBy) {
      case "ending-soon":
        result.sort(
          (a: any, b: any) =>
            new Date(a.deliveryDeadlineUtc || 0).getTime() -
            new Date(b.deliveryDeadlineUtc || 0).getTime()
        );
        break;
      case "price-low":
        result.sort(
          (a: any, b: any) => Number(a.pricePerSlot) - Number(b.pricePerSlot)
        );
        break;
      case "price-high":
        result.sort(
          (a: any, b: any) => Number(b.pricePerSlot) - Number(a.pricePerSlot)
        );
        break;
      case "popular":
        result.sort(
          (a: any, b: any) =>
            (b.subscriptions?.length || 0) - (a.subscriptions?.length || 0)
        );
        break;
      case "newest":
      default:
        result.sort(
          (a: any, b: any) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
        );
    }

    setFilteredPools(result);
  }, [
    pools,
    searchTerm,
    categoryFilter,
    stateFilter,
    priceFilter,
    sortBy,
    showSameStateOnly,
    userState,
  ]);

  const handleToggleLocationFilter = useCallback(() => {
    setShowSameStateOnly(!showSameStateOnly);
    if (!showSameStateOnly && userState) {
      setStateFilter(userState);
    } else {
      setStateFilter("all");
    }
  }, [showSameStateOnly, userState]);

  // Get user's state from store/localStorage
  useEffect(() => {
    try {
      const persistedState = localStorage.getItem("farmshare-storage");
      if (persistedState) {
        const parsedState = JSON.parse(persistedState);
        const user = parsedState.state?.user;
        if (user?.state) {
          setUserState(user.state);
          if (showSameStateOnly) {
            setStateFilter(user.state);
          }
        }
      }
    } catch (error) {
      console.warn("Could not get user state:", error);
    }
  }, [showSameStateOnly]);

  useEffect(() => {
    fetchPools();
    fetchTopVendors();
  }, [fetchPools, fetchTopVendors]);

  // Refetch top vendors when user state changes
  useEffect(() => {
    fetchTopVendors();
  }, [fetchTopVendors]);

  // Apply filters whenever pools or filter values change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary via-primary to-primary-dark overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        </div>

        <div className="container px-[30px] lg:px-[60px] py-16 relative z-10">
          <div className="text-center space-y-6 text-primary-foreground max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm">
              <Sparkles className="h-4 w-4 text-accent" />
              <span>New pools added daily</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in">
              FarmShare <span className="text-accent">Marketplace</span>
            </h1>

            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed animate-fade-in-up">
              Discover amazing deals on quality agricultural products. Join
              pools to access wholesale prices and connect directly with
              verified farmers across Nigeria.
            </p>

            <div className="flex flex-wrap justify-center gap-6 pt-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm">
                <Users className="h-5 w-5 text-accent" />
                <span className="font-medium">2,500+ Active Buyers</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm">
                <Leaf className="h-5 w-5 text-accent" />
                <span className="font-medium">Fresh Guaranteed</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm">
                <TrendingUp className="h-5 w-5 text-accent" />
                <span className="font-medium">Up to 60% Savings</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-[30px] lg:px-[60px] py-12">
        <div className="space-y-10">
          {/* Search and Filters */}
          <Card className="card-premium border-0 shadow-xl -mt-20 relative z-20">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                Find Your Perfect Pool
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search for products, vendors, or categories..."
                  className="pl-12 h-14 text-base bg-muted/50 border-border/50 focus:bg-background transition-colors rounded-xl"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Location Toggle */}
              {userState && (
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl border border-border/50">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="text-sm">
                    Show vendors in my state ({userState})
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer ml-auto">
                    <input
                      type="checkbox"
                      checked={showSameStateOnly}
                      onChange={handleToggleLocationFilter}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              )}

              <div className="flex flex-col md:flex-row gap-4">
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="flex-1 h-12 bg-muted/50 border-border/50 rounded-xl">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={stateFilter}
                  onValueChange={(value) => {
                    setStateFilter(value);
                    if (value !== "all") {
                      setShowSameStateOnly(false);
                    }
                  }}
                  disabled={showSameStateOnly && !!userState}
                >
                  <SelectTrigger className="flex-1 h-12 bg-muted/50 border-border/50 rounded-xl">
                    <SelectValue placeholder="State" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    <SelectItem value="all">All States</SelectItem>
                    {NIGERIAN_STATES.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={priceFilter} onValueChange={setPriceFilter}>
                  <SelectTrigger className="flex-1 h-12 bg-muted/50 border-border/50 rounded-xl">
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    {priceRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="flex-1 h-12 bg-muted/50 border-border/50 rounded-xl">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ending-soon">Ending Soon</SelectItem>
                    <SelectItem value="price-low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-high">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setCategoryFilter("all");
                    setStateFilter("all");
                    setPriceFilter("all");
                    setSortBy("newest");
                    setShowSameStateOnly(!!userState);
                  }}
                  className="flex items-center gap-2 h-12 rounded-xl border-border/50 hover:bg-muted/50"
                >
                  <Filter className="h-4 w-4" />
                  More Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Category Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card
              onClick={() => setCategoryFilter("produce")}
              className={`group cursor-pointer hover-lift border-border/50 hover:border-primary/50 transition-all duration-300 ${
                categoryFilter === "produce"
                  ? "ring-2 ring-primary border-primary"
                  : ""
              }`}
            >
              <CardContent className="pt-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-green-100 to-green-50 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Leaf className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="font-semibold mb-1">Fresh Produce</h3>
                <p className="text-xs text-muted-foreground">
                  {
                    pools.filter(
                      (p: any) =>
                        p.product?.category?.toLowerCase() === "produce"
                    ).length
                  }{" "}
                  active pools
                </p>
              </CardContent>
            </Card>

            <Card
              onClick={() => setCategoryFilter("grains")}
              className={`group cursor-pointer hover-lift border-border/50 hover:border-yellow-500/50 transition-all duration-300 ${
                categoryFilter === "grains"
                  ? "ring-2 ring-yellow-500 border-yellow-500"
                  : ""
              }`}
            >
              <CardContent className="pt-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-100 to-yellow-50 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Package className="h-7 w-7 text-yellow-600" />
                </div>
                <h3 className="font-semibold mb-1">Grains</h3>
                <p className="text-xs text-muted-foreground">
                  {
                    pools.filter(
                      (p: any) =>
                        p.product?.category?.toLowerCase() === "grains"
                    ).length
                  }{" "}
                  active pools
                </p>
              </CardContent>
            </Card>

            <Card
              onClick={() => setCategoryFilter("vegetables")}
              className={`group cursor-pointer hover-lift border-border/50 hover:border-red-500/50 transition-all duration-300 ${
                categoryFilter === "vegetables"
                  ? "ring-2 ring-red-500 border-red-500"
                  : ""
              }`}
            >
              <CardContent className="pt-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-100 to-red-50 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <ShoppingBag className="h-7 w-7 text-red-600" />
                </div>
                <h3 className="font-semibold mb-1">Vegetables</h3>
                <p className="text-xs text-muted-foreground">
                  {
                    pools.filter(
                      (p: any) =>
                        p.product?.category?.toLowerCase() === "vegetables"
                    ).length
                  }{" "}
                  active pools
                </p>
              </CardContent>
            </Card>

            <Card
              onClick={() => setCategoryFilter("fruits")}
              className={`group cursor-pointer hover-lift border-border/50 hover:border-purple-500/50 transition-all duration-300 ${
                categoryFilter === "fruits"
                  ? "ring-2 ring-purple-500 border-purple-500"
                  : ""
              }`}
            >
              <CardContent className="pt-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-purple-50 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Package className="h-7 w-7 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-1">Fruits</h3>
                <p className="text-xs text-muted-foreground">
                  {
                    pools.filter(
                      (p: any) =>
                        p.product?.category?.toLowerCase() === "fruits"
                    ).length
                  }{" "}
                  active pools
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Top Verified Vendors */}
          {topVendors.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <h2 className="text-xl font-bold">Top Verified Vendors</h2>
                  {showSameStateOnly && userState && (
                    <Badge variant="secondary" className="ml-2">
                      in {userState}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {topVendors.map((vendor) => (
                  <Card
                    key={vendor.id}
                    className="hover-lift border-border/50 hover:border-primary/50 transition-all duration-300"
                  >
                    <CardContent className="pt-6 text-center">
                      <div className="relative mx-auto mb-3">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 mx-auto flex items-center justify-center overflow-hidden">
                          {vendor.avatarUrl ? (
                            <img
                              src={vendor.avatarUrl}
                              alt={vendor.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-xl font-bold text-primary">
                              {vendor.name?.charAt(0)?.toUpperCase() || "V"}
                            </span>
                          )}
                        </div>
                        {vendor.isVerified && (
                          <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full p-1">
                            <Sparkles className="h-3 w-3" />
                          </div>
                        )}
                      </div>
                      <h3 className="font-semibold text-sm truncate">
                        {vendor.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {vendor.state}
                      </p>
                      <div className="flex items-center justify-center gap-2 mt-2 text-xs text-muted-foreground">
                        <span>{vendor.poolCount} pools</span>
                        <span>•</span>
                        <span>{vendor.totalSubscribers} buyers</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Pools Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Available Pools</h2>
                <p className="text-muted-foreground">
                  {showSameStateOnly && userState
                    ? `Showing vendors in ${userState}`
                    : "Browse and join pools to save more"}
                </p>
              </div>
              <Badge variant="secondary" className="text-sm px-4 py-2">
                {filteredPools.length} of {pools.length} pools
              </Badge>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-muted animate-pulse" />
                  <Loader2 className="absolute inset-0 m-auto h-8 w-8 animate-spin text-primary" />
                </div>
                <p className="mt-4 text-muted-foreground">Loading pools...</p>
              </div>
            ) : filteredPools.length === 0 ? (
              <Card className="py-16 text-center">
                <CardContent>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mx-auto mb-4">
                    <Package className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {pools.length === 0
                      ? "No pools available"
                      : "No matching pools"}
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    {pools.length === 0
                      ? "There are no active pools at the moment. Check back later."
                      : "Try adjusting your filters or search terms to see more results."}
                  </p>
                  {pools.length > 0 && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("");
                        setCategoryFilter("all");
                        setStateFilter("all");
                        setPriceFilter("all");
                        setSortBy("newest");
                        setShowSameStateOnly(false);
                      }}
                      className="mt-4"
                    >
                      Clear All Filters
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPools.map((pool, index) => (
                  <div
                    key={pool.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <MarketplacePoolCard pool={pool} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* How to Browse */}
          <Card className="overflow-hidden border-0 shadow-xl">
            <div className="bg-gradient-to-r from-primary via-primary to-primary-dark p-8 lg:p-12">
              <div className="text-center space-y-6">
                <h3 className="text-2xl lg:text-3xl font-bold text-primary-foreground">
                  How to Navigate the Marketplace
                </h3>
                <div className="grid md:grid-cols-4 gap-6 text-left mt-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover-lift">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white text-lg font-bold mb-4">
                      1
                    </div>
                    <h4 className="font-semibold text-primary-foreground mb-2">
                      Browse Categories
                    </h4>
                    <p className="text-sm text-primary-foreground/70">
                      Use category cards or filters to find products you're
                      interested in
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover-lift">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white text-lg font-bold mb-4">
                      2
                    </div>
                    <h4 className="font-semibold text-primary-foreground mb-2">
                      Review Details
                    </h4>
                    <p className="text-sm text-primary-foreground/70">
                      Check vendor ratings, product descriptions, and delivery
                      timelines
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover-lift">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white text-lg font-bold mb-4">
                      3
                    </div>
                    <h4 className="font-semibold text-primary-foreground mb-2">
                      Join Pool
                    </h4>
                    <p className="text-sm text-primary-foreground/70">
                      Select your desired quantity and complete secure payment
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover-lift">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white text-lg font-bold mb-4">
                      4
                    </div>
                    <h4 className="font-semibold text-primary-foreground mb-2">
                      Track Progress
                    </h4>
                    <p className="text-sm text-primary-foreground/70">
                      Monitor pool filling and receive delivery updates
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
