"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, CreditCard, Smartphone, Truck, Package, CheckCircle } from "lucide-react"
import { usePayments } from "@/hooks/use-payments"
import { useStore } from "@/lib/store"

interface PaymentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pool: any
  availableSlots: number
  onSuccess?: (subscription: any) => void
  onError?: (error: string) => void
}

export function PaymentModal({ open, onOpenChange, pool, availableSlots, onSuccess, onError }: PaymentModalProps) {
  const { user } = useStore()
  const { initiatePayment, calculateTotalAmount, loading } = usePayments()

  // Form state
  const [selectedSlots, setSelectedSlots] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState<'STRIPE' | 'PAYSTACK'>('PAYSTACK')
  const [waybillWithin, setWaybillWithin] = useState(false)
  const [waybillOutside, setWaybillOutside] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Calculate total amount
  const totalAmount = calculateTotalAmount(pool, selectedSlots, waybillWithin, waybillOutside)
  const itemCost = Number(pool.price_per_slot) * selectedSlots
  const deliveryFee = totalAmount.deliveryFee

  // Handle payment initiation
  const handlePayment = async () => {
    if (!user) {
      onError?.("Please log in to continue with payment")
      return
    }

    setIsProcessing(true)
    try {
      const response = await initiatePayment({
        method: paymentMethod,
        poolId: pool.id,
        slots: selectedSlots,
        waybillWithin,
        waybillOutside,
      })

      // Redirect to payment gateway
      if (response.url) {
        window.open(response.url, '_blank') || window.location.href = response.url;
      }

      onSuccess?.(response)
    } catch (error: any) {
      console.error("Payment failed:", error)
      onError?.(error.message || "Payment failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const isFormValid = selectedSlots > 0 && selectedSlots <= availableSlots

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Complete Your Purchase</DialogTitle>
          <DialogDescription>
            Join the pool for {pool.product_name} from {pool.vendor?.name || "Vendor"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Pool Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Pool Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Product</span>
                <span className="font-medium">{pool.product_name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Vendor</span>
                <span className="font-medium">{pool.vendor?.name || "Unknown"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Price per Slot</span>
                <span className="font-medium">₦{Number(pool.price_per_slot).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Available Slots</span>
                <Badge variant="secondary">{availableSlots} remaining</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Delivery Deadline</span>
                <span className="font-medium">
                  {new Date(pool.delivery_deadline).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Slot Selection */}
          <div className="space-y-3">
            <Label>Number of Slots</Label>
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: Math.min(4, availableSlots) }, (_, i) => i + 1).map((slots) => (
                <Button
                  key={slots}
                  variant={selectedSlots === slots ? "default" : "outline"}
                  onClick={() => setSelectedSlots(slots)}
                  className="h-12"
                >
                  {slots}
                </Button>
              ))}
            </div>
            {availableSlots > 4 && (
              <p className="text-xs text-muted-foreground">
                {availableSlots} slots available in total
              </p>
            )}
          </div>

          {/* Delivery Options */}
          <div className="space-y-3">
            <Label>Delivery Options</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="waybillWithin"
                  checked={waybillWithin}
                  onChange={(e) => setWaybillWithin(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="waybillWithin" className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Delivery within Lagos (₦5,000)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="waybillOutside"
                  checked={waybillOutside}
                  onChange={(e) => setWaybillOutside(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="waybillOutside" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Delivery outside Lagos (₦10,000)
                </Label>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-3">
            <Label>Payment Method</Label>
            <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'STRIPE' | 'PAYSTACK')}>
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="PAYSTACK" id="paystack" />
                <Label htmlFor="paystack" className="flex items-center gap-2 cursor-pointer flex-1">
                  <Smartphone className="h-4 w-4" />
                  <div>
                    <p className="font-medium">Paystack</p>
                    <p className="text-xs text-muted-foreground">Pay with card, bank transfer, or USSD</p>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="STRIPE" id="stripe" />
                <Label htmlFor="stripe" className="flex items-center gap-2 cursor-pointer flex-1">
                  <CreditCard className="h-4 w-4" />
                  <div>
                    <p className="font-medium">Stripe</p>
                    <p className="text-xs text-muted-foreground">Pay with credit/debit card</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Order Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Item Cost ({selectedSlots} slot{selectedSlots > 1 ? 's' : ''})</span>
                <span className="font-medium">₦{itemCost.toLocaleString()}</span>
              </div>
              {deliveryFee > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Delivery Fee</span>
                  <span className="font-medium">₦{deliveryFee.toLocaleString()}</span>
                </div>
              )}
              <Separator />
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total</span>
                <span>₦{totalAmount.total.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Important Notice */}
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Payment Security:</strong> Your payment is processed securely through {paymentMethod}.
              Funds are held in escrow until the pool is successfully completed and delivered.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            onClick={handlePayment}
            disabled={!isFormValid || isProcessing || loading}
            className="min-w-[140px]"
          >
            {isProcessing || loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Pay ₦{totalAmount.total.toLocaleString()}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}