import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Leaf,
  Users,
  Target,
  Award,
  ArrowRight,
  Sparkles,
  CheckCircle,
  TrendingUp,
  Shield,
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary via-primary to-primary-dark overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        </div>

        <div className="container px-[30px] lg:px-[60px] py-20 relative z-10">
          <div className="text-center space-y-6 text-primary-foreground max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent shadow-lg shadow-accent/25">
                <Leaf className="h-8 w-8 text-white" />
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in">
              About <span className="text-accent">FarmShare</span>
            </h1>

            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed animate-fade-in-up">
              Empowering farmers and buyers through collective purchasing power
              across Nigeria
            </p>
          </div>
        </div>
      </div>

      <div className="container px-[30px] lg:px-[60px] py-16">
        <div className="space-y-16">
          {/* Mission */}
          <Card className="overflow-hidden border-0 shadow-2xl">
            <div className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 p-8 lg:p-12">
              <div className="text-center max-w-4xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
                  <Sparkles className="h-4 w-4" />
                  Our Mission
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                  Transforming Agricultural Trade
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  To revolutionize agricultural trade in Nigeria by connecting
                  farmers directly with buyers through innovative pooled-buying
                  technology. We're committed to fair pricing, quality
                  assurance, and sustainable agricultural practices that benefit
                  everyone in the supply chain.
                </p>
              </div>
            </div>
          </Card>

          {/* Values */}
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Our Core Values
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                The principles that guide everything we do at FarmShare
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="card-premium hover-lift text-center group">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 group-hover:bg-accent group-hover:shadow-lg group-hover:shadow-accent/25 transition-all duration-300">
                      <Users className="h-8 w-8 text-accent group-hover:text-white transition-colors" />
                    </div>
                  </div>
                  <CardTitle className="text-xl">Community First</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Building strong relationships between farmers and buyers
                    based on trust and mutual benefit
                  </p>
                </CardContent>
              </Card>

              <Card className="card-premium hover-lift text-center group">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 group-hover:bg-primary group-hover:shadow-lg group-hover:shadow-primary/25 transition-all duration-300">
                      <Target className="h-8 w-8 text-primary group-hover:text-white transition-colors" />
                    </div>
                  </div>
                  <CardTitle className="text-xl">Fair Pricing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Ensuring farmers get fair prices while buyers enjoy bulk
                    purchasing benefits
                  </p>
                </CardContent>
              </Card>

              <Card className="card-premium hover-lift text-center group">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 group-hover:bg-green-500 group-hover:shadow-lg group-hover:shadow-green-500/25 transition-all duration-300">
                      <Shield className="h-8 w-8 text-green-600 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                  <CardTitle className="text-xl">Quality Assured</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Rigorous verification processes to ensure only quality
                    products reach our buyers
                  </p>
                </CardContent>
              </Card>

              <Card className="card-premium hover-lift text-center group">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 group-hover:bg-blue-500 group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                      <TrendingUp className="h-8 w-8 text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                  <CardTitle className="text-xl">Innovation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Leveraging technology to solve traditional agricultural
                    supply chain challenges
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* How We Work */}
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                How FarmShare Works
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                A simple, transparent process that benefits everyone
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="card-premium hover-lift relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white font-bold text-lg">
                    1
                  </div>
                </div>
                <CardHeader className="pt-8">
                  <CardTitle className="text-xl">Pool Creation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Verified farmers create pools for their agricultural
                    products, setting quantities and target prices
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Set product quantity
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Define slot prices
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Set delivery timeline
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="card-premium hover-lift relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white font-bold text-lg">
                    2
                  </div>
                </div>
                <CardHeader className="pt-8">
                  <CardTitle className="text-xl">Collective Buying</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Buyers join pools by purchasing slots, spreading risk and
                    cost among multiple participants
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Browse available pools
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Purchase slots securely
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Track pool progress
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="card-premium hover-lift relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white font-bold text-lg">
                    3
                  </div>
                </div>
                <CardHeader className="pt-8">
                  <CardTitle className="text-xl">Fair Delivery</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Once pools are filled, products are delivered efficiently
                    with quality guarantees
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Quality verified
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Efficient distribution
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Satisfaction guaranteed
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA */}
          <Card className="overflow-hidden border-0 shadow-2xl">
            <div className="bg-gradient-to-r from-primary via-primary to-primary-dark p-8 lg:p-16 text-primary-foreground">
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                  Join Our Community
                </h2>
                <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
                  Whether you're a farmer looking for fair prices or a buyer
                  seeking quality products, FarmShare is here to transform your
                  agricultural trading experience.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    asChild
                    size="lg"
                    className="bg-accent hover:bg-accent/90 text-white rounded-xl shadow-lg shadow-accent/25 hover:shadow-xl transition-all group"
                  >
                    <Link
                      href="/vendor/signup"
                      className="flex items-center gap-2"
                    >
                      Become a Vendor
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    asChild
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl"
                  >
                    <Link href="/buyer/marketplace">Browse Pools</Link>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
