import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Shield, DollarSign, Users, Award, Clock, AlertCircle, ArrowRight, Leaf, Building, FileText, Star, TrendingUp, Mail, Phone } from "lucide-react"
import Link from "next/link"

export default function BecomeVendorPage() {
  return (
    <div className="container px-[30px] py-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold">Become a FarmShare Vendor</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join Nigeria's leading agricultural marketplace and connect directly with thousands of buyers.
            Transform your farming business with fair prices, secure payments, and unlimited growth potential.
          </p>
          <div className="flex gap-4 justify-center">
            <Badge variant="secondary" className="text-sm">No Hidden Fees</Badge>
            <Badge variant="secondary" className="text-sm">Secure Payments</Badge>
            <Badge variant="secondary" className="text-sm">Verified Buyers</Badge>
            <Badge variant="secondary" className="text-sm">Instant Support</Badge>
          </div>
        </div>

        {/* Why Join FarmShare */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Why FarmShare is Different</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We've built a platform that truly serves Nigerian farmers and agricultural businesses
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center h-full">
              <CardContent className="pt-6">
                <DollarSign className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Fair Pricing</h3>
                <p className="text-sm text-muted-foreground">
                  Set your own prices and get paid what you're worth. No middlemen taking cuts from your profits.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center h-full">
              <CardContent className="pt-6">
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Direct Access</h3>
                <p className="text-sm text-muted-foreground">
                  Connect with thousands of verified buyers across Nigeria looking for quality agricultural products.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center h-full">
              <CardContent className="pt-6">
                <Shield className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Payment Protection</h3>
                <p className="text-sm text-muted-foreground">
                  Your money is held securely in escrow until delivery is confirmed. No more payment defaults.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center h-full">
              <CardContent className="pt-6">
                <TrendingUp className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Business Growth</h3>
                <p className="text-sm text-muted-foreground">
                  Scale your operations with bulk orders, build your reputation, and grow sustainably.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Success Metrics */}
        <Card className="bg-gradient-to-r from-accent/10 to-primary/10">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold">Trusted by Nigerian Farmers</h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div>
                  <div className="text-3xl font-bold text-accent">2,500+</div>
                  <p className="text-sm text-muted-foreground">Active Vendors</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent">₦500M+</div>
                  <p className="text-sm text-muted-foreground">Monthly Transactions</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent">98%</div>
                  <p className="text-sm text-muted-foreground">Satisfaction Rate</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent">24h</div>
                  <p className="text-sm text-muted-foreground">Average Payout Time</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vendor Requirements */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Vendor Requirements</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Simple verification process to ensure quality and trust in our marketplace
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-accent" />
                  Business Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Registered Agricultural Business</p>
                      <p className="text-sm text-muted-foreground">Must be legally registered in Nigeria with CAC</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Minimum 1 Year Experience</p>
                      <p className="text-sm text-muted-foreground">Proven track record in agricultural production</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Production Capacity</p>
                      <p className="text-sm text-muted-foreground">Ability to fulfill bulk orders consistently</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Quality Standards</p>
                      <p className="text-sm text-muted-foreground">Commitment to quality and timely delivery</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-accent" />
                  Required Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Badge variant="secondary" className="mt-0.5">Required</Badge>
                    <div>
                      <p className="font-medium">CAC Certificate</p>
                      <p className="text-sm text-muted-foreground">Certificate of incorporation</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge variant="secondary" className="mt-0.5">Required</Badge>
                    <div>
                      <p className="font-medium">Tax ID (TIN)</p>
                      <p className="text-sm text-muted-foreground">Tax Identification Number</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge variant="secondary" className="mt-0.5">Required</Badge>
                    <div>
                      <p className="font-medium">Valid Government ID</p>
                      <p className="text-sm text-muted-foreground">National ID, Driver's License, or Passport</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-0.5">Optional</Badge>
                    <div>
                      <p className="font-medium">Quality Certifications</p>
                      <p className="text-sm text-muted-foreground">Organic, GlobalG.A.P, or other certifications</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Anti-Fraud Protection */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <Shield className="h-5 w-5" />
              Anti-Fraud Protection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">Our Commitment</h3>
                <ul className="space-y-2 text-sm text-red-800">
                  <li>• All documents are thoroughly verified</li>
                  <li>• Physical farm verification when needed</li>
                  <li>• Background checks on all vendors</li>
                  <li>• Secure payment escrow system</li>
                  <li>• 24/7 monitoring for suspicious activities</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-3">Zero Tolerance Policy</h3>
                <p className="text-sm text-red-800 mb-3">
                  We have zero tolerance for fraud. Any vendor found providing false information,
                  engaging in fraudulent activities, or misrepresenting their products will face:
                </p>
                <ul className="space-y-2 text-sm text-red-800">
                  <li>• Immediate and permanent ban from FarmShare</li>
                  <li>• Legal action and prosecution</li>
                  <li>• Reporting to relevant authorities</li>
                  <li>• Blacklisting from partner platforms</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Verification Process */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Simple Verification Process</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get verified and start selling in 3-5 business days
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-white text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold mb-2">Submit Application</h3>
              <p className="text-sm text-muted-foreground">
                Complete the online form and upload required documents
              </p>
            </div>
            <div className="text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-white text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold mb-2">Document Review</h3>
              <p className="text-sm text-muted-foreground">
                Our team reviews and verifies your documents within 1-2 days
              </p>
            </div>
            <div className="text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-white text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold mb-2">Verification</h3>
              <p className="text-sm text-muted-foreground">
                Physical verification if needed (additional 1-2 days)
              </p>
            </div>
            <div className="text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-white text-xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="font-semibold mb-2">Start Selling</h3>
              <p className="text-sm text-muted-foreground">
                Get approved and start creating pools immediately
              </p>
            </div>
          </div>
        </section>

        {/* What You Can Sell */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">What You Can Sell</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Wide range of agricultural products welcomed on our platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Grains & Cereals</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Rice (all varieties)</li>
                  <li>• Maize & Corn</li>
                  <li>• Sorghum & Millet</li>
                  <li>• Wheat & Barley</li>
                  <li>• Beans & Legumes</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Produce & Vegetables</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Tomatoes & Peppers</li>
                  <li>• Onions & Garlic</li>
                  <li>• Leafy Vegetables</li>
                  <li>• Root Vegetables</li>
                  <li>• Fresh Fruits</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Specialty Products</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Organic Produce</li>
                  <li>• Heritage Varieties</li>
                  <li>• Processed Foods</li>
                  <li>• Herbs & Spices</li>
                  <li>• Nuts & Seeds</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Success Stories */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Success Stories</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hear from farmers who have transformed their businesses with FarmShare
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  "FarmShare helped me increase my income by 40%. I used to sell to middlemen who paid very little, now I deal directly with buyers who appreciate quality."
                </p>
                <div>
                  <p className="font-medium">Ahmed Ibrahim</p>
                  <p className="text-sm text-muted-foreground">Rice Farmer, Kebbi State</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  "The payment protection is amazing. I always get paid on time, and the escrow system gives me confidence to deliver large orders."
                </p>
                <div>
                  <p className="font-medium">Funke Adebayo</p>
                  <p className="text-sm text-muted-foreground">Tomato Farmer, Oyo State</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  "My cooperative has grown from 10 to 50 farmers since joining FarmShare. We now supply to major buyers across Nigeria."
                </p>
                <div>
                  <p className="font-medium">Michael Okonkwo</p>
                  <p className="text-sm text-muted-foreground">Cooperative Leader, Anambra State</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-accent to-primary text-white">
          <CardContent className="text-center py-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Grow Your Agricultural Business?</h2>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto text-lg">
              Join thousands of successful farmers who are already selling on FarmShare.
              Start your verification journey today and connect with buyers across Nigeria.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/auth?role=vendor">Start Your Application</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary" asChild>
                <Link href="/vendor/guide">Read Vendor Guide</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Common questions about becoming a FarmShare vendor</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How much does it cost to join?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Registration and verification are completely free. We only charge a small commission
                  (2-5%) on successful transactions. No hidden fees or monthly charges.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How long does verification take?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Most applications are approved within 3-5 business days. Complex cases or those requiring
                  physical verification may take up to 7 business days.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I sell from anywhere in Nigeria?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! We welcome vendors from all 36 states and the FCT. We have buyers across Nigeria
                  and can help coordinate logistics for any location.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What if I have a problem with a buyer?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our support team mediates all disputes. We investigate each case thoroughly and
                  ensure fair resolution based on evidence provided by both parties.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact Support */}
        <Card>
          <CardContent className="text-center py-8">
            <h3 className="text-2xl font-bold mb-4">Need Help Getting Started?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Our vendor support team is here to help you through every step of the process
            </p>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-accent" />
                  <span className="font-medium">Live Chat Support</span>
                </div>
                <p className="text-sm text-muted-foreground">Available Mon-Fri, 9AM-6PM</p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Mail className="h-5 w-5 text-accent" />
                  <span className="font-medium">Email Support</span>
                </div>
                <p className="text-sm text-muted-foreground">vendors@farmshare.ng</p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Phone className="h-5 w-5 text-accent" />
                  <span className="font-medium">Phone Support</span>
                </div>
                <p className="text-sm text-muted-foreground">+234 800 123 4567</p>
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" asChild>
                <Link href="/vendor/guide">Read Vendor Guide</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/buyer/faq">View FAQ</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}