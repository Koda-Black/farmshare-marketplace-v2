"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { httpRequest } from "@/lib/httpRequest";
import { Loader2, AlertCircle, RotateCcw } from "lucide-react";
import Cookies from "js-cookie";
import { useStore } from "@/lib/store";

interface VerifyOtpResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const role = searchParams.get("role");
  const setUser = useStore((state) => state.setUser);

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Handle OTP verification
  const handleVerifyOtp = async () => {
    setError("");
    setMessage("");
    setIsVerifying(true);

    try {
      const { accessToken, refreshToken, user } = await (httpRequest.post(
        httpRequest.endpoints.auth.verifyOtp,
        { email, otp }
      ) as any);

      const userData = {
        ...user,
        accessToken,
        refreshToken,
        created_at: new Date().toISOString(),
      };

      // ✅ Save to Zustand
      setUser(userData);

      // ✅ Save cookie for middleware
      Cookies.set(
        "farmshare-auth",
        JSON.stringify({
          state: { user: userData },
        }),
        {
          expires: 7, // 7 days
          sameSite: "lax",
        }
      );

      // ✅ Redirect based on role
      if (user.role === "VENDOR") {
        router.push("/vendor/verification");
      } else {
        router.push("/buyer/marketplace");
      }
    } catch (err: any) {
      setError(err.message || "Invalid or expired OTP");
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    setError("");
    setMessage("");
    setIsResending(true);

    try {
      const res = await (httpRequest.post(
        httpRequest.endpoints.auth.resendOtp,
        {
          email,
        }
      ) as any);
      setMessage(res.message || "A new OTP has been sent to your email.");
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Verify Your Email
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {message && (
            <Alert>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <Input
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
          />

          <Button
            onClick={handleVerifyOtp}
            disabled={isVerifying || otp.length < 6}
            className="w-full"
          >
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...
              </>
            ) : (
              "Verify OTP"
            )}
          </Button>

          <Button
            onClick={handleResendOtp}
            disabled={isResending}
            variant="outline"
            className="w-full"
          >
            {isResending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Resending...
              </>
            ) : (
              <>
                <RotateCcw className="mr-2 h-4 w-4" /> Resend OTP
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
