"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CreditCard, Truck, MapPin, Info } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface CheckoutModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pool: {
    id: string | string[]
    product_name: string
    price_per_slot: number
    allow_home_delivery: boolean
    home_delivery_cost?: number
    pickup_location: string
  }
}

export function CheckoutModal({ open, onOpenChange, pool }: CheckoutModalProps) {
  const router = useRouter()
  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "delivery">("pickup")
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const slotPrice = pool.price_per_slot
  const deliveryCost = deliveryMethod === "delivery" ? pool.home_delivery_cost || 0 : 0
  const subtotal = slotPrice + deliveryCost
  const platformFee = subtotal * 0.02 // 2% platform fee for buyers
  const total = subtotal + platformFee

  const handleCheckout = async () => {
    setIsProcessing(true)

    try {
      // TODO: Replace with actual Paystack integration
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock Paystack checkout
      console.log("Processing payment:", {
        amount: total,
        email: "buyer@example.com",
        metadata: {
          pool_id: pool.id,
          delivery_method: deliveryMethod,
          delivery_address: deliveryAddress,
          phone_number: phoneNumber,
        },
      })

      // Redirect to success page
      router.push("/buyer/orders?status=success")
      onOpenChange(false)
    } catch (error) {
      console.error("Payment failed:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Complete Your Purchase</DialogTitle>
          <DialogDescription>Review your order and choose delivery method</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <div className="space-y-3">
            <h3 className="font-semibold">Order Summary</h3>
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">{pool.product_name}</span>
                <span className="text-sm font-medium">₦{slotPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>1 slot</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Delivery Method */}
          <div className="space-y-3">
            <h3 className="font-semibold">Delivery Method</h3>
            <RadioGroup value={deliveryMethod} onValueChange={(value: any) => setDeliveryMethod(value)}>
              <div className="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                <RadioGroupItem value="pickup" id="pickup" />
                <div className="flex-1">
                  <Label htmlFor="pickup" className="cursor-pointer">
                    <div className="flex items-center gap-2 font-medium">
                      <MapPin className="h-4 w-4" />
                      Pickup
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{pool.pickup_location}</p>
                    <p className="text-sm font-medium mt-1">Free</p>
                  </Label>
                </div>
              </div>

              {pool.allow_home_delivery && (
                <div className="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value="delivery" id="delivery" />
                  <div className="flex-1">
                    <Label htmlFor="delivery" className="cursor-pointer">
                      <div className="flex items-center gap-2 font-medium">
                        <Truck className="h-4 w-4" />
                        Home Delivery
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Delivered to your address</p>
                      <p className="text-sm font-medium mt-1">+₦{pool.home_delivery_cost?.toLocaleString()}</p>
                    </Label>
                  </div>
                </div>
              )}
            </RadioGroup>
          </div>

          {/* Delivery Address */}
          {deliveryMethod === "delivery" && (
            <div className="space-y-2">
              <Label htmlFor="address">Delivery Address</Label>
              <Textarea
                id="address"
                placeholder="Enter your full delivery address..."
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                rows={3}
                required
              />
            </div>
          )}

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="080XXXXXXXX"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">For delivery coordination and updates</p>
          </div>

          <Separator />

          {/* Price Breakdown */}
          <div className="space-y-3">
            <h3 className="font-semibold">Payment Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Slot price</span>
                <span>₦{slotPrice.toLocaleString()}</span>
              </div>
              {deliveryCost > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery fee</span>
                  <span>₦{deliveryCost.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Platform fee (2%)</span>
                <span>₦{platformFee.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span className="text-primary">₦{total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Info Alert */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Your payment is held securely by Paystack until the pool fills and products are delivered. Full refund if
              the pool doesn't fill or vendor fails to deliver.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            onClick={handleCheckout}
            disabled={isProcessing || !phoneNumber || (deliveryMethod === "delivery" && !deliveryAddress)}
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Pay ₦{total.toLocaleString()}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
