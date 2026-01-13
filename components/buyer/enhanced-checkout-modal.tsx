"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  CreditCard,
  Truck,
  MapPin,
  Info,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  enhancedPaymentService,
  PaymentMethod,
  InitPaymentDto,
} from "@/lib/enhanced-payment.service";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/lib/store";

// Delivery fee constants
const INTRA_STATE_DELIVERY_FEE = 5000; // Same state as vendor
const INTER_STATE_DELIVERY_FEE = 10000; // Different state from vendor

interface EnhancedCheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pool: {
    id: string | string[];
    product_name: string;
    price_per_slot: number;
    allow_home_delivery: boolean;
    home_delivery_cost?: number;
    pickup_location: string;
    vendor_state?: string; // Vendor's state for delivery fee calculation
  };
  slots?: number;
}

export function EnhancedCheckoutModal({
  open,
  onOpenChange,
  pool,
  slots = 1,
}: EnhancedCheckoutModalProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useStore();
  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "delivery">(
    "pickup"
  );
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("PAYSTACK");
  const [selectedSlots, setSelectedSlots] = useState(slots);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<"details" | "payment">(
    "details"
  );
  const [paymentData, setPaymentData] = useState<any>(null);

  // Determine if buyer is in the same state as vendor
  const userState = user?.state || "";
  const vendorState = pool.vendor_state || "";
  const isSameState =
    userState &&
    vendorState &&
    userState.toLowerCase() === vendorState.toLowerCase();

  const slotPrice = pool.price_per_slot;
  // Use standardized delivery fees: ₦5,000 intra-state, ₦10,000 inter-state
  const deliveryCost =
    deliveryMethod === "delivery"
      ? isSameState
        ? INTRA_STATE_DELIVERY_FEE
        : INTER_STATE_DELIVERY_FEE
      : 0;
  const subtotal = slotPrice * selectedSlots;
  // Platform fee is 2% of slot cost only (not including delivery)
  const platformFee = Math.round(subtotal * 0.02);
  const total = subtotal + platformFee + deliveryCost;
  const maxSlots = 10; // Maximum slots a user can purchase at once

  const handleCheckout = async () => {
    // Validate required fields
    if (deliveryMethod === "delivery" && !deliveryAddress.trim()) {
      toast({
        title: "Delivery Address Required",
        description: "Please enter your delivery address",
        variant: "destructive",
      });
      return;
    }

    if (!phoneNumber.trim()) {
      toast({
        title: "Phone Number Required",
        description: "Please enter your phone number",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Get actual pool ID (convert to UUID if needed)
      const poolId = Array.isArray(pool.id) ? pool.id[0] : pool.id;

      // Initiate payment with backend
      // waybillWithin = intra-state delivery (₦5,000)
      // waybillOutside = inter-state delivery (₦10,000)
      const paymentRequestData: InitPaymentDto = {
        method: paymentMethod,
        poolId: poolId,
        slots: selectedSlots,
        waybillWithin: deliveryMethod === "delivery" && isSameState, // Intra-state delivery
        waybillOutside: deliveryMethod === "delivery" && !isSameState, // Inter-state delivery
      };

      const response = await enhancedPaymentService.initiatePayment(
        paymentRequestData
      );

      // Handle the response structure from backend
      if (response && (response.url || response.authorization_url)) {
        // Backend returns direct payment object
        const paymentUrl = response.url || response.authorization_url;
        const paymentInfo = {
          ...response,
          paymentUrl: paymentUrl,
          reference: response.reference,
          sessionId: response.sessionId,
          pendingId: response.pendingId,
        };

        setPaymentData(paymentInfo);
        setPaymentStep("payment");

        // Store pool ID in localStorage for success page to use
        const poolId = Array.isArray(pool.id) ? pool.id[0] : pool.id;
        localStorage.setItem("lastPurchasedPoolId", poolId);

        // Handle different payment methods
        if (paymentMethod === "STRIPE" && paymentUrl) {
          // Redirect to Stripe checkout
          window.location.href = paymentUrl;
        } else if (paymentMethod === "PAYSTACK" && paymentUrl) {
          // Redirect to Paystack checkout
          window.location.href = paymentUrl;
        }
      } else if (response && response.success && response.data) {
        // Handle wrapped response format (fallback)
        setPaymentData(response.data);
        setPaymentStep("payment");

        if (paymentMethod === "STRIPE" && response.data.paymentUrl) {
          window.location.href = response.data.paymentUrl;
        } else if (paymentMethod === "PAYSTACK" && response.data.paymentUrl) {
          window.location.href = response.data.paymentUrl;
        }
      } else {
        console.error("Unexpected response structure:", response);
        throw new Error(
          response?.message || "Payment initiation failed - invalid response"
        );
      }
    } catch (error: any) {
      console.error("Payment failed:", error);
      toast({
        title: "Payment Failed",
        description:
          error.message || "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStripeElements = async (clientSecret: string) => {
    // This would integrate with Stripe Elements for a more seamless experience
    // For now, we'll redirect to the hosted checkout page
    toast({
      title: "Stripe Payment",
      description: "Redirecting to secure payment page...",
    });
  };

  const handleBackToDetails = () => {
    setPaymentStep("details");
    setPaymentData(null);
  };

  const resetModal = () => {
    setPaymentStep("details");
    setPaymentData(null);
    setIsProcessing(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) {
          resetModal();
        }
        onOpenChange(newOpen);
      }}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {paymentStep === "details"
              ? "Complete Your Purchase"
              : "Complete Payment"}
          </DialogTitle>
          <DialogDescription>
            {paymentStep === "details"
              ? "Review your order and choose delivery method"
              : `Complete your ${paymentMethod} payment securely`}
          </DialogDescription>
        </DialogHeader>

        {paymentStep === "details" ? (
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="space-y-3">
              <h3 className="font-semibold">Order Summary</h3>
              <div className="p-4 bg-muted rounded-lg space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">
                    {pool.product_name}
                  </span>
                  <span className="text-sm">
                    ₦{slotPrice.toLocaleString()} per slot
                  </span>
                </div>

                {/* Slot Selection */}
                <div className="space-y-2">
                  <Label htmlFor="slots">Number of Slots</Label>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setSelectedSlots(Math.max(1, selectedSlots - 1))
                      }
                      disabled={selectedSlots <= 1}
                    >
                      -
                    </Button>
                    <Input
                      id="slots"
                      type="number"
                      min="1"
                      max={maxSlots}
                      value={selectedSlots}
                      onChange={(e) =>
                        setSelectedSlots(
                          Math.min(
                            maxSlots,
                            Math.max(1, parseInt(e.target.value) || 1)
                          )
                        )
                      }
                      className="w-20 text-center"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setSelectedSlots(Math.min(maxSlots, selectedSlots + 1))
                      }
                      disabled={selectedSlots >= maxSlots}
                    >
                      +
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Maximum {maxSlots} slots per order
                  </p>
                </div>

                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>
                    {selectedSlots} {selectedSlots === 1 ? "slot" : "slots"}
                  </span>
                  <span className="text-sm font-medium">
                    ₦{subtotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Delivery Method */}
            <div className="space-y-3">
              <h3 className="font-semibold">Delivery Method</h3>
              <RadioGroup
                value={deliveryMethod}
                onValueChange={(value: any) => setDeliveryMethod(value)}
              >
                <div className="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value="pickup" id="pickup" />
                  <div className="flex-1">
                    <Label htmlFor="pickup" className="cursor-pointer">
                      <div className="flex items-center gap-2 font-medium">
                        <MapPin className="h-4 w-4" />
                        Pickup
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {pool.pickup_location}
                      </p>
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
                        <p className="text-sm text-muted-foreground mt-1">
                          Delivered to your address
                        </p>
                        <p className="text-sm font-medium mt-1">
                          +₦
                          {(isSameState
                            ? INTRA_STATE_DELIVERY_FEE
                            : INTER_STATE_DELIVERY_FEE
                          ).toLocaleString()}
                          <span className="text-xs text-muted-foreground ml-1">
                            ({isSameState ? "Same state" : "Different state"})
                          </span>
                        </p>
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
              <p className="text-xs text-muted-foreground">
                For delivery coordination and updates
              </p>
            </div>

            {/* Payment Method */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Payment Method</Label>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value: any) => setPaymentMethod(value)}
              >
                <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value="PAYSTACK" id="paystack" />
                  <div className="flex-1">
                    <Label htmlFor="paystack" className="cursor-pointer">
                      <div className="flex items-center gap-2 font-medium">
                        <CreditCard className="h-4 w-4" />
                        Paystack
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Pay with card, bank transfer, or USSD
                      </p>
                    </Label>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value="STRIPE" id="stripe" />
                  <div className="flex-1">
                    <Label htmlFor="stripe" className="cursor-pointer">
                      <div className="flex items-center gap-2 font-medium">
                        <CreditCard className="h-4 w-4" />
                        Stripe
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Pay with international credit/debit cards
                      </p>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            {/* Price Breakdown */}
            <div className="space-y-3">
              <h3 className="font-semibold">Payment Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Slot price × {selectedSlots}
                  </span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Platform fee (2%)
                  </span>
                  <span>₦{platformFee.toLocaleString()}</span>
                </div>
                {deliveryCost > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Delivery fee (
                      {isSameState ? "intra-state" : "inter-state"})
                    </span>
                    <span>₦{deliveryCost.toLocaleString()}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span className="text-primary">
                    ₦{total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Info Alert */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Your payment is held securely by{" "}
                {paymentMethod === "PAYSTACK" ? "Paystack" : "Stripe"} until the
                pool fills and products are delivered. Full refund if the pool
                doesn't fill or vendor fails to deliver.
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Payment Processing View */}
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                {isProcessing ? (
                  <Loader2 className="h-12 w-12 animate-spin text-accent" />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {isProcessing ? "Processing Payment..." : "Payment Initiated"}
                </h3>
                <p className="text-muted-foreground mt-1">
                  {isProcessing
                    ? `Please wait while we set up your ${paymentMethod} payment...`
                    : "You will be redirected to complete your payment securely."}
                </p>
              </div>

              {paymentData && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    {paymentMethod === "STRIPE" ? "Stripe" : "Paystack"}{" "}
                    Reference:
                  </p>
                  <p className="font-mono text-sm">
                    {paymentData.reference ||
                      paymentData.sessionId ||
                      "Processing..."}
                  </p>
                </div>
              )}
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                {isProcessing
                  ? "Do not close this window while we process your payment."
                  : "You will be redirected to a secure payment page. If the redirect does not work, please check your pop-up blocker settings."}
              </AlertDescription>
            </Alert>
          </div>
        )}

        <DialogFooter>
          {paymentStep === "details" ? (
            <>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCheckout}
                disabled={
                  isProcessing ||
                  !phoneNumber ||
                  (deliveryMethod === "delivery" && !deliveryAddress)
                }
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
            </>
          ) : (
            <Button
              variant="outline"
              onClick={handleBackToDetails}
              disabled={isProcessing}
            >
              Back to Details
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
