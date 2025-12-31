import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Shield, Clock, AlertCircle, FileText, Upload, Users, Phone, Mail, MapPin, Star, Award } from "lucide-react"
import Link from "next/link"

export default function VerificationProcessPage() {
  const verificationSteps = [
    {
      id: 1,
      title: "Document Submission",
      description: "Upload all required business documents for initial review",
      duration: "1-2 business days",
      items: [
        "CAC Certificate of Incorporation",
        "Tax Identification Number (TIN)",
        "Valid Government ID",
        "Proof of Business Address",
        "Business Registration Details"
      ]
    },
    {
      id: 2,
      title: "Document Verification",
      description: "Our team reviews and validates all submitted documents",
      duration: "1-2 business days",
      items: [
        "Business registration verification",
        "Document authenticity checks",
        "Cross-reference with government databases",
        "Initial compliance assessment"
      ]
    },
    {
      id: 3,
      title: "Physical Verification",
      description: "On-site verification of business operations and facilities",
      duration: "1-2 business days",
      items: [
        "Business location confirmation",
        "Operational capacity assessment",
        "Facility and equipment inspection",
        "Quality control process review"
      ]
    },
    {
      id: 4,
      title: "Final Approval",
      description: "Complete verification and vendor account activation",
      duration: "1 business day",
      items: [
        "Final compliance review",
        "Vendor profile creation",
        "Marketplace access activation",
        "Welcome package delivery"
      ]
    }
  ]

  const requiredDocuments = [
    {
      category: "Business Registration",
      documents: [
        { name: "CAC Certificate", required: true, description: "Certificate of Incorporation" },
        { name: "Tax Certificate", required: true, description: "Current tax clearance certificate" },
        { name: "Business License", required: false, description: "Operational business license" }
      ]
    },
    {
      category: "Identification",
      documents: [
        { name: "Director's ID", required: true, description: "Valid government ID of primary contact" },
        { name: "Passport Photo", required: true, description: "Recent passport photograph" }
      ]
    },
    {
      category: "Address Verification",
      documents: [
        { name: "Utility Bill", required: true, description: "Recent electricity/water bill" },
        { name: "Tenancy Agreement", required: false, description: "If applicable" },
        { name: "Land Documents", required: false, description: "If business owner" }
      ]
    },
    {
      category: "Agricultural",
      documents: [
        { name: "Farm Records", required: false, description: "Production and sales records" },
        { name: "Quality Certifications", required: false, description: "Any relevant certifications" },
        { name: "Supplier References", required: false, description: "References from existing clients" }
      ]
    }
  ]

  const antiFraudMeasures = [
    {
      title: "Document Authentication",
      description: "All documents undergo rigorous verification using multiple authentication methods"
    },
    {
      title: "Physical Site Visits",
      description: "Our verification team conducts in-person visits to confirm business operations"
    },
    {
      title: "Background Checks",
      description: "Comprehensive background checks on business owners and key personnel"
    },
    {
      title: "Ongoing Monitoring",
      description: "Continuous monitoring of vendor performance and compliance"
    }
  ]

  return (
    <div className="container px-[30px] py-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold">Vendor Verification Process</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Learn about our comprehensive verification process designed to ensure trust, quality, and security
            in the FarmShare marketplace. We verify every vendor to protect buyers and maintain platform integrity.
          </p>
        </div>

        {/* Why Verification Matters */}
        <Card className="bg-gradient-to-r from-accent/10 to-primary/10">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">Why Verification Matters</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Build Trust</h3>
                  <p className="text-sm text-muted-foreground">
                    Verified badges give buyers confidence in vendor authenticity and reliability
                  </p>
                </div>
                <div className="text-center">
                  <Shield className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Prevent Fraud</h3>
                  <p className="text-sm text-muted-foreground">
                    Rigorous verification protects against fraudulent activities and scams
                  </p>
                </div>
                <div className="text-center">
                  <Award className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Ensure Quality</h3>
                  <p className="text-sm text-muted-foreground">
                    Verification ensures vendors meet our quality and operational standards
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Verification Timeline */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Verification Timeline</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Complete verification process typically takes 3-5 business days
            </p>
          </div>

          <div className="space-y-6">
            {verificationSteps.map((step, index) => (
              <div key={step.id} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white text-lg font-bold">
                    {step.id}
                  </div>
                  {index < verificationSteps.length - 1 && (
                    <div className="w-0.5 h-20 bg-border mt-3" />
                  )}
                </div>
                <Card className="flex-1">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{step.title}</CardTitle>
                        <p className="text-muted-foreground mt-1">{step.description}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {step.duration}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {step.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </section>

        {/* Required Documents */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Required Documents</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Prepare these documents to ensure smooth verification process
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {requiredDocuments.map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {category.documents.map((doc, docIndex) => (
                      <div key={docIndex} className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            {doc.required ? (
                              <Badge variant="secondary" className="text-xs">Required</Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs">Optional</Badge>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">{doc.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Anti-Fraud Protection */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <Shield className="h-5 w-5" />
              Anti-Fraud Protection Measures
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {antiFraudMeasures.map((measure, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="font-medium text-red-800">{measure.title}</h3>
                  <p className="text-sm text-red-700">{measure.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-red-100 rounded-lg">
              <h4 className="font-medium text-red-800 mb-2">Zero Tolerance Policy</h4>
              <p className="text-sm text-red-700">
                We have zero tolerance for fraudulent activities. Any vendor found providing false information,
                engaging in fraudulent activities, or misrepresenting their business will face immediate and permanent
                ban from the platform, along with potential legal action and reporting to relevant authorities.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Verification Benefits */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Benefits of Being Verified</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              What you gain after successful verification
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mx-auto mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Verified Badge</h3>
                <p className="text-sm text-muted-foreground">
                  Display the verified badge on your profile to build buyer trust and credibility
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mx-auto mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Priority Access</h3>
                <p className="text-sm text-muted-foreground">
                  Get priority access to new features, promotions, and buyer inquiries
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 mx-auto mb-4">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Enhanced Visibility</h3>
                <p className="text-sm text-muted-foreground">
                  Enjoy better visibility in search results and featured vendor placements
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Support */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Verification Support</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our team is here to help you through every step of the verification process
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <Phone className="h-8 w-8 text-accent mx-auto mb-3" />
                <h3 className="font-medium mb-2">Phone Support</h3>
                <p className="text-sm text-muted-foreground mb-2">+234 800 123 4567</p>
                <p className="text-xs">Mon-Fri, 9AM-6PM</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <Mail className="h-8 w-8 text-accent mx-auto mb-3" />
                <h3 className="font-medium mb-2">Email Support</h3>
                <p className="text-sm text-muted-foreground mb-2">verify@farmshare.ng</p>
                <p className="text-xs">Response within 24 hours</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <MapPin className="h-8 w-8 text-accent mx-auto mb-3" />
                <h3 className="font-medium mb-2">In-Person Support</h3>
                <p className="text-sm text-muted-foreground mb-2">Available in major cities</p>
                <p className="text-xs">Schedule appointment</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-accent to-primary text-white">
          <CardContent className="text-center py-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Verified?</h2>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto text-lg">
              Join our trusted network of verified agricultural vendors and start reaching thousands of buyers across Nigeria.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/become-a-vendor">Start Verification</Link>
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
            <h2 className="text-3xl font-bold">Verification FAQ</h2>
            <p className="text-muted-foreground">Common questions about our verification process</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How long does verification take?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Standard verification takes 3-5 business days. Expedited verification is available for urgent cases
                  at an additional fee and can be completed within 24-48 hours.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What if my documents are rejected?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We'll provide specific feedback on what needs to be corrected. You can resubmit documents multiple times
                  until verification is complete at no additional cost.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is my information secure?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes, we use bank-level encryption and security measures. Your information is only used for verification
                  purposes and never shared with third parties without your consent.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Do I need to renew my verification?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Verification is valid for one year. We conduct annual reviews to ensure all information remains current
                  and vendors continue to meet our standards.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}