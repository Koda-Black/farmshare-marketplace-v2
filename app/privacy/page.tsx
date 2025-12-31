import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function PrivacyPage() {
  return (
    <div className="container px-[30px] py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Privacy Content */}
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>1. Information We Collect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">1.1 Personal Information</h4>
                  <p className="text-muted-foreground">
                    When you register for FarmShare, we collect information such as your name, email address,
                    phone number, and location. For vendors, we may collect additional business information
                    including business registration documents and bank account details.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">1.2 Transaction Information</h4>
                  <p className="text-muted-foreground">
                    We collect information about your transactions, including pool participation, payment details,
                    delivery addresses, and purchase history to facilitate our services.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">1.3 Technical Information</h4>
                  <p className="text-muted-foreground">
                    We automatically collect certain technical information such as IP address, browser type,
                    device information, and usage patterns to improve our service and security.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. How We Use Your Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">We use your information to:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Provide and maintain our platform services</li>
                  <li>Process transactions and facilitate payments</li>
                  <li>Verify vendor credentials and ensure platform security</li>
                  <li>Communicate with you about orders and platform updates</li>
                  <li>Provide customer support and resolve disputes</li>
                  <li>Improve our services and develop new features</li>
                  <li>Comply with legal obligations and protect against fraud</li>
                  <li>Analyze usage patterns to optimize user experience</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Information Sharing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">3.1 Third-Party Service Providers</h4>
                  <p className="text-muted-foreground">
                    We share information with trusted third-party service providers to facilitate our services,
                    including payment processors (Paystack, Stripe), delivery services, and identity verification
                    services. These providers are contractually obligated to protect your information.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">3.2 Other Users</h4>
                  <p className="text-muted-foreground">
                    Certain information is shared with other users as necessary to complete transactions,
                    such as vendor business information (for buyers) and buyer delivery information (for vendors).
                    Payment information is never shared between users.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">3.3 Legal Requirements</h4>
                  <p className="text-muted-foreground">
                    We may disclose your information if required by law, court order, or to protect our rights,
                    property, or safety, or that of our users or the public.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Data Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">4.1 Security Measures</h4>
                  <p className="text-muted-foreground">
                    We implement industry-standard security measures including SSL encryption, secure data storage,
                    regular security audits, and access controls to protect your information from unauthorized
                    access, use, or disclosure.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">4.2 Payment Security</h4>
                  <p className="text-muted-foreground">
                    Payment information is processed through secure third-party payment gateways and is never
                    stored on our servers. We comply with PCI DSS standards for payment processing security.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Cookies and Tracking Technologies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">5.1 Essential Cookies</h4>
                  <p className="text-muted-foreground">
                    We use essential cookies to provide basic functionality, maintain your session, and remember
                    your preferences. These cookies are necessary for our platform to function.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">5.2 Analytics Cookies</h4>
                  <p className="text-muted-foreground">
                    We use analytics tools to understand how our platform is used, identify popular features,
                    and improve user experience. This information is aggregated and anonymized.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">5.3 Marketing Cookies</h4>
                  <p className="text-muted-foreground">
                    With your consent, we may use marketing cookies to show you relevant advertisements and
                    personalize your experience on our platform and third-party sites.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Your Rights and Choices</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">6.1 Access and Correction</h4>
                  <p className="text-muted-foreground">
                    You have the right to access and update your personal information through your account settings.
                    You may also request changes or corrections by contacting our support team.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">6.2 Data Deletion</h4>
                  <p className="text-muted-foreground">
                    You can request deletion of your account and personal information, subject to legal requirements
                    and the need to retain certain information for business and legal purposes.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">6.3 Communication Preferences</h4>
                  <p className="text-muted-foreground">
                    You can manage your communication preferences in your account settings or opt-out of marketing
                    communications by clicking the unsubscribe link in our emails.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Data Retention</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We retain your personal information for as long as necessary to provide our services, comply
                  with legal obligations, resolve disputes, and enforce our agreements. Transaction records are
                  retained for longer periods to comply with financial regulations and for accounting purposes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>8. International Data Transfers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Your information may be transferred to and processed in countries other than Nigeria. When this
                  occurs, we ensure appropriate safeguards are in place to protect your data in accordance with
                  applicable data protection laws.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>9. Children's Privacy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  FarmShare is not intended for children under 18 years of age. We do not knowingly collect
                  personal information from children. If we become aware that we have collected such information,
                  we will take steps to delete it immediately.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>10. Changes to This Policy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We may update this privacy policy from time to time. We will notify you of significant changes
                  via email or platform notifications. Your continued use of our services after such changes
                  constitutes acceptance of the updated policy.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>11. Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  If you have questions about this Privacy Policy or wish to exercise your rights, please contact us:<br />
                  Email: privacy@farmshare.ng<br />
                  Phone: +234 800 123 4567<br />
                  Address: 123 Farmhouse Road, Ikoyi, Lagos State, Nigeria<br />
                  Data Protection Officer: dpo@farmshare.ng
                </p>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}