import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function TermsPage() {
  return (
    <div className="container px-[30px] py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Terms of Service</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Please read these terms and conditions carefully before using FarmShare's services.
          </p>
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Terms Content */}
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>1. Acceptance of Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing and using FarmShare ("the Platform"), you accept and agree to be bound by the terms
                  and provision of this agreement. If you do not agree to abide by the above, please do not use
                  this service.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Description of Service</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">2.1 Platform Purpose</h4>
                  <p className="text-muted-foreground">
                    FarmShare is an online marketplace that connects farmers and agricultural producers with buyers
                    through a pooled-buying system. Our platform facilitates group purchases of agricultural products
                    to ensure fair pricing and efficient distribution.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">2.2 Pool Buying System</h4>
                  <p className="text-muted-foreground">
                    Farmers create pools for agricultural products with specified quantities and target prices.
                    Buyers can purchase slots in these pools, and once a pool is filled, the transaction proceeds
                    with product delivery to buyers.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. User Responsibilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">3.1 Account Registration</h4>
                  <p className="text-muted-foreground">
                    Users must provide accurate, current, and complete information during registration. You are
                    responsible for maintaining the confidentiality of your account credentials.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">3.2 Vendor Requirements</h4>
                  <p className="text-muted-foreground">
                    Vendors must complete our verification process before creating pools. Vendors are responsible
                    for accurate product descriptions, quality assurance, and timely delivery of products.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">3.3 Buyer Responsibilities</h4>
                  <p className="text-muted-foreground">
                    Buyers must provide accurate delivery information and complete payments within the specified
                    timeframe. Buyers are responsible for accepting deliveries and reporting issues promptly.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Payment Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">4.1 Payment Processing</h4>
                  <p className="text-muted-foreground">
                    All payments are processed through secure third-party payment gateways (Paystack and Stripe).
                    Payments are held in escrow until the pool is filled and delivery conditions are met.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">4.2 Refund Policy</h4>
                  <p className="text-muted-foreground">
                    Full refunds are provided if: (a) a pool doesn't fill within the specified timeframe,
                    (b) the vendor fails to deliver products as described, or (c) products are found to be of
                    unsatisfactory quality upon delivery inspection.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">4.3 Platform Fees</h4>
                  <p className="text-muted-foreground">
                    FarmShare charges a small commission on successful transactions. The platform fee is clearly
                    displayed before payment confirmation.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Product Quality and Delivery</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">5.1 Quality Standards</h4>
                  <p className="text-muted-foreground">
                    Vendors must ensure products meet the quality standards described in the pool details.
                    FarmShare conducts verification processes but does not guarantee product quality directly.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">5.2 Delivery Terms</h4>
                  <p className="text-muted-foreground">
                    Delivery timelines are specified in each pool. Vendors are responsible for timely delivery,
                    and buyers must be available to receive deliveries. Delivery costs are clearly displayed
                    before purchase confirmation.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Dispute Resolution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">6.1 Dispute Process</h4>
                  <p className="text-muted-foreground">
                    In case of disputes, users should first attempt to resolve issues directly. If resolution
                    cannot be reached, FarmShare's dispute resolution team will mediate based on evidence provided
                    by both parties.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">6.2 Final Decisions</h4>
                  <p className="text-muted-foreground">
                    FarmShare's decisions on disputes are final and binding. We reserve the right to suspend or
                    terminate accounts that repeatedly violate platform policies.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Prohibited Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Users may not:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Provide false or misleading information</li>
                  <li>Attempt to manipulate pool prices or quantities</li>
                  <li>Use the platform for illegal activities</li>
                  <li>Circumvent payment processes or attempt fraud</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Harass or abuse other users</li>
                  <li>Share account credentials with others</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>8. Intellectual Property</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  All content, trademarks, service marks, logos, and other intellectual property on the FarmShare
                  platform belong to FarmShare or its licensors. Users may not use, copy, reproduce, or distribute
                  any intellectual property without explicit permission.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>9. Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  FarmShare shall not be liable for any indirect, incidental, special, consequential, or punitive
                  damages, including without limitation, loss of profits, data, use, goodwill, or other intangible
                  losses, resulting from your use of the service.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>10. Termination</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  FarmShare reserves the right to suspend or terminate user accounts at its sole discretion for
                  violations of these terms, fraudulent activity, or any other reason deemed necessary to protect
                  the platform and its users.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>11. Changes to Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  FarmShare reserves the right to modify these terms at any time. Users will be notified of
                  significant changes via email or platform notifications. Continued use of the service constitutes
                  acceptance of modified terms.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>12. Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  For questions about these Terms of Service, please contact us at:<br />
                  Email: legal@farmshare.ng<br />
                  Phone: +234 800 123 4567<br />
                  Address: 123 Farmhouse Road, Ikoyi, Lagos State, Nigeria
                </p>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}