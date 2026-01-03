"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Quote,
  Users,
  Leaf,
  TrendingUp,
  Shield,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Search } from "lucide-react";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useMemo } from "react";
import { httpRequest } from "@/lib/httpRequest";

interface Testimonial {
  id: number;
  quote: string;
  name: string;
  title: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote:
      "As a full-time banker, Farmshare makes healthy eating easy. I get premium beef and fresh produce without middlemen, saving me time and money. It's a game-changer for my busy schedule.",
    name: "Amara Okeke",
    title: "Financial Analyst",
    image: "/assets/testimonials/testimonial-vi.png",
  },
  {
    id: 2,
    quote:
      "Farmshare has cut my costs and boosted my profits. I get the freshest meat in bulk, straight from the farm, no middlemen. My customers love it!",
    name: "Mama Bisi",
    title: "Caterer and Bulk Food Supplier",
    image: "/assets/testimonials/testimonial-viii.png",
  },
  {
    id: 3,
    quote:
      "Farmshare is the future of food sourcing – fresh, direct, and community-driven. It's a smart way to save and support local farmers.",
    name: "Chukwu Emmanuel",
    title: "Founder, Micropay",
    image: "/assets/testimonials/testimonial-1.png",
  },
  {
    id: 4,
    quote:
      "Since I started using Farmshare for all my major groceries, I have saved so much time and money. The quality of products have been the best I have ever used. I am so glad I found Farmshare.",
    name: "Mrs. Omawunmi Ajoke",
    title: "Stay home mom",
    image: "/assets/testimonials/testimonial-v.png",
  },
];

const stats = [
  { label: "Active Users", value: "10K+", icon: Users },
  { label: "Pools Completed", value: "500+", icon: TrendingUp },
  { label: "Trusted Vendors", value: "150+", icon: Shield },
];

interface Pool {
  id: string;
  product_name: string;
  product_image: string;
  price_per_slot: number;
  slots_count: number;
  slots_filled: number;
  vendor_name: string;
  allow_home_delivery: boolean;
  delivery_deadline: string;
}

export default function HomePage() {
  const { isAuthenticated } = useStore();
  const router = useRouter();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch real pools from API - optimized with useCallback
  useEffect(() => {
    let isMounted = true;

    const fetchPools = async () => {
      try {
        const response = await httpRequest.get<Pool[]>("/pools");
        if (isMounted) {
          setPools((response || []).slice(0, 4));
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch pools:", error);
        if (isMounted) {
          setPools([]);
          setLoading(false);
        }
      }
    };

    fetchPools();
    return () => {
      isMounted = false;
    };
  }, []);

  // Testimonial auto-rotation with longer interval
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 8000); // Increased from 5000 to reduce re-renders
    return () => clearInterval(timer);
  }, []);

  // Memoized handlers to prevent unnecessary re-renders
  const handleJoinPool = useCallback(
    (poolId: string) => {
      if (!isAuthenticated) {
        router.push(`/login?redirect=/buyer/pool/${poolId}`);
      } else {
        router.push(`/buyer/pool/${poolId}`);
      }
    },
    [isAuthenticated, router]
  );

  // Memoized filtered pools for search
  const filteredPools = useMemo(() => {
    if (!searchQuery.trim()) return pools;
    return pools.filter((pool) =>
      pool.product_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [pools, searchQuery]);

  return (
    <div className="flex flex-col w-full max-w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary-dark text-primary-foreground py-20 md:py-28 lg:py-32 w-full">
        {/* Simplified decorative background - removed heavy blur effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-accent/10" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-white/5" />
        </div>

        <div className="px-[30px] lg:px-[60px] max-w-[1400px] mx-auto w-full relative z-10">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <Sparkles className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium">
                  Nigeria's #1 Agricultural Marketplace
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1]">
                Farm Fresh{" "}
                <span className="relative">
                  <span className="text-accent">Products</span>
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 200 12"
                    fill="none"
                  >
                    <path
                      d="M2 10C50 4 150 4 198 10"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="text-accent/40"
                    />
                  </svg>
                </span>
                <br />
                Always Cheap
              </h1>

              <p className="text-lg md:text-xl text-primary-foreground/85 leading-relaxed max-w-xl">
                Connect directly with verified farmers, join buying pools, and
                access wholesale prices on premium agricultural products. Save
                money together by buying together.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  asChild
                  className="bg-accent hover:bg-accent/90 text-white rounded-full px-8 py-6 text-lg font-semibold shadow-lg shadow-accent/25 group"
                >
                  <Link href="#product" className="flex items-center gap-2">
                    Join a Pool
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 rounded-full px-8 py-6 text-lg font-semibold"
                >
                  <Link href="/how-it-works">Learn How It Works</Link>
                </Button>
              </div>

              {/* Stats row */}
              <div className="flex flex-wrap gap-8 pt-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                      <stat.icon className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-sm text-primary-foreground/70">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <div className="relative rounded-3xl overflow-hidden border-2 border-white/20">
                  <Image
                    src="/placeholder.jpg"
                    alt="Happy African women using FarmShare on mobile"
                    width={600}
                    height={500}
                    className="w-full h-auto object-cover"
                    priority
                  />
                </div>
              </div>

              {/* Floating cards - simplified */}
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-card rounded-xl shadow-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-success/20 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      Pool Filled!
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Premium Rice - 10 slots
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 bg-white dark:bg-card rounded-xl shadow-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <Leaf className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      Fresh Produce
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Direct from farmers
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-6 bg-muted/50 border-y border-border/50 w-full">
        <div className="px-[30px] lg:px-[60px] max-w-[1400px] mx-auto w-full">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 text-muted-foreground">
            <span className="text-sm font-medium">
              Trusted by farmers and buyers across Nigeria
            </span>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-5 h-5 text-yellow-400 fill-current"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-2 text-sm font-medium">4.9/5 rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Card + 100k+ Section - Restored */}
      <section className="py-20 md:py-28 bg-background w-full">
        <div className="px-[30px] lg:px-[60px] max-w-[1400px] mx-auto w-full">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Quote Card */}
            <Card className="border-2 shadow-xl hover-lift card-premium">
              <CardContent className="p-8 md:p-10 space-y-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-14 w-14 ring-2 ring-accent/20 ring-offset-2">
                    <AvatarImage
                      src="/placeholder.svg?height=56&width=56"
                      alt="Uche Nnamani"
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      UN
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">Uche Nnamani</h3>
                    <p className="text-sm text-muted-foreground">
                      CEO, Farmstore.ng
                    </p>
                  </div>
                  <Quote className="h-12 w-12 text-accent/20" />
                </div>
                <blockquote className="text-lg text-muted-foreground leading-relaxed italic border-l-4 border-accent/30 pl-4">
                  "We believe that fresh, responsibly sourced food should be
                  accessible to everyone, regardless of location or schedules."
                </blockquote>
              </CardContent>
            </Card>

            {/* 100k+ Stats */}
            <div className="space-y-6">
              <Badge variant="secondary" className="mb-4">
                <Users className="h-3 w-3 mr-1" />
                Community Powered
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-balance leading-tight">
                More than <span className="text-accent">100k+</span> people are
                using our platform.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Join thousands of farmers and buyers who have transformed the
                way they trade agricultural products. Experience fair pricing,
                quality assurance, and community support.
              </p>
              <Button
                variant="link"
                className="text-primary p-0 h-auto font-semibold text-lg group"
                asChild
              >
                <Link href="/about" className="flex items-center gap-2">
                  Learn more about us
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Available Pools Section - Enhanced */}
      <section
        id="product"
        className="py-20 md:py-28 bg-gradient-to-b from-background to-muted/30 w-full"
      >
        <div className="px-[30px] lg:px-[60px] max-w-[1400px] mx-auto w-full">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-balance">
              Available Pools
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Join a pool and enjoy bulk pricing on premium agricultural
              products. Connect directly with verified vendors and save money
              together.
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto pt-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for products (e.g., Yam, Fish, Cow...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-6 text-lg rounded-full border-2 border-border/50 focus:border-primary shadow-sm"
                />
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {loading ? (
              // Enhanced loading skeleton with shimmer
              Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="pt-10 pb-20 px-8 bg-white dark:bg-card rounded-3xl shadow-lg relative"
                >
                  <div className="h-32 w-32 shimmer rounded-lg mb-6" />
                  <div className="h-8 shimmer rounded-md w-1/2 mb-6" />
                  <div className="h-12 shimmer rounded-full w-full mb-6" />
                  <div className="h-10 shimmer rounded-md w-3/4 mb-3" />
                  <div className="h-5 shimmer rounded-md w-1/2" />
                </div>
              ))
            ) : pools.length > 0 ? (
              pools.map((pool, index) => (
                <div
                  key={pool.id}
                  className="pt-8 pb-24 px-8 bg-white dark:bg-card rounded-3xl shadow-lg hover:shadow-2xl relative cursor-pointer hover:bg-primary group transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Decorative star image */}
                  <Image
                    src={`/assets/pricing/star${
                      (index % 3) + 1 === 1
                        ? "one"
                        : (index % 3) + 1 === 2
                        ? "two"
                        : "three"
                    }.svg`}
                    alt="decorative"
                    width={120}
                    height={120}
                    className="absolute bottom-0 right-0 opacity-50 group-hover:opacity-70 transition-opacity"
                  />

                  {/* Product Image */}
                  <div className="relative h-28 w-28 mb-4 rounded-2xl overflow-hidden bg-muted">
                    <Image
                      src={pool.product_image || "/placeholder.svg"}
                      alt={pool.product_name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <Badge className="absolute -top-1 -right-1 bg-accent text-white text-xs shadow-lg">
                      {pool.slots_filled}/{pool.slots_count}
                    </Badge>
                  </div>

                  {/* Product Name */}
                  <h4 className="text-3xl sm:text-4xl font-semibold mb-6 text-foreground group-hover:text-white transition-colors">
                    {pool.product_name}
                  </h4>

                  {/* Join Button */}
                  <Button
                    onClick={() => handleJoinPool(pool.id)}
                    className="text-lg font-medium text-white w-full bg-primary hover:bg-primary/90 group-hover:bg-accent group-hover:border-accent border-2 border-primary rounded-full py-5 px-8 mb-6 transition-all duration-300"
                    disabled={pool.slots_filled >= pool.slots_count}
                  >
                    {pool.slots_filled >= pool.slots_count
                      ? "Pool Full"
                      : "Join this pool"}
                  </Button>

                  {/* Pricing */}
                  <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-2 group-hover:text-white transition-colors">
                    ₦{(pool.price_per_slot / 1000).toFixed(0)}k/
                    <span className="text-muted-foreground group-hover:text-white/60">
                      slot
                    </span>
                  </h2>
                  <p className="text-base font-normal text-muted-foreground group-hover:text-white/80 transition-colors mb-4">
                    {pool.vendor_name}
                  </p>

                  {/* Features */}
                  <div className="space-y-3 pt-4">
                    <div className="flex gap-3 items-center">
                      <Image
                        src="/assets/pricing/tick.svg"
                        alt="check"
                        width={24}
                        height={24}
                      />
                      <p className="text-sm font-medium text-muted-foreground group-hover:text-white/80 transition-colors">
                        {pool.allow_home_delivery
                          ? "Home delivery available"
                          : "Pickup only"}
                      </p>
                    </div>
                    <div className="flex gap-3 items-center">
                      <Image
                        src="/assets/pricing/tick.svg"
                        alt="check"
                        width={24}
                        height={24}
                      />
                      <p className="text-sm font-medium text-muted-foreground group-hover:text-white/80 transition-colors">
                        Closes{" "}
                        {new Date(pool.delivery_deadline).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-3 items-center">
                      <Image
                        src="/assets/pricing/tick.svg"
                        alt="check"
                        width={24}
                        height={24}
                      />
                      <p className="text-sm font-medium text-muted-foreground group-hover:text-white/80 transition-colors">
                        {pool.slots_count - pool.slots_filled} slots remaining
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <Leaf className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  No pools available
                </h3>
                <p className="text-muted-foreground">
                  Check back later for fresh opportunities.
                </p>
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              asChild
              className="rounded-full px-8 hover-lift"
            >
              <Link
                href="/buyer/marketplace"
                className="flex items-center gap-2"
              >
                View All Pools
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Pool Collaboration Section - With overflow image */}
      <section
        id="pools"
        className="pt-20 md:pt-28 pb-0 bg-[#fce8e6] w-full relative overflow-visible"
      >
        <div className="px-[30px] lg:px-[60px] max-w-[1400px] mx-auto w-full relative z-10">
          <div className="text-center mb-16 space-y-6">
            <Badge
              variant="outline"
              className="border-accent/30 text-accent mb-4"
            >
              <Users className="h-3 w-3 mr-1" />
              Community Buying
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-balance leading-tight">
              Join a pool of six to share
              <br className="hidden md:block" /> a full cow now.
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Whether it's choosing reusable food and liquid containers or
              picking the vegetarian option for the office lunch, Greenlist
              gives your workforce the power of changing their habits and making
              choices that have less harmful effects on the environment.
            </p>
          </div>

          {/* Image that extends beyond container */}
          <div className="max-w-4xl mx-auto relative">
            <div className="relative rounded-3xl overflow-visible shadow-2xl">
              <Image
                src="/assets/business/business.png"
                alt="Community pool members chatting about delivery and food orders"
                width={900}
                height={600}
                className="w-full h-auto rounded-3xl transform translate-y-16"
              />
            </div>
          </div>
        </div>

        {/* Spacer for the overflow */}
        <div className="h-32 md:h-40"></div>
      </section>

      {/* Features Section - Enhanced with better visual hierarchy */}
      <section id="features" className="py-20 md:py-28 bg-background w-full">
        <div className="px-[30px] lg:px-[60px] max-w-[1400px] mx-auto space-y-20 md:space-y-28 w-full">
          {/* Section header */}
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              <Leaf className="h-3 w-3 mr-1" />
              Why FarmShare
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Built for Modern Agriculture
            </h2>
            <p className="text-lg text-muted-foreground">
              Experience the future of agricultural trade with features designed
              to benefit everyone in the supply chain.
            </p>
          </div>

          {/* Feature 1: Removes Middlemen */}
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 lg:gap-20 items-center w-full">
            <div className="space-y-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10">
                <Users className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-balance leading-tight">
                Removes Middlemen
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Direct from the farmers to you, no middlemen. Just honest
                produce, no hidden costs. Build relationships with the people
                who grow your food.
              </p>
              <ul className="space-y-3">
                {[
                  "Fair prices for farmers",
                  "Lower costs for buyers",
                  "Transparent transactions",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-muted-foreground"
                  >
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-success"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative flex justify-center md:justify-end w-full">
              <div className="relative rounded-2xl overflow-hidden max-w-sm md:max-w-md w-full group shadow-xl">
                <Image
                  src="/pie-chart-with-user-avatars-showing-direct-connect.jpg"
                  alt="Direct connection illustration"
                  width={400}
                  height={320}
                  className="w-full h-auto max-w-full transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>
          </div>

          {/* Feature 2: Community Driven */}
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 lg:gap-20 items-center w-full">
            <div className="relative flex justify-center md:justify-start order-2 md:order-1 w-full">
              <div className="relative rounded-2xl overflow-hidden max-w-sm md:max-w-md w-full group shadow-xl">
                <Image
                  src="/leaderboard-with-user-names-and-scores-on-green-ba.jpg"
                  alt="Community leaderboard"
                  width={400}
                  height={320}
                  className="w-full h-auto max-w-full transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>

            <div className="space-y-6 order-1 md:order-2">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10">
                <TrendingUp className="h-7 w-7 text-accent" />
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-balance leading-tight">
                Community Driven
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Powered by collective participation, driven by a commitment to
                fair sharing to every member. Your community, your marketplace.
              </p>
              <ul className="space-y-3">
                {[
                  "Trusted member ratings",
                  "Community feedback",
                  "Shared benefits",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-muted-foreground"
                  >
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-accent"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Feature 3: Cheap and Affordable */}
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 lg:gap-20 items-center w-full">
            <div className="space-y-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-success/10">
                <Shield className="h-7 w-7 text-success" />
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-balance leading-tight">
                Cheap and Affordable
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Premium meat and farm-fresh products, delivered to you at
                unbeatable prices. Quality doesn't have to break the bank.
              </p>
              <ul className="space-y-3">
                {["Wholesale prices", "No hidden fees", "Value for money"].map(
                  (item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-muted-foreground"
                    >
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-success"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      {item}
                    </li>
                  )
                )}
              </ul>
            </div>

            <div className="relative flex justify-center md:justify-end w-full">
              <div className="relative rounded-2xl overflow-hidden max-w-sm md:max-w-md w-full group shadow-xl">
                <Image
                  src="/rice-bags.jpg"
                  alt="Affordable farm products"
                  width={400}
                  height={320}
                  className="w-full h-auto max-w-full transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>
          </div>

          {/* Feature 4: Harvest Savings */}
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 lg:gap-20 items-center w-full">
            <div className="relative flex justify-center md:justify-start order-2 md:order-1 w-full">
              <div className="relative rounded-2xl overflow-hidden max-w-sm md:max-w-md w-full group shadow-xl">
                <Image
                  src="/fresh-tomatoes.png"
                  alt="Harvest savings illustration"
                  width={400}
                  height={320}
                  className="w-full h-auto max-w-full transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>

            <div className="space-y-6 order-1 md:order-2">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-warning/10">
                <Sparkles className="h-7 w-7 text-warning" />
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-balance leading-tight">
                Harvest Savings
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Contribute over time and receive your share when the pool is
                complete. Flexible payment options that work for you.
              </p>
              <ul className="space-y-3">
                {[
                  "Flexible contributions",
                  "Secure escrow",
                  "Guaranteed delivery",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-muted-foreground"
                  >
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-warning/20 flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-warning"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - What Users Say (Before Footer) */}
      <section
        id="testimonials"
        className="pt-20 md:pt-28 pb-0 bg-gray-50 w-full"
      >
        <div className="relative flex flex-col lg:flex-row items-stretch max-w-full bg-muted/30 overflow-hidden">
          {/* Text Content */}
          <div className="flex-1 p-10 lg:p-20 flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8">
              What Users Say
            </h2>
            <p className="text-xl md:text-2xl mb-6 text-muted-foreground leading-relaxed">
              "{testimonials[currentTestimonial].quote}"
            </p>
            <p className="text-lg font-semibold text-foreground mt-4">
              {testimonials[currentTestimonial].name}
            </p>
            <p className="text-muted-foreground mb-8">
              {testimonials[currentTestimonial].title}
            </p>
            <Link
              href="/about"
              className="inline-block text-primary font-semibold hover:text-primary/80 transition-colors uppercase tracking-wide"
            >
              MORE STORIES
            </Link>
          </div>

          {/* Image */}
          <div className="flex-1 relative min-h-[400px] lg:min-h-[600px]">
            <Image
              src={testimonials[currentTestimonial].image}
              alt={testimonials[currentTestimonial].name}
              fill
              className="object-cover object-top transition-opacity duration-1000 ease-in-out"
            />
          </div>

          {/* Navigation Dots */}
          <div className="absolute right-6 lg:right-10 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 z-10">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentTestimonial(i)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentTestimonial === i
                    ? "bg-primary scale-125"
                    : i < currentTestimonial
                    ? "bg-primary/60"
                    : "bg-accent/50 hover:bg-accent"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
