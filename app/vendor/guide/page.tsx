import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Users, DollarSign, Package, Shield, TrendingUp, Clock, Award } from "lucide-react"
import Link from "next/link"

export default function VendorGuidePage() {
  return (
    <div className="container px-[30px] py-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Vendor Guide</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to know to succeed as a FarmShare vendor and grow your agricultural business.
          </p>
          <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/vendor/signup">Get Started</Link>
          </Button>
        </div>

        {/* Benefits */}
        <Card className="bg-gradient-to-r from-accent/10 to-primary/10">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Why Sell on FarmShare?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <DollarSign className="h-8 w-8 text-accent mx-auto mb-2" />
                <h3 className="font-medium mb-2">Better Prices</h3>
                <p className="text-sm text-muted-foreground">
                  Get fair prices for your products through collective buying power
                </p>
              </div>
              <div className="text-center">
                <Users className="h-8 w-8 text-accent mx-auto mb-2" />
                <h3 className="font-medium mb-2">Direct Access</h3>
                <p className="text-sm text-muted-foreground">
                  Connect directly with buyers without middlemen
                </p>
              </div>
              <div className="text-center">
                <Shield className="h-8 w-8 text-accent mx-auto mb-2" />
                <h3 className="font-medium mb-2">Secure Payments</h3>
                <p className="text-sm text-muted-foreground">
                  Escrow system ensures guaranteed payment for completed orders
                </p>
              </div>
              <div className="text-center">
                <TrendingUp className="h-8 w-8 text-accent mx-auto mb-2" />
                <h3 className="font-medium mb-2">Grow Business</h3>
                <p className="text-sm text-muted-foreground">
                  Reach more customers and scale your agricultural business
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Getting Started */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center">Getting Started</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white text-sm font-bold">
                    1
                  </div>
                  <CardTitle className="text-lg">Sign Up & Verify</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Create your vendor account</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Complete business verification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Submit required documents</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Wait for approval (1-3 business days)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white text-sm font-bold">
                    2
                  </div>
                  <CardTitle className="text-lg">Create Your First Pool</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Select product category</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Set quantity and target price</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Define delivery timeline</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Choose delivery options</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white text-sm font-bold">
                    3
                  </div>
                  <CardTitle className="text-lg">Manage & Deliver</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Monitor pool progress</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Communicate with buyers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Prepare products for delivery</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Deliver and receive payment</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Best Practices */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center">Best Practices for Success</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-accent" />
                  <CardTitle className="text-lg">Product Quality</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Always deliver products that meet or exceed described quality</li>
                  <li>• Use clear, accurate photos in your product listings</li>
                  <li>• Package products professionally and securely</li>
                  <li>• Provide detailed product specifications and descriptions</li>
                  <li>• Source from reliable suppliers and maintain quality control</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-accent" />
                  <CardTitle className="text-lg">Timing & Communication</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Set realistic delivery timelines</li>
                  <li>• Communicate proactively with buyers</li>
                  <li>• Respond to messages promptly</li>
                  <li>• Update pool status regularly</li>
                  <li>• Notify buyers of any delays or issues immediately</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-accent" />
                  <CardTitle className="text-lg">Pricing Strategy</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Research market prices before setting pool prices</li>
                  <li>• Factor in all costs including packaging and delivery</li>
                  <li>• Offer competitive but sustainable pricing</li>
                  <li>• Consider seasonal price fluctuations</li>
                  <li>• Maintain consistent pricing across similar products</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-accent" />
                  <CardTitle className="text-lg">Customer Service</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Maintain a professional and friendly attitude</li>
                  <li>• Handle complaints and issues constructively</li>
                  <li>• Ask for feedback to improve your service</li>
                  <li>• Build long-term relationships with buyers</li>
                  <li>• Be transparent about product availability and quality</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Requirements */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Verification Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Required Documents</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Badge variant="secondary">Required</Badge>
                    <span>Business Registration Certificate</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="secondary">Required</Badge>
                    <span>Valid ID Card (National ID, Driver's License, or Passport)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="secondary">Required</Badge>
                    <span>TIN Certificate</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="outline">Optional</Badge>
                    <span>Agricultural Certification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="outline">Optional</Badge>
                    <span>Quality Assurance Certifications</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold">Business Requirements</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Must be a registered agricultural business in Nigeria</li>
                  <li>• Minimum 1 year of agricultural business experience</li>
                  <li>• Capacity to fulfill bulk orders consistently</li>
                  <li>• Physical business location or farm address</li>
                  <li>• Bank account for business transactions</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Pro Tips for New Vendors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Start Small</h4>
                <p className="text-sm text-muted-foreground">
                  Begin with smaller pool sizes to build your reputation before scaling up
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Build Reviews</h4>
                <p className="text-sm text-muted-foreground">
                  Encourage satisfied customers to leave reviews to build trust with new buyers
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Seasonal Planning</h4>
                <p className="text-sm text-muted-foreground">
                  Plan your pools around harvest seasons for optimal pricing and availability
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Diversify Products</h4>
                <p className="text-sm text-muted-foreground">
                  Start with your strongest products and gradually expand your offerings
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Quality Photos</h4>
                <p className="text-sm text-muted-foreground">
                  Invest in good product photography - it significantly impacts buyer decisions
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Network</h4>
                <p className="text-sm text-muted-foreground">
                  Join vendor communities and learn from experienced sellers
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="bg-primary/5">
          <CardContent className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">Ready to Start Selling?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of successful vendors who are growing their agricultural business with FarmShare.
              Complete your verification today and start reaching buyers across Nigeria.
            </p>
            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/vendor/signup">Become a Vendor</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}