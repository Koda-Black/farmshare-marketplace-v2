"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Quote,
  Users,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Leaf,
  TrendingUp,
  Shield,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { httpRequest } from "@/lib/httpRequest";

const testimonials = [
  {
    id: 1,
    quote:
      "Farmshare is the future of food sourcing – fresh, direct, and community-driven. It's a smart way to save and support local farmers.",
    name: "Chukwu Emmanuel",
    title: "Founder, Micropay",
    avatar: "/placeholder.svg?height=64&width=64",
  },
  {
    id: 2,
    quote:
      "The quality of produce I get from FarmShare is unmatched. Knowing it comes directly from farmers makes it even better.",
    name: "Adaeze Okonkwo",
    title: "Restaurant Owner",
    avatar: "/placeholder.svg?height=64&width=64",
  },
  {
    id: 3,
    quote:
      "Joining pools has saved me so much money! I get bulk prices without having to buy in bulk. It's genius.",
    name: "Tunde Bakare",
    title: "Small Business Owner",
    avatar: "/placeholder.svg?height=64&width=64",
  },
];

const stats = [
  { label: "Active Users", value: "10K+", icon: Users },
  { label: "Pools Completed", value: "500+", icon: TrendingUp },
  { label: "Trusted Vendors", value: "150+", icon: Shield },
];

export default function HomePage() {
  const { isAuthenticated } = useStore();
  const router = useRouter();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  // Trigger animations on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Fetch real pools from API
  useEffect(() => {
    const fetchPools = async () => {
      try {
        setLoading(true);
        const response = await httpRequest.get("/pools");
        // Get only first 4 pools for homepage display
        const homepagePools = (response || []).slice(0, 4);
        setPools(homepagePools);
      } catch (error) {
        console.error("Failed to fetch pools:", error);
        setPools([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPools();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleJoinPool = (poolId: string) => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/buyer/pool/${poolId}`);
    } else {
      router.push(`/buyer/pool/${poolId}`);
    }
  };

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <div className="flex flex-col overflow-x-hidden w-full max-w-full">
      {/* Hero Section - Enhanced with gradient overlay and animations */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary-dark text-primary-foreground py-20 md:py-28 lg:py-32 w-full">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-radial from-white/5 to-transparent" />
        </div>

        <div className="px-[30px] lg:px-[60px] max-w-[1400px] mx-auto w-full relative z-10">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div
              className={`space-y-8 transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
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
                at your Fingertips
              </h1>

              <p className="text-lg md:text-xl text-primary-foreground/85 leading-relaxed max-w-xl">
                Connect directly with verified farmers, join buying pools, and
                access wholesale prices on premium agricultural products. Save
                money together with your community.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  asChild
                  className="bg-accent hover:bg-accent/90 text-white rounded-full px-8 py-6 text-lg font-semibold shadow-lg shadow-accent/25 hover-lift group"
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
                {stats.map((stat, index) => (
                  <div
                    key={stat.label}
                    className={`flex items-center gap-3 transition-all duration-500 delay-${
                      (index + 1) * 100
                    }`}
                    style={{ transitionDelay: `${(index + 1) * 100}ms` }}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
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

            <div
              className={`relative transition-all duration-700 delay-200 ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-8"
              }`}
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/30">
                {/* Decorative frame */}
                <div className="absolute -inset-1 bg-gradient-to-r from-accent/50 via-white/20 to-accent/50 rounded-3xl blur-sm" />
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

              {/* Floating cards */}
              <div
                className="absolute -bottom-6 -left-6 bg-white dark:bg-card rounded-xl shadow-xl p-4 animate-fade-in-up"
                style={{ animationDelay: "500ms" }}
              >
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

              <div
                className="absolute -top-4 -right-4 bg-white dark:bg-card rounded-xl shadow-xl p-4 animate-fade-in-down"
                style={{ animationDelay: "700ms" }}
              >
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

      {/* Social Proof Section - New */}
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

      {/* Testimonials Section - Enhanced */}
      <section
        id="testimonials"
        className="py-20 md:py-28 bg-background w-full"
      >
        <div className="px-[30px] lg:px-[60px] max-w-[1400px] mx-auto w-full">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
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
          <div className="text-center mb-16 space-y-4">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              Fresh Opportunities
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-balance">
              Available Pools
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Join a pool and enjoy bulk pricing on premium agricultural
              products. Connect directly with verified vendors and save money
              together.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {loading ? (
              // Enhanced loading skeleton with shimmer
              Array.from({ length: 4 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="relative h-48 shimmer" />
                  <CardContent className="p-5 space-y-4">
                    <div className="h-5 shimmer rounded-md w-3/4" />
                    <div className="h-4 shimmer rounded-md w-full" />
                    <div className="h-4 shimmer rounded-md w-1/2" />
                    <div className="pt-4 border-t">
                      <div className="h-10 shimmer rounded-full" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : pools.length > 0 ? (
              pools.map((pool, index) => (
                <Card
                  key={pool.id}
                  className={`overflow-hidden card-premium group animate-fade-in-up`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative h-48 bg-muted overflow-hidden">
                    <Image
                      src={pool.product_image || "/placeholder.svg"}
                      alt={pool.product_name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Badge className="absolute top-3 right-3 bg-accent text-white shadow-lg">
                      {pool.slots_filled}/{pool.slots_count} filled
                    </Badge>
                  </div>
                  <CardContent className="p-5 space-y-4">
                    <div>
                      <h3 className="font-semibold text-xl group-hover:text-primary transition-colors">
                        {pool.product_name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {pool.product_description}
                      </p>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4 text-primary" />
                        <span>{pool.vendor_name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4 text-warning" />
                        <span>
                          Closes{" "}
                          {new Date(
                            pool.delivery_deadline
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      {pool.allow_home_delivery && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4 text-success" />
                          <span>Home delivery available</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-border/50">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-muted-foreground">
                          Price per slot
                        </span>
                        <span className="text-2xl font-bold text-primary">
                          ₦{pool.price_per_slot.toLocaleString()}
                        </span>
                      </div>
                      <Button
                        onClick={() => handleJoinPool(pool.id)}
                        className="w-full bg-accent hover:bg-accent/90 text-white py-6 rounded-xl font-semibold shadow-lg shadow-accent/20 hover-glow transition-all duration-300"
                        disabled={pool.slots_filled >= pool.slots_count}
                      >
                        {pool.slots_filled >= pool.slots_count
                          ? "Pool Full"
                          : "Join Pool"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
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

      {/* Pool Collaboration Section - Enhanced */}
      <section
        id="pools"
        className="py-20 md:py-28 bg-secondary w-full relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

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
              Pool together with other buyers to access wholesale prices on
              premium products. Track your pool's progress in real-time and get
              notified when it's ready for delivery.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl max-w-full group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative rounded-3xl overflow-hidden border-2 border-border/30 bg-card">
                <Image
                  src="/placeholder.jpg"
                  alt="Community pool members chatting about delivery and food orders"
                  width={800}
                  height={500}
                  className="w-full h-auto max-w-full transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
            </div>
          </div>

          {/* Feature highlights */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Real-time Updates</h3>
              <p className="text-sm text-muted-foreground">
                Track pool progress and member activity instantly
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 mb-4">
                <Shield className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">Secure Payments</h3>
              <p className="text-sm text-muted-foreground">
                Funds held in escrow until delivery confirmation
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-success/10 mb-4">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <h3 className="font-semibold mb-2">Save Together</h3>
              <p className="text-sm text-muted-foreground">
                Access wholesale prices through collective buying
              </p>
            </div>
          </div>
        </div>
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

      {/* Scroll to top button - Enhanced */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 h-12 w-12 rounded-full bg-accent text-white shadow-lg shadow-accent/25 hover:bg-accent/90 hover:shadow-xl hover:shadow-accent/30 transition-all duration-300 flex items-center justify-center z-40 hover-scale"
        aria-label="Scroll to top"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>

      {/* What Users Say Section - Clean & Minimal */}
      <section className="py-20 md:py-28 bg-background w-full">
        <div className="px-[30px] lg:px-[60px] max-w-[1000px] mx-auto w-full">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              What Users Say
            </h2>
          </div>

          <div className="relative">
            {/* Main testimonial */}
            <div className="text-center space-y-8 py-8">
              <blockquote className="text-xl md:text-2xl lg:text-3xl text-foreground leading-relaxed font-medium max-w-3xl mx-auto">
                "{testimonials[currentTestimonial].quote}"
              </blockquote>

              <div className="flex flex-col items-center gap-2 pt-4">
                <h3 className="font-semibold text-lg">
                  {testimonials[currentTestimonial].name}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {testimonials[currentTestimonial].title}
                </p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button
                variant="ghost"
                size="icon"
                onClick={prevTestimonial}
                className="rounded-full h-10 w-10 hover:bg-muted transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentTestimonial
                        ? "w-8 bg-accent"
                        : "w-2 bg-muted-foreground/20 hover:bg-muted-foreground/40"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={nextTestimonial}
                className="rounded-full h-10 w-10 hover:bg-muted transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* More Stories Link */}
            <div className="text-center mt-10">
              <Button
                variant="outline"
                asChild
                className="rounded-full px-6 border-border/50 hover:border-accent hover:text-accent transition-colors"
              >
                <Link href="/testimonials">MORE STORIES</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Clean & Minimal */}
      <section className="py-16 md:py-20 border-t border-border/50 w-full">
        <div className="px-[30px] lg:px-[60px] max-w-[1000px] mx-auto w-full text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            Ready to Start Saving?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Join thousands of farmers and buyers already enjoying collective
            purchasing power.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              size="lg"
              asChild
              className="bg-accent hover:bg-accent/90 text-white rounded-full px-8 font-semibold"
            >
              <Link href="/signup">Get Started Free</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="rounded-full px-8 border-border/50 hover:border-accent hover:text-accent transition-colors"
            >
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
