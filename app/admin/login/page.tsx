"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAdminAuth } from "@/hooks/use-admin";
import { adminService } from "@/lib/admin.service";
import {
  Loader2,
  AlertCircle,
  Shield,
  Lock,
  Mail,
  BarChart3,
  Users,
  ShieldCheck,
} from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, verifyMfa } = useAdminAuth();
  const [step, setStep] = useState<"credentials" | "mfa">("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await login({ email, password });

      // If MFA is required, move to MFA step
      if (response.requiresMfa) {
        setStep("mfa");
      } else {
        // Direct login without MFA
        router.push("/admin");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await verifyMfa(mfaCode, email);
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gradient-to-br from-background via-background to-muted/30">
      {/* Left side - Login form */}
      <div className="flex items-center justify-center p-8 relative">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

        <Card className="w-full max-w-md relative z-10 border-0 shadow-2xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="space-y-4 pb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/60 shadow-lg shadow-primary/20">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold tracking-tight">
                  Admin Portal
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  FarmShare Management Console
                </CardDescription>
              </div>
            </div>
            <div className="pt-2">
              <p className="text-sm text-muted-foreground">
                {step === "credentials"
                  ? "Sign in to access your admin dashboard"
                  : "Enter the 6-digit code from your authenticator app"}
              </p>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {step === "credentials" ? (
              <form onSubmit={handleCredentialsSubmit} className="space-y-5">
                {error && (
                  <Alert
                    variant="destructive"
                    className="border-destructive/50 bg-destructive/10"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@farmshare.ng"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                      className="pl-10 h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                    <PasswordInput
                      id="password"
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      className="pl-10 h-11"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20 font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Continue"
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleMfaSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <Label htmlFor="mfa-code" className="text-center block">
                    Authentication Code
                  </Label>
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={mfaCode}
                      onChange={setMfaCode}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20 font-medium"
                  disabled={isLoading || mfaCode.length !== 6}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify & Sign In"
                  )}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    setStep("credentials");
                    setMfaCode("");
                    setError("");
                  }}
                  disabled={isLoading}
                >
                  Back to credentials
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right side - Modern gradient with features */}
      <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/70">
        {/* Decorative shapes */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-2xl" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='white'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
          }}
        />

        <div className="relative h-full flex flex-col items-center justify-center p-12 z-10">
          <div className="text-center space-y-8 text-white max-w-lg">
            {/* Logo */}
            <div className="flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm shadow-2xl border border-white/20">
                <Shield className="h-10 w-10" />
              </div>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-4xl font-bold mb-3 tracking-tight">
                FarmShare Admin
              </h1>
              <p className="text-lg text-white/80 leading-relaxed">
                Your command center for managing Nigeria's agricultural
                marketplace
              </p>
            </div>

            {/* Feature cards */}
            <div className="grid gap-4 text-left pt-4">
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Real-time Analytics</p>
                  <p className="text-sm text-white/70">
                    Track revenue, growth & performance
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">User Management</p>
                  <p className="text-sm text-white/70">
                    Vendors, buyers & verification
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Dispute Resolution</p>
                  <p className="text-sm text-white/70">
                    Handle conflicts with confidence
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <p className="text-sm text-white/50 pt-4">
              © 2025 FarmShare. Secure admin access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
