"use client"

import { useState, useEffect } from "react"
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CreditCard, Smartphone, Building, CheckCircle, AlertCircle, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getWindowOrigin, isClient } from "@/lib/client-utils"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PaymentFormProps {
  paymentData: {
    method: 'STRIPE' | 'PAYSTACK'
    amount: number
    email: string
    poolName: string
    reference?: string
    clientSecret?: string
    authorization_url?: string
    access_code?: string
  }
  onSuccess: (data: any) => void
  onError: (error: string) => void
  onCancel: () => void
}

// Stripe Payment Form Component
function StripePaymentForm({ clientSecret, onSuccess, onError }: {
  clientSecret: string
  onSuccess: (data: any) => void
  onError: (error: string) => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${getWindowOrigin()}/payment/success`,
        },
        redirect: 'if_required',
      })

      if (error) {
        onError(error.message || 'Payment failed')
      } else if (paymentIntent?.status === 'succeeded') {
        onSuccess({ paymentIntent, status: 'succeeded' })
      }
    } catch (err: any) {
      onError(err.message || 'Payment failed')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Card Details</Label>
        <PaymentElement />
      </div>

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          'Pay with Stripe'
        )}
      </Button>
    </form>
  )
}

// Paystack Payment Form Component
function PaystackPaymentForm({
  email,
  amount,
  reference,
  poolName,
  onSuccess,
  onError
}: {
  email: string
  amount: number
  reference?: string
  poolName: string
  onSuccess: (data: any) => void
  onError: (error: string) => void
}) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePayment = async () => {
    // Only run on client side
    if (!isClient) {
      onError('Payment can only be processed on client side')
      return
    }

    setIsProcessing(true)

    try {
      // Load Paystack script dynamically
      const script = document.createElement('script')
      script.src = 'https://js.paystack.co/v1/inline.js'
      script.async = true

      script.onload = () => {
        const handler = (window as any).PaystackPop.setup({
          key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
          email: email,
          amount: amount * 100, // Convert to kobo
          currency: 'NGN',
          ref: reference,
          metadata: {
            poolName: poolName,
            custom_fields: [
              {
                display_name: "Pool Purchase",
                variable_name: "pool_purchase",
                value: poolName
              }
            ]
          },
          callback: (response: any) => {
            onSuccess(response)
          },
          onClose: () => {
            setIsProcessing(false)
            onError('Payment cancelled')
          }
        })

        handler.openIframe()
      }

      script.onerror = () => {
        setIsProcessing(false)
        onError('Failed to load payment gateway')
      }

      document.body.appendChild(script)

    } catch (error: any) {
      setIsProcessing(false)
      onError(error.message || 'Payment failed')
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <Label className="text-base font-semibold">Paystack Payment Options</Label>
        <p className="text-sm text-muted-foreground">
          You'll be able to choose from multiple payment options including card, bank transfer, USSD, and more on the secure payment page.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="p-3 border rounded-lg">
          <CreditCard className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm font-medium">Card</p>
        </div>
        <div className="p-3 border rounded-lg">
          <Building className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm font-medium">Bank Transfer</p>
        </div>
        <div className="p-3 border rounded-lg">
          <Smartphone className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm font-medium">USSD</p>
        </div>
        <div className="p-3 border rounded-lg">
          <Smartphone className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm font-medium">QR Code</p>
        </div>
      </div>

      <Button
        onClick={handlePayment}
        disabled={isProcessing}
        className="w-full"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading Payment...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Pay with Paystack
          </>
        )}
      </Button>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="text-xs">
          You will be redirected to Paystack's secure payment page where you can choose from multiple payment options including card payments, bank transfers, USSD, and mobile money.
        </AlertDescription>
      </Alert>
    </div>
  )
}

// Main Payment Form Component
export function PaymentForm({ paymentData, onSuccess, onError, onCancel }: PaymentFormProps) {
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePaymentSuccess = async (response: any) => {
    setIsProcessing(false)

    // Show success message
    toast({
      title: "Payment Successful!",
      description: `Thank you for your purchase. You will receive a confirmation shortly.`,
    })

    // Call parent success handler
    onSuccess(response)

    // Show receipt message (this would be enhanced with actual receipt data)
    setTimeout(() => {
      toast({
        title: "Receipt Generated",
        description: `Payment of ₦${paymentData.amount.toLocaleString()} has been processed successfully.`,
      })
    }, 2000)
  }

  const handlePaymentError = (errorMessage: string) => {
    setIsProcessing(false)
    toast({
      title: "Payment Failed",
      description: errorMessage,
      variant: "destructive",
    })
    onError(errorMessage)
  }

  if (paymentData.method === 'STRIPE' && paymentData.clientSecret) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">Complete Your Payment</h3>
          <p className="text-muted-foreground text-sm">
            Pay ₦{paymentData.amount.toLocaleString()} for {paymentData.poolName}
          </p>
        </div>

        <Elements stripe={stripePromise} options={{ clientSecret: paymentData.clientSecret }}>
          <StripePaymentForm
            clientSecret={paymentData.clientSecret}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        </Elements>

        <div className="flex justify-center">
          <Button variant="outline" onClick={onCancel} disabled={isProcessing}>
            Cancel Payment
          </Button>
        </div>
      </div>
    )
  }

  if (paymentData.method === 'PAYSTACK') {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">Complete Your Payment</h3>
          <p className="text-muted-foreground text-sm">
            Pay ₦{paymentData.amount.toLocaleString()} for {paymentData.poolName}
          </p>
        </div>

        <PaystackPaymentForm
          email={paymentData.email}
          amount={paymentData.amount}
          reference={paymentData.reference}
          poolName={paymentData.poolName}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />

        <div className="flex justify-center">
          <Button variant="outline" onClick={onCancel} disabled={isProcessing}>
            Cancel Payment
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="text-center space-y-4">
      <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
      <div>
        <h3 className="text-lg font-semibold">Payment Error</h3>
        <p className="text-muted-foreground">Invalid payment method or missing payment details.</p>
      </div>
      <Button onClick={onCancel}>Go Back</Button>
    </div>
  )
}