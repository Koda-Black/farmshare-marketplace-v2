"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useStore } from "@/lib/store"
import { Loader2, AlertCircle, Store, ShoppingBag } from "lucide-react"
import type { UserRole } from "@/lib/store"

export default function SignupPage() {
  const router = useRouter()
  const setUser = useStore((state) => state.setUser)
  const [step, setStep] = useState<"role" | "details">("role")
  const [role, setRole] = useState<UserRole>("buyer")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole)
    setStep("details")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    setIsLoading(true)

    try {
      // TODO: Replace with actual API call
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Signup failed")
      }

      const data = await response.json()
      setUser(data.user)

      // Redirect based on role
      if (role === "vendor") {
        router.push("/vendor/verification")
      } else {
        router.push("/marketplace")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (step === "role") {
    return (
      <div className="container px-[30px] flex items-center justify-center min-h-[calc(100vh-4rem)] py-12">
        <Card className="w-full max-w-2xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold">Join FarmShare</CardTitle>
            <CardDescription>Choose how you want to use FarmShare</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => handleRoleSelect("buyer")}
              className="group relative flex flex-col items-center gap-4 rounded-lg border-2 border-border p-8 hover:border-primary transition-all hover:shadow-lg"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <ShoppingBag className="h-8 w-8 text-primary" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold">I'm a Buyer</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Join buying pools to access wholesale prices on agricultural products
                </p>
              </div>
            </button>

            <button
              onClick={() => handleRoleSelect("vendor")}
              className="group relative flex flex-col items-center gap-4 rounded-lg border-2 border-border p-8 hover:border-accent transition-all hover:shadow-lg"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/20 group-hover:bg-accent/30 transition-colors">
                <Store className="h-8 w-8 text-accent-foreground" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold">I'm a Vendor</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Create buying pools and sell agricultural products in bulk
                </p>
              </div>
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container px-[30px] flex items-center justify-center min-h-[calc(100vh-4rem)] py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create your account</CardTitle>
          <CardDescription>
            Signing up as a <span className="font-medium text-foreground">{role}</span>
            <Button
              variant="link"
              className="h-auto p-0 ml-1 text-primary"
              onClick={() => setStep("role")}
              disabled={isLoading}
            >
              Change
            </Button>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+234 800 000 0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground leading-relaxed">
              By signing up, you agree to our{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </p>
          </form>
        </CardContent>
        <div className="px-6 pb-6">
          <div className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
}
