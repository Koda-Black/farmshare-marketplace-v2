"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, ArrowLeft, RefreshCw, Phone, Mail } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useNotifications } from "@/hooks/use-notifications"

export default function PaymentFailedPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const { createNotification } = useNotifications()
  const [errorDetails, setErrorDetails] = useState<any>(null)

  useEffect(() => {
    const reference = searchParams.get('reference')
    const error = searchParams.get('error')
    const reason = searchParams.get('reason')

    const errorDetails = {
      reference,
      error,
      reason: reason || 'Payment could not be completed'
    }

    setErrorDetails(errorDetails)

    toast({
      title: "Payment Failed",
      description: "Your payment could not be processed. Please try again or contact support.",
      variant: "destructive",
    })

    // Create in-app notification for failed payment
    createNotification({
      type: 'PAYMENT',
      title: 'Payment Failed',
      message: `Your payment${reference ? ` (ref: ${reference})` : ''} could not be processed. ${errorDetails.reason}`,
      metadata: {
        reference,
        error,
        reason: errorDetails.reason
      }
    })
  }, [searchParams])

  const handleRetryPayment = () => {
    // Go back to the previous page or checkout
    router.back()
  }

  const handleContactSupport = () => {
    router.push('/contact')
  }

  const handleBrowsePools = () => {
    router.push('/marketplace')
  }

  return (
    <div className="container px-[30px] py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-red-600">Payment Failed</h1>
            <p className="text-muted-foreground">
              We couldn't process your payment. Don't worry, you haven't been charged.
            </p>
          </div>
        </div>

        {/* Error Details */}
        {errorDetails && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-red-600">Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {errorDetails.reference && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reference:</span>
                  <span className="font-mono text-sm">{errorDetails.reference}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant="destructive">Failed</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reason:</span>
                <span className="text-sm text-red-600">{errorDetails.reason}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Common Issues */}
        <Card>
          <CardHeader>
            <CardTitle>Common Issues & Solutions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="font-medium">Payment Method Issues</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Check if your card is valid and has sufficient funds</li>
                  <li>• Ensure your card supports online payments</li>
                  <li>• Try a different payment method</li>
                  <li>• Contact your bank if the issue persists</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-medium">Technical Issues</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Check your internet connection</li>
                  <li>• Disable popup blockers</li>
                  <li>• Try using a different browser</li>
                  <li>• Clear your browser cache and cookies</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h2 className="text-xl font-semibold text-blue-800">Need Help?</h2>
              <p className="text-blue-700">
                Our support team is here to help you complete your purchase successfully.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center justify-center gap-2">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-blue-800">+234 800 123 4567</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-blue-800">support@farmshare.ng</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Button onClick={handleRetryPayment} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button variant="outline" onClick={handleContactSupport} className="w-full">
              Contact Support
            </Button>
          </div>
          <Button variant="outline" onClick={handleBrowsePools} className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Browse Other Pools
          </Button>
        </div>

        {/* Assurance */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <h3 className="font-semibold">Payment Security & Assurance</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground text-left">
                <div>
                  <p className="mb-2">✅ Your payment information is secure</p>
                  <p className="mb-2">✅ No charges were made to your card</p>
                  <p>✅ You can try again without any issues</p>
                </div>
                <div>
                  <p className="mb-2">✅ Secure payment gateways (Paystack/Stripe)</p>
                  <p className="mb-2">✅ PCI-DSS compliant processing</p>
                  <p>✅ Full refund guarantee if issues persist</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}