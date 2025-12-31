"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Receipt, Truck, Calendar, User, MapPin, CreditCard } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { isClient, safeWindowPrint, safeRequestNotification, safeCreateNotification, safeWindowFocus } from "@/lib/client-utils"

interface PaymentSuccessProps {
  open: boolean
  onClose: () => void
  paymentData: {
    reference: string
    amount: number
    poolName: string
    vendorName: string
    slots: number
    deliveryMethod: 'pickup' | 'delivery'
    deliveryAddress?: string
    deliveryDate?: string
    customerName: string
    customerEmail: string
  }
}

export function PaymentSuccess({ open, onClose, paymentData }: PaymentSuccessProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [showReceipt, setShowReceipt] = useState(false)

  useEffect(() => {
    if (open) {
      // Show the main success message immediately
      toast({
        title: "🎉 Payment Successful!",
        description: `Thank you for purchasing ${paymentData.slots} slot(s) from ${paymentData.vendorName}`,
      })

      // Show the detailed confirmation after a short delay
      setTimeout(() => {
        toast({
          title: "📦 Order Confirmed",
          description: `Thank you for buying ${paymentData.slots} slot(s) from ${paymentData.vendorName} of ${paymentData.poolName} which will be delivered on ${paymentData.deliveryDate || 'the scheduled delivery date'}.`,
          duration: 8000,
        })
      }, 1500)

      // Request push notification permission and send notification (only on client side)
      if (isClient) {
        requestPushNotification()
      }
    }
  }, [open, paymentData])

  const requestPushNotification = async () => {
    const hasPermission = await safeRequestNotification()
    if (hasPermission) {
      sendPushNotification()
    }
  }

  const sendPushNotification = () => {
    const notification = safeCreateNotification('🎉 Payment Successful!', {
      body: `Your purchase of ${paymentData.slots} slot(s) for ${paymentData.poolName} has been confirmed. Delivery on ${paymentData.deliveryDate || 'scheduled date'}.`,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'payment-success',
      requireInteraction: true,
      actions: [
        {
          action: 'view-receipt',
          title: 'View Receipt'
        },
        {
          action: 'track-order',
          title: 'Track Order'
        }
      ]
    })

    if (notification) {
      notification.onclick = () => {
        safeWindowFocus()
        setShowReceipt(true)
        notification.close()
      }

      setTimeout(() => {
        notification.close()
      }, 10000)
    }
  }

  const handleViewReceipt = () => {
    setShowReceipt(true)
  }

  const handleTrackOrder = () => {
    router.push('/dashboard/orders')
    onClose()
  }

  const handleContinueShopping = () => {
    router.push('/pools')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            Payment Successful!
          </DialogTitle>
          <DialogDescription>
            Your order has been confirmed and payment is securely held in escrow.
          </DialogDescription>
        </DialogHeader>

        {!showReceipt ? (
          <div className="space-y-6">
            {/* Success Message */}
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-green-600">
                  Thank you for your purchase!
                </h3>
                <p className="text-muted-foreground mt-1">
                  {paymentData.slots} slot(s) from {paymentData.vendorName}
                </p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-4">
              <h4 className="font-semibold">Order Summary</h4>
              <div className="p-4 bg-muted rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Product</span>
                  <span className="text-sm font-medium">{paymentData.poolName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Vendor</span>
                  <span className="text-sm font-medium">{paymentData.vendorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Slots</span>
                  <span className="text-sm font-medium">{paymentData.slots}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Paid</span>
                  <span className="text-lg font-semibold text-green-600">
                    ₦{paymentData.amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Reference</span>
                  <span className="text-sm font-mono">{paymentData.reference}</span>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="space-y-4">
              <h4 className="font-semibold">Delivery Information</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">
                      {paymentData.deliveryMethod === 'pickup' ? 'Pickup' : 'Home Delivery'}
                    </p>
                    {paymentData.deliveryMethod === 'pickup' ? (
                      <p className="text-sm text-muted-foreground">
                        Pickup from vendor's location
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {paymentData.deliveryAddress}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Expected Delivery</p>
                    <p className="text-sm text-muted-foreground">
                      {paymentData.deliveryDate || 'Within 14 days after pool fills'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Important Information */}
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Your payment is securely held in escrow until the pool fills and your order is delivered.
                You're eligible for a full refund if the pool doesn't fill or if the vendor fails to deliver.
              </AlertDescription>
            </Alert>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleViewReceipt}
                variant="outline"
                className="flex-1"
              >
                <Receipt className="mr-2 h-4 w-4" />
                View Receipt
              </Button>
              <Button
                onClick={handleTrackOrder}
                variant="outline"
                className="flex-1"
              >
                Track Order
              </Button>
              <Button
                onClick={handleContinueShopping}
                className="flex-1"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        ) : (
          /* Receipt View */
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Receipt className="h-12 w-12 text-muted-foreground mx-auto" />
              <h3 className="text-xl font-semibold">Payment Receipt</h3>
              <p className="text-sm text-muted-foreground">
                Transaction ID: {paymentData.reference}
              </p>
            </div>

            {/* Receipt Details */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Customer Name</p>
                  <p className="font-medium">{paymentData.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-sm">{paymentData.customerEmail}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Product ({paymentData.slots} slot(s))</span>
                  <span className="text-sm">₦{(paymentData.amount / paymentData.slots).toLocaleString()} × {paymentData.slots}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Platform Fee (2%)</span>
                  <span className="text-sm">₦{(paymentData.amount * 0.02).toLocaleString()}</span>
                </div>
                {paymentData.deliveryMethod === 'delivery' && (
                  <div className="flex justify-between">
                    <span className="text-sm">Delivery Fee</span>
                    <span className="text-sm">₦{(paymentData.amount * 0.1).toLocaleString()}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total Paid</span>
                  <span className="text-green-600">₦{paymentData.amount.toLocaleString()}</span>
                </div>
              </div>

              <Separator />

              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <div className="flex items-center justify-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <span className="font-medium">Secure Online Payment</span>
                </div>
              </div>

              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  This receipt has been sent to your email address.
                </p>
              </div>
            </div>

            {/* Receipt Actions */}
            <div className="flex gap-3">
              <Button
                onClick={safeWindowPrint}
                variant="outline"
                className="flex-1"
              >
                Print Receipt
              </Button>
              <Button
                onClick={() => setShowReceipt(false)}
                className="flex-1"
              >
                Back to Summary
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}