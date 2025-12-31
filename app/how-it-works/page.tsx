import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Users, Package, DollarSign, Shield, CheckCircle, Clock, Truck, MapPin } from "lucide-react"
import Link from "next/link"

export default function HowItWorksPage() {
  return (
    <div className="container px-[30px] py-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">How FarmShare Works</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A revolutionary approach to agricultural buying that benefits both farmers and buyers through collective purchasing power.
          </p>
        </div>

        {/* Main Process */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">The Pool Buying Process</h2>
            <p className="text-muted-foreground">
              Simple steps to access quality agricultural products at fair prices
            </p>
          </div>

          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2"></div>

            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8 relative">
              {/* Step 1 */}
              <div className="relative">
                <div className="bg-background border-2 border-border rounded-lg p-6 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white text-lg font-bold">
                      1
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2">Browse Pools</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Explore available agricultural products from verified vendors
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Verified vendors</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Quality products</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Fair pricing</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="bg-background border-2 border-border rounded-lg p-6 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white text-lg font-bold">
                      2
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2">Join Pool</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select the number of slots you want and choose delivery method
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Package className="h-3 w-3 text-accent" />
                      <span>Choose quantity</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Truck className="h-3 w-3 text-accent" />
                      <span>Delivery options</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <DollarSign className="h-3 w-3 text-accent" />
                      <span>Secure payment</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="bg-background border-2 border-border rounded-lg p-6 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white text-lg font-bold">
                      3
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2">Pool Fills</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Wait for other buyers to join the pool and reach the target quantity
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Users className="h-3 w-3 text-blue-500" />
                      <span>Collective buying</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 text-blue-500" />
                      <span>Track progress</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle className="h-3 w-3 text-blue-500" />
                      <span>Real-time updates</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative">
                <div className="bg-background border-2 border-border rounded-lg p-6 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white text-lg font-bold">
                      4
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2">Delivery</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Receive your products at your chosen location or pickup point
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 text-green-500" />
                      <span>Pickup available</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Truck className="h-3 w-3 text-green-500" />
                      <span>Home delivery</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Shield className="h-3 w-3 text-green-500" />
                      <span>Quality guaranteed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Why Pool Buying Works</h2>
            <p className="text-muted-foreground">
              Benefits for everyone in the agricultural supply chain
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-xl text-green-600">For Buyers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-accent mt-0.5" />
                    <div>
                      <h4 className="font-medium">Lower Prices</h4>
                      <p className="text-sm text-muted-foreground">
                        Access wholesale prices by buying in bulk with others
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-accent mt-0.5" />
                    <div>
                      <h4 className="font-medium">Secure Transactions</h4>
                      <p className="text-sm text-muted-foreground">
                        Payment held in escrow until delivery is confirmed
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-accent mt-0.5" />
                    <div>
                      <h4 className="font-medium">Collective Power</h4>
                      <p className="text-sm text-muted-foreground">
                        Join forces with other buyers for better negotiating power
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-accent mt-0.5" />
                    <div>
                      <h4 className="font-medium">Quality Assurance</h4>
                      <p className="text-sm text-muted-foreground">
                        All vendors are verified and products meet quality standards
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-xl text-blue-600">For Farmers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-accent mt-0.5" />
                    <div>
                      <h4 className="font-medium">Bulk Sales</h4>
                      <p className="text-sm text-muted-foreground">
                        Sell large quantities quickly to multiple buyers at once
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-accent mt-0.5" />
                    <div>
                      <h4 className="font-medium">Fair Pricing</h4>
                      <p className="text-sm text-muted-foreground">
                        Set fair prices that reflect the quality and value of your products
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Truck className="h-5 w-5 text-accent mt-0.5" />
                    <div>
                      <h4 className="font-medium">Efficient Logistics</h4>
                      <p className="text-sm text-muted-foreground">
                        Deliver to multiple buyers in a single coordinated effort
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-accent mt-0.5" />
                    <div>
                      <h4 className="font-medium">Direct Access</h4>
                      <p className="text-sm text-muted-foreground">
                        Connect directly with buyers without middlemen
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Safety Features */}
        <Card className="bg-gradient-to-r from-accent/10 to-primary/10">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Safety & Trust Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white mx-auto mb-3">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="font-medium mb-2">Vendor Verification</h3>
                <p className="text-sm text-muted-foreground">
                  All vendors undergo thorough business and identity verification
                </p>
              </div>
              <div className="text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white mx-auto mb-3">
                  <DollarSign className="h-6 w-6" />
                </div>
                <h3 className="font-medium mb-2">Escrow Protection</h3>
                <p className="text-sm text-muted-foreground">
                  Payments are secure and only released when delivery is confirmed
                </p>
              </div>
              <div className="text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white mx-auto mb-3">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <h3 className="font-medium mb-2">Quality Standards</h3>
                <p className="text-sm text-muted-foreground">
                  Products must meet strict quality requirements before approval
                </p>
              </div>
              <div className="text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white mx-auto mb-3">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="font-medium mb-2">Rating System</h3>
                <p className="text-sm text-muted-foreground">
                  Transparent ratings and reviews build trust in the community
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What happens if a pool doesn't fill?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  If a pool doesn't reach its target quantity by the deadline, all buyers receive a full refund automatically. No money is lost.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How long does delivery take?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Delivery timelines are set by vendors and vary by product type and location. Most deliveries occur within 3-7 days after pool completion.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I cancel my order?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  You can cancel before the pool fills and receive a full refund. Once a pool is filled and preparation begins, cancellation may not be possible.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How are delivery costs calculated?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Delivery costs are shared among all buyers in the pool and depend on your chosen delivery method and location. Costs are shown upfront before payment.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <Card className="bg-primary/5">
          <CardContent className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of buyers and sellers who are already benefiting from the FarmShare platform.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/marketplace">Browse Pools</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/vendor/signup">Become a Vendor</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}