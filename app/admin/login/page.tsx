"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAdminAuth } from "@/hooks/use-admin"
import { adminService } from "@/lib/admin.service"
import { Loader2, AlertCircle, Shield } from "lucide-react"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

export default function AdminLoginPage() {
  const router = useRouter()
  const { login, verifyMfa } = useAdminAuth()
  const [step, setStep] = useState<"credentials" | "mfa">("credentials")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [mfaCode, setMfaCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await login({ email, password })

      // If MFA is required, move to MFA step
      if (response.requiresMfa) {
        setStep("mfa")
      } else {
        // Direct login without MFA
        router.push("/admin")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await verifyMfa(mfaCode)
      router.push("/admin")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side - Login form */}
      <div className="flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">Admin Access</CardTitle>
            </div>
            <CardDescription>
              {step === "credentials"
                ? "Enter your admin credentials"
                : "Enter the 6-digit code from your authenticator app"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === "credentials" ? (
              <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Admin Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@farmshare.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
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
                    <InputOTP maxLength={6} value={mfaCode} onChange={setMfaCode}>
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
                  className="w-full bg-primary hover:bg-primary/90"
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
                    setStep("credentials")
                    setMfaCode("")
                    setError("")
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

      {/* Right side - Image */}
      <div className="hidden lg:block relative bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
             style={{
               backgroundImage: `url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=1200&fit=crop')`
             }}>
          <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm"></div>
        </div>
        <div className="relative h-full flex items-center justify-center p-12">
          <div className="text-center space-y-6 text-white max-w-md">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <Shield className="h-8 w-8" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-4">FarmShare Admin</h1>
              <p className="text-lg opacity-90">
                Manage your agricultural marketplace with powerful tools and insights.
              </p>
            </div>
            <div className="space-y-3 text-left bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-white rounded-full"></div>
                <span>Real-time analytics and monitoring</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-white rounded-full"></div>
                <span>User management and verification</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-white rounded-full"></div>
                <span>Dispute resolution and support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
