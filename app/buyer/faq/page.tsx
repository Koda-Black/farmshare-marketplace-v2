import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Phone, Mail, Clock, DollarSign, Package, Users, Shield, Truck } from "lucide-react"
import Link from "next/link"

export default function BuyerFAQPage() {
  return (
    <div className="container px-[30px] py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Buyer FAQ</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about buying agricultural products on FarmShare
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Shield className="h-8 w-8 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold">100%</div>
              <p className="text-sm text-muted-foreground">Verified Vendors</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <DollarSign className="h-8 w-8 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold">Secure</div>
              <p className="text-sm text-muted-foreground">Payment Protection</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Truck className="h-8 w-8 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold">Fast</div>
              <p className="text-sm text-muted-foreground">Delivery</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Package className="h-8 w-8 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold">Quality</div>
              <p className="text-sm text-muted-foreground">Guaranteed</p>
            </CardContent>
          </Card>
        </div>

        {/* Main FAQs */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How does pool buying work?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Pool buying allows multiple buyers to purchase agricultural products together to access wholesale prices.
                  When you join a pool, you're reserving a portion (slot) of the total product quantity. Once all slots are filled
                  and the pool is complete, the vendor prepares and delivers the products to all buyers.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What happens if a pool doesn't fill?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  If a pool doesn't reach its target quantity by the deadline, all buyers automatically receive a full refund
                  to their original payment method. You'll be notified via email, and no action is needed on your part.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How do I pay for my order?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We accept payments through Paystack and Stripe, supporting various payment methods including:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                  <li>Debit and Credit Cards</li>
                  <li>Bank Transfer</li>
                  <li>USSD (for Nigerian banks)</li>
                  <li>Mobile Wallets</li>
                </ul>
                <p className="text-muted-foreground mt-2">
                  Your payment is held securely in escrow until you confirm receipt of your products.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I choose the number of slots I want?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! You can purchase multiple slots in a pool, up to a maximum of 10 slots per order. Simply adjust the
                  quantity using the +/- buttons in the checkout modal, and the total price will be calculated automatically.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What delivery options are available?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We offer two delivery options:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                  <li><strong>Pickup:</strong> Collect your products from the vendor's specified location at no additional cost</li>
                  <li><strong>Home Delivery:</strong> Have products delivered to your address for a small additional fee</li>
                </ul>
                <p className="text-muted-foreground mt-2">
                  Delivery costs are shared among all buyers who choose home delivery, making it more affordable for everyone.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How long does delivery take?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Delivery timelines vary by product and vendor, but typically range from 3-7 days after a pool fills.
                  The exact delivery timeframe is shown in each pool's details. You'll receive notifications about your order status.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What if I'm not satisfied with the products?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We have a quality guarantee system. If you receive products that don't match the description or quality standards:
                </p>
                <ol className="list-decimal list-inside mt-2 space-y-1 text-muted-foreground">
                  <li>Document the issue with photos</li>
                  <li>Contact our support team within 24 hours of delivery</li>
                  <li>We'll investigate and mediate with the vendor</li>
                  <li>If valid, you'll receive a full or partial refund</li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How are vendors verified?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  All vendors undergo a thorough verification process including:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                  <li>Business registration verification</li>
                  <li>Identity verification</li>
                  <li>Location verification</li>
                  <li>Quality assessment of products</li>
                  <li>Reference checks</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I cancel my order?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  You can cancel your order and receive a full refund if:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                  <li>The pool hasn't filled yet</li>
                  <li>The delivery deadline hasn't passed</li>
                </ul>
                <p className="text-muted-foreground mt-2">
                  Once a pool fills and the vendor begins preparation, cancellations may not be possible.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How are prices determined?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Prices are set by vendors based on:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                  <li>Current market rates</li>
                  <li>Product quality and grade</li>
                  <li>Seasonal availability</li>
                  <li>Production and handling costs</li>
                </ul>
                <p className="text-muted-foreground mt-2">
                  Pool prices typically represent 20-40% savings compared to retail prices.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What fees does FarmShare charge?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  FarmShare charges a small 2% platform fee on buyer transactions. This fee is included in the total price
                  shown before you confirm your purchase. There are no hidden fees or charges.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How do I track my order?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  You can track your order status in your dashboard:
                </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                    <li>Order placed and payment confirmed</li>
                    <li>Pool filling progress</li>
                    <li>Order processing (when pool fills)</li>
                    <li>Shipment and delivery updates</li>
                  </ul>
                <p className="text-muted-foreground mt-2">
                  You'll receive email and SMS notifications at each stage.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Support Options */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center">Still Have Questions?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-accent" />
                  <CardTitle className="text-lg">Live Chat</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Chat with our support team for instant help with your questions.
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Available: Mon-Fri, 9AM-6PM
                </p>
                <Button variant="outline" className="w-full">
                  Start Chat
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-accent" />
                  <CardTitle className="text-lg">Email Support</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Send us an email and we'll respond within 24 hours.
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  support@farmshare.ng
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/contact">Send Email</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-accent" />
                  <CardTitle className="text-lg">Phone Support</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Call us for urgent assistance with your orders.
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  +234 800 123 4567
                </p>
                <Button variant="outline" className="w-full" disabled>
                  Call Us
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Tips */}
        <Card className="bg-gradient-to-r from-accent/10 to-primary/10">
          <CardHeader>
            <CardTitle className="text-2xl">Pro Tips for Buyers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Before Buying</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Badge variant="secondary" className="mt-0.5">1</Badge>
                    <span>Read vendor reviews and ratings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="secondary" className="mt-0.5">2</Badge>
                    <span>Check product specifications carefully</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="secondary" className="mt-0.5">3</Badge>
                    <span>Compare prices across different pools</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="secondary" className="mt-0.5">4</Badge>
                    <span>Consider delivery timelines and costs</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold">After Purchase</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Badge variant="secondary" className="mt-0.5">1</Badge>
                    <span>Track pool filling progress</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="secondary" className="mt-0.5">2</Badge>
                    <span>Prepare for delivery (storage space)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="secondary" className="mt-0.5">3</Badge>
                    <span>Inspect products upon receipt</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="secondary" className="mt-0.5">4</Badge>
                    <span>Leave feedback to help other buyers</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="bg-primary/5">
          <CardContent className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">Ready to Start Buying?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of smart buyers who are saving money on quality agricultural products through FarmShare.
            </p>
            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/marketplace">Browse Available Pools</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}