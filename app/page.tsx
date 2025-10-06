"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Quote, Users, Clock, MapPin, ChevronLeft, ChevronRight } from "lucide-react"
import { useStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

const availablePools = [
  {
    id: "1",
    product_name: "Premium Rice",
    product_description: "50kg bag of premium long-grain rice",
    vendor_name: "Alade Farms",
    slots_count: 6,
    slots_filled: 4,
    price_per_slot: 8500,
    allow_home_delivery: true,
    delivery_deadline: "2025-01-15",
    image: "/rice-bags.jpg",
  },
  {
    id: "2",
    product_name: "Fresh Tomatoes",
    product_description: "25kg basket of fresh tomatoes",
    vendor_name: "Green Valley Farms",
    slots_count: 8,
    slots_filled: 5,
    price_per_slot: 4200,
    allow_home_delivery: true,
    delivery_deadline: "2025-01-12",
    image: "/fresh-tomatoes.png",
  },
  {
    id: "3",
    product_name: "Yellow Corn",
    product_description: "100kg of yellow corn (maize)",
    vendor_name: "Sunrise Agriculture",
    slots_count: 10,
    slots_filled: 7,
    price_per_slot: 6800,
    allow_home_delivery: false,
    delivery_deadline: "2025-01-18",
    image: "/yellow-corn-maize.jpg",
  },
  {
    id: "4",
    product_name: "Palm Oil",
    product_description: "25 litres of pure red palm oil",
    vendor_name: "Delta Palm Ventures",
    slots_count: 5,
    slots_filled: 2,
    price_per_slot: 12000,
    allow_home_delivery: true,
    delivery_deadline: "2025-01-20",
    image: "/palm-oil-containers.jpg",
  },
]

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
    quote: "Joining pools has saved me so much money! I get bulk prices without having to buy in bulk. It's genius.",
    name: "Tunde Bakare",
    title: "Small Business Owner",
    avatar: "/placeholder.svg?height=64&width=64",
  },
]

export default function HomePage() {
  const { isAuthenticated } = useStore()
  const router = useRouter()
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const handleJoinPool = (poolId: string) => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/buyer/pool/${poolId}`)
    } else {
      router.push(`/buyer/pool/${poolId}`)
    }
  }

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <div className="flex flex-col overflow-x-hidden w-full max-w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground py-16 md:py-24 w-full">
        <div className="px-[30px] lg:px-[60px] max-w-[1400px] mx-auto w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance leading-tight">
                Farm Fresh <span className="text-accent">Products</span>
                <br />
                at your Fingertips
              </h1>
              <p className="text-base md:text-lg text-primary-foreground/90 text-pretty leading-relaxed max-w-xl">
                FarmShare is a revolutionary platform that connects farmers and consumers, enabling middlemen to avoid
                inflation, and offers to buy in bulk. Simply more together. Enjoy the highest quality, earliest products
                straight from the farm to your table, marketplace.
              </p>
              <Button size="lg" asChild className="bg-white text-primary hover:bg-white/90 rounded-full px-8">
                <Link href="#product">Join a pool</Link>
              </Button>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/modern-analytics-dashboard.png"
                  alt="FarmShare Dashboard"
                  width={600}
                  height={500}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 md:py-20 bg-background w-full">
        <div className="px-[30px] lg:px-[60px] max-w-[1400px] mx-auto w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <Card className="border-2 shadow-lg">
              <CardContent className="p-8 space-y-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/placeholder.svg?height=48&width=48" alt="Uche Nnamani" />
                    <AvatarFallback>UN</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">Uche Nnamani</h3>
                    <p className="text-sm text-muted-foreground">CEO, Farmstore.ng</p>
                  </div>
                  <Quote className="h-12 w-12 text-accent/20" />
                </div>
                <blockquote className="text-muted-foreground leading-relaxed italic">
                  "We believe that fresh, responsibly sourced food should be accessible to everyone, regardless of
                  location or schedules."
                </blockquote>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-balance">
                More than 100k+ people are using our product.
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam
                rem aperiam, eaque ipsa quae ab.
              </p>
              <Button variant="link" className="text-primary p-0 h-auto font-semibold">
                Learn more →
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Available Pools Section */}
      <section id="product" className="py-16 md:py-20 bg-background w-full">
        <div className="px-[30px] lg:px-[60px] max-w-[1400px] mx-auto w-full">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-balance">Available Pools</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Join a pool and enjoy bulk pricing on premium agricultural products. Connect directly with verified
              vendors and save money together.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {availablePools.map((pool) => (
              <Card key={pool.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 bg-muted">
                  <Image src={pool.image || "/placeholder.svg"} alt={pool.product_name} fill className="object-cover" />
                  <Badge className="absolute top-3 right-3 bg-accent text-white">
                    {pool.slots_filled}/{pool.slots_count} filled
                  </Badge>
                </div>
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg">{pool.product_name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{pool.product_description}</p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{pool.vendor_name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Closes {new Date(pool.delivery_deadline).toLocaleDateString()}</span>
                    </div>
                    {pool.allow_home_delivery && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>Home delivery available</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-muted-foreground">Price per slot</span>
                      <span className="text-xl font-bold text-primary">₦{pool.price_per_slot.toLocaleString()}</span>
                    </div>
                    <Button
                      onClick={() => handleJoinPool(pool.id)}
                      className="w-full bg-accent hover:bg-accent/90 text-white"
                      disabled={pool.slots_filled >= pool.slots_count}
                    >
                      {pool.slots_filled >= pool.slots_count ? "Pool Full" : "Join Pool"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" size="lg" asChild>
              <Link href="/buyer/marketplace">View All Pools →</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Pool Collaboration Section */}
      <section id="pools" className="py-16 md:py-20 bg-secondary w-full">
        <div className="px-[30px] lg:px-[60px] max-w-[1400px] mx-auto w-full">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-balance">
              Join a pool of six to share a full cow now.
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Whether it's choosing reusable food and liquid containers or picking the vegetarian option for the office
              lunch, Greenlist gives your workforce the power of changing their habits, and making choices that have
              less harmful effects on the environment.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl max-w-full">
              <Image
                src="/slack-like-messaging-interface-with-voting-options.jpg"
                alt="Pool collaboration interface"
                width={800}
                height={500}
                className="w-full h-auto max-w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-background w-full">
        <div className="px-[30px] lg:px-[60px] max-w-[1400px] mx-auto space-y-16 md:space-y-20 w-full">
          {/* Feature 1: Removes Middlemen */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center w-full">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-balance">Removes Middlemen</h2>
              <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                Direct from the farmers to you, no middlemen. Just honest produce, no hidden costs.
              </p>
            </div>

            <div className="relative flex justify-center md:justify-end w-full">
              <div className="relative rounded-2xl overflow-hidden max-w-sm md:max-w-md w-full">
                <Image
                  src="/pie-chart-with-user-avatars-showing-direct-connect.jpg"
                  alt="Direct connection illustration"
                  width={400}
                  height={320}
                  className="w-full h-auto max-w-full"
                />
              </div>
            </div>
          </div>

          {/* Feature 2: Community Driven */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center w-full">
            <div className="relative flex justify-center md:justify-start order-2 md:order-1 w-full">
              <div className="relative rounded-2xl overflow-hidden max-w-sm md:max-w-md w-full">
                <Image
                  src="/leaderboard-with-user-names-and-scores-on-green-ba.jpg"
                  alt="Community leaderboard"
                  width={400}
                  height={320}
                  className="w-full h-auto max-w-full"
                />
              </div>
            </div>

            <div className="space-y-4 order-1 md:order-2">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-balance">Community Driven</h2>
              <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                Powered by collective participation, driven by a commitment to fair sharing to every member.
              </p>
            </div>
          </div>

          {/* Feature 3: Cheap and Affordable */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center w-full">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-balance">Cheap and Affordable</h2>
              <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                Premium meat and farm-fresh products, delivered to you at unbeatable prices.
              </p>
            </div>

            <div className="relative flex justify-center md:justify-end w-full">
              <div className="relative rounded-2xl overflow-hidden max-w-sm md:max-w-md w-full">
                <Image
                  src="/rice-bags.jpg"
                  alt="Affordable farm products"
                  width={400}
                  height={320}
                  className="w-full h-auto max-w-full"
                />
              </div>
            </div>
          </div>

          {/* Feature 4: Harvest Savings */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center w-full">
            <div className="relative flex justify-center md:justify-start order-2 md:order-1 w-full">
              <div className="relative rounded-2xl overflow-hidden max-w-sm md:max-w-md w-full">
                <Image
                  src="/fresh-tomatoes.png"
                  alt="Harvest savings illustration"
                  width={400}
                  height={320}
                  className="w-full h-auto max-w-full"
                />
              </div>
            </div>

            <div className="space-y-4 order-1 md:order-2">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-balance">Harvest Savings</h2>
              <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                Contribute over time and receive your share when the cow is processed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 h-12 w-12 rounded-full bg-accent text-white shadow-lg hover:bg-accent/90 transition-all flex items-center justify-center z-40"
        aria-label="Scroll to top"
      >
        ↑
      </button>

      {/* What Users Say Section */}
      <section className="py-16 md:py-20 bg-background border-t w-full">
        <div className="px-[30px] lg:px-[60px] max-w-[1400px] mx-auto w-full">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Users Say</h2>
          </div>

          <div className="max-w-4xl mx-auto relative">
            <Card className="border-2 shadow-xl">
              <CardContent className="p-8 md:p-12">
                <div className="flex flex-col items-center text-center space-y-6">
                  <Quote className="h-16 w-16 text-accent/30" />

                  <blockquote className="text-lg md:text-xl text-muted-foreground leading-relaxed italic min-h-[120px] flex items-center">
                    "{testimonials[currentTestimonial].quote}"
                  </blockquote>

                  <div className="flex flex-col items-center gap-3 pt-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src={testimonials[currentTestimonial].avatar || "/placeholder.svg"}
                        alt={testimonials[currentTestimonial].name}
                      />
                      <AvatarFallback>
                        {testimonials[currentTestimonial].name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{testimonials[currentTestimonial].name}</h3>
                      <p className="text-sm text-muted-foreground">{testimonials[currentTestimonial].title}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-center gap-4 mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={prevTestimonial}
                className="rounded-full h-10 w-10 bg-transparent"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentTestimonial ? "w-8 bg-accent" : "w-2 bg-muted-foreground/30"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={nextTestimonial}
                className="rounded-full h-10 w-10 bg-transparent"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            <div className="text-center mt-8">
              <Button variant="link" className="text-primary font-semibold text-lg">
                MORE STORIES →
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
