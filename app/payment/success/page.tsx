"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Package,
  ArrowRight,
  Clock,
  Truck,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(true);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [lastPoolId, setLastPoolId] = useState<string | null>(null);

  useEffect(() => {
    // Get the pool ID from localStorage
    const poolId = localStorage.getItem("lastPurchasedPoolId");
    if (poolId) {
      setLastPoolId(poolId);
    }

    const reference = searchParams.get("reference");
    const sessionId = searchParams.get("session_id");
    const pendingId = searchParams.get("pending_id");
    const status = searchParams.get("status");

    console.log("Payment success page - URL params:", {
      reference,
      sessionId,
      pendingId,
      status,
    });

    // Handle payment verification
    if (reference || sessionId) {
      verifyPayment(reference, sessionId, pendingId);
    } else {
      // Just show success if no payment info
      console.log("No payment info found, showing default success");
      setIsVerifying(false);
      setPaymentData({
        status: "success",
        message: "Payment completed successfully",
      });
    }
  }, [searchParams]);

  const verifyPayment = async (
    reference?: string,
    sessionId?: string,
    pendingId?: string
  ) => {
    try {
      setIsVerifying(true);

      if (reference) {
        console.log("Verifying payment with reference:", reference);
        // Verify Paystack payment
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/paystack/verify?reference=${reference}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        console.log("Verification response:", data);

        // Transform backend response to include status field
        const paymentDataWithStatus = {
          ...data,
          status: data.success ? "success" : "failed",
          reference: reference,
        };
        console.log("Transformed payment data:", paymentDataWithStatus);
        setPaymentData(paymentDataWithStatus);

        if (data.success) {
          toast({
            title: "Payment Successful!",
            description:
              "You have successfully joined the pool. You will receive confirmation details shortly.",
          });
          // Backend sends in-app notification automatically
        } else {
          throw new Error(data.message || "Payment verification failed");
        }
      } else if (sessionId) {
        // Handle Stripe payment (webhook typically handles this)
        setPaymentData({
          status: "success",
          message:
            "Payment completed. You will receive a confirmation email shortly.",
          sessionId,
        });
      }
    } catch (error: any) {
      console.error("Payment verification error:", error);
      setPaymentData({
        status: "error",
        message: error.message || "Payment verification failed",
      });
      toast({
        title: "Verification Error",
        description:
          error.message || "Failed to verify payment. Please contact support.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleViewOrders = () => {
    router.push("/buyer/orders");
  };

  const handleBrowseMore = () => {
    router.push("/marketplace");
  };

  const handleViewPool = () => {
    if (lastPoolId) {
      // Clear the stored pool ID
      localStorage.removeItem("lastPurchasedPoolId");
      router.push(`/buyer/pool/${lastPoolId}`);
    }
  };

  return (
    <div className="container px-[30px] py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          {isVerifying ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="h-16 w-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
              <h1 className="text-3xl font-bold">Verifying Payment...</h1>
              <p className="text-muted-foreground">
                Please wait while we confirm your payment.
              </p>
            </div>
          ) : paymentData?.status === "success" ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-green-600">
                Payment Successful!
              </h1>
              <p className="text-muted-foreground">
                Your payment has been processed successfully.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <Package className="h-8 w-8 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-red-600">Payment Issue</h1>
              <p className="text-muted-foreground">
                {paymentData?.message ||
                  "There was an issue with your payment."}
              </p>
            </div>
          )}
        </div>

        {/* Payment Details */}
        {!isVerifying && paymentData && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentData.reference && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Payment Reference:
                  </span>
                  <span className="font-mono text-sm">
                    {paymentData.reference}
                  </span>
                </div>
              )}
              {paymentData.sessionId && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Session ID:</span>
                  <span className="font-mono text-sm">
                    {paymentData.sessionId}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge
                  variant={
                    paymentData.status === "success" ? "default" : "destructive"
                  }
                >
                  {paymentData.status === "success" ? "Completed" : "Failed"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Next Steps */}
        {!isVerifying && paymentData?.status === "success" && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h2 className="text-xl font-semibold text-blue-800">
                  What Happens Next?
                </h2>
                <div className="grid md:grid-cols-2 gap-6 text-left">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Package className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-800">
                          Pool Filling
                        </p>
                        <p className="text-sm text-blue-700">
                          Wait for other buyers to join the pool. You'll receive
                          updates on the progress.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Truck className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-800">Delivery</p>
                        <p className="text-sm text-blue-700">
                          Once the pool fills, your products will be delivered
                          to your specified location.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-800">Timeline</p>
                        <p className="text-sm text-blue-700">
                          Most pools fill within 3-7 days. Delivery occurs
                          within 14 days after filling.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-800">Tracking</p>
                        <p className="text-sm text-blue-700">
                          You can track your order status in your dashboard and
                          receive email updates.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        {!isVerifying && (
          <div className="space-y-4">
            {paymentData?.status === "success" ? (
              <div className="space-y-4">
                {lastPoolId && (
                  <Button
                    onClick={handleViewPool}
                    className="w-full"
                    variant="outline"
                  >
                    <Package className="mr-2 h-4 w-4" />
                    View Pool (Updated)
                  </Button>
                )}
                <div className="grid md:grid-cols-2 gap-4">
                  <Button onClick={handleViewOrders} className="w-full">
                    View My Orders
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleBrowseMore}
                    className="w-full"
                  >
                    Browse More Pools
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Button onClick={handleBrowseMore} className="w-full">
                  Browse More Pools
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/contact")}
                  className="w-full"
                >
                  Contact Support
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Important Information */}
        {!isVerifying && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold">Important Information</h3>
                <div className="space-y-2 text-sm text-muted-foreground text-left">
                  <p>
                    • You will receive a confirmation email with your order
                    details.
                  </p>
                  <p>
                    • Your payment is held securely in escrow until delivery is
                    confirmed.
                  </p>
                  <p>
                    • Full refund is available if the pool doesn't fill or if
                    there are delivery issues.
                  </p>
                  <p>
                    • You can track your order status in your dashboard at any
                    time.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
