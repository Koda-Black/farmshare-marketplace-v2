"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
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
import { useStore } from "@/lib/store";
import {
  Loader2,
  AlertCircle,
  Store,
  ShoppingBag,
  Leaf,
  ArrowRight,
  User,
  Mail,
  Phone,
  Lock,
  ChevronLeft,
  Check,
} from "lucide-react";
import type { UserRole } from "@/lib/store";
import { httpRequest } from "@/lib/httpRequest";

interface SignupResponse {
  accessToken: string;
  refreshToken: string;
  user: { id: string; name: string; email: string; role: string };
}

// Nigerian states for location selection
const NIGERIAN_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
] as const;

export default function SignupPage() {
  const router = useRouter();
  const setUser = useStore((state) => state.setUser);
  const [step, setStep] = useState<"role" | "details">("role");
  const [role, setRole] = useState<UserRole>("buyer");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    state: "",
    city: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setStep("details");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (!formData.state) {
      setError("Please select your state");
      return;
    }

    setIsLoading(true);

    try {
      const endpoint =
        role === "vendor"
          ? httpRequest.endpoints.auth.signupVendor
          : httpRequest.endpoints.auth.signupBuyer;

      await httpRequest.post<void>(endpoint, {
        ...formData,
        country: "Nigeria",
      });

      // ✅ Redirect to verify-otp page with email + role
      router.push(`/auth/verify-otp?email=${formData.email}&role=${role}`);
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError("");

  //   if (formData.password !== formData.confirmPassword) {
  //     setError("Passwords do not match");
  //     return;
  //   }

  //   if (formData.password.length < 8) {
  //     setError("Password must be at least 8 characters");
  //     return;
  //   }

  //   setIsLoading(true);
  //   const { setUser } = useStore.getState();

  //   try {
  //     const endpoint =
  //       role === "vendor"
  //         ? httpRequest.endpoints.auth.signupVendor
  //         : httpRequest.endpoints.auth.signupBuyer;

  //     const response = await httpRequest.post(endpoint, formData);
  //     router.push(`/verify-otp?email=${formData.email}&role=${role}`);

  //     // Update user in store
  //     // setUser({
  //     //   ...user,
  //     //   accessToken,
  //     //   refreshToken,
  //     //   created_at: new Date().toISOString(),
  //     //   role: user.role as UserRole,
  //     // });

  //     // // Redirect based on role
  //     // if (role === "vendor") {
  //     //   router.push("/vendor/verification");
  //     // } else {
  //     //   router.push("/marketplace");
  //     // }
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : "Signup failed");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const GoogleIcon = () => (
    <svg
      className="mr-2 h-4 w-4"
      viewBox="0 0 533.5 544.3"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M533.5 278.4c0-17.4-1.4-34.1-4.1-50.4H272v95.4h146.9c-6.3 34.2-25.2 63.1-53.9 82.5v68h86.7c50.8-46.8 81.8-115.8 81.8-195.5z"
        fill="#4285f4"
      />
      <path
        d="M272 544.3c72.6 0 133.6-24 178.1-65.4l-86.7-68c-24.1 16.2-55 25.7-91.4 25.7-70.3 0-129.9-47.5-151.3-111.2H29.5v69.7C73.5 482 165.7 544.3 272 544.3z"
        fill="#34a853"
      />
      <path
        d="M120.7 325.4c-10.1-30.2-10.1-62.6 0-92.8v-69.7H29.5c-39.8 79.4-39.8 173 0 252.4l91.2-69.9z"
        fill="#fbbc04"
      />
      <path
        d="M272 107.7c39.6 0 75 13.6 103.1 40.2l77.3-77.3C405.6 24 344.6 0 272 0 165.7 0 73.5 62.3 29.5 162.9l91.2 69.7C142.1 155.2 201.7 107.7 272 107.7z"
        fill="#ea4335"
      />
    </svg>
  );

  if (step === "role") {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex">
        {/* Left side - Decorative */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary to-primary-dark relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-accent/10 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
          </div>

          <div className="relative z-10 flex flex-col justify-center p-16 text-primary-foreground">
            <Link href="/" className="flex items-center gap-3 mb-12">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent shadow-lg shadow-accent/25">
                <Leaf className="h-7 w-7 text-white" />
              </div>
              <span className="text-2xl font-bold">farmshare</span>
            </Link>

            <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Join the future of agricultural trading
            </h1>
            <p className="text-xl text-primary-foreground/80 leading-relaxed max-w-md">
              Connect with farmers and buyers across the nation. Pool resources,
              save more, grow together.
            </p>

            <div className="mt-12 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20">
                  <Check className="h-4 w-4 text-accent" />
                </div>
                <span>Access wholesale prices</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20">
                  <Check className="h-4 w-4 text-accent" />
                </div>
                <span>Verified vendors & buyers</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20">
                  <Check className="h-4 w-4 text-accent" />
                </div>
                <span>Secure transactions</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Role Selection */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
          <div className="w-full max-w-lg">
            {/* Mobile logo */}
            <div className="lg:hidden flex justify-center mb-8">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent shadow-lg shadow-accent/25">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">farmshare</span>
              </Link>
            </div>

            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-3">Join FarmShare</h2>
              <p className="text-muted-foreground text-lg">
                Choose how you want to use FarmShare
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <button
                onClick={() => handleRoleSelect("buyer")}
                className="group relative flex flex-col items-center gap-4 rounded-2xl border-2 border-border p-8 hover:border-primary bg-card hover:bg-muted/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 group-hover:bg-primary group-hover:shadow-lg group-hover:shadow-primary/25 transition-all duration-300">
                  <ShoppingBag className="h-10 w-10 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold">I'm a Buyer</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Join buying pools to access wholesale prices on agricultural
                    products
                  </p>
                </div>
                <ArrowRight className="absolute bottom-4 right-4 h-5 w-5 opacity-0 group-hover:opacity-100 transition-all duration-300 text-primary" />
              </button>

              <button
                onClick={() => handleRoleSelect("vendor")}
                className="group relative flex flex-col items-center gap-4 rounded-2xl border-2 border-border p-8 hover:border-accent bg-card hover:bg-muted/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-accent/20 group-hover:bg-accent group-hover:shadow-lg group-hover:shadow-accent/25 transition-all duration-300">
                  <Store className="h-10 w-10 text-accent group-hover:text-white transition-colors" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold">I'm a Vendor</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Create buying pools and sell agricultural products in bulk
                  </p>
                </div>
                <ArrowRight className="absolute bottom-4 right-4 h-5 w-5 opacity-0 group-hover:opacity-100 transition-all duration-300 text-accent" />
              </button>
            </div>

            <div className="text-center mt-8 text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-accent hover:text-accent/80 font-semibold hover:underline transition-colors"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      {/* Left side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary to-primary-dark relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-center p-16 text-primary-foreground">
          <Link href="/" className="flex items-center gap-3 mb-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent shadow-lg shadow-accent/25">
              <Leaf className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold">farmshare</span>
          </Link>

          <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            {role === "vendor"
              ? "Start selling to thousands of buyers"
              : "Unlock wholesale prices today"}
          </h1>
          <p className="text-xl text-primary-foreground/80 leading-relaxed max-w-md">
            {role === "vendor"
              ? "Create buying pools, reach more customers, and grow your agricultural business with FarmShare."
              : "Join buying pools with other buyers to access bulk pricing on quality agricultural products."}
          </p>

          <div className="mt-12 p-6 rounded-2xl bg-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-xl ${
                  role === "vendor" ? "bg-accent" : "bg-primary-foreground/20"
                }`}
              >
                {role === "vendor" ? (
                  <Store className="h-7 w-7 text-white" />
                ) : (
                  <ShoppingBag className="h-7 w-7 text-primary-foreground" />
                )}
              </div>
              <div>
                <div className="font-semibold text-lg">
                  Signing up as {role === "vendor" ? "Vendor" : "Buyer"}
                </div>
                <div className="text-primary-foreground/70">
                  Complete your details to get started
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent shadow-lg shadow-accent/25">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">farmshare</span>
            </Link>
          </div>

          <Card className="border-0 shadow-none lg:border lg:shadow-xl">
            <CardHeader className="space-y-2 pb-6">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => setStep("role")}
                  disabled={isLoading}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  Change role
                </span>
              </div>
              <CardTitle className="text-3xl font-bold">
                Create your account
              </CardTitle>
              <CardDescription className="text-base">
                Signing up as a{" "}
                <span
                  className={`font-semibold ${
                    role === "vendor" ? "text-accent" : "text-primary"
                  }`}
                >
                  {role}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <Alert variant="destructive" className="animate-fade-in">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      disabled={isLoading}
                      className="pl-10 h-12 bg-muted/50 border-border/50 focus:bg-background transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                      disabled={isLoading}
                      className="pl-10 h-12 bg-muted/50 border-border/50 focus:bg-background transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+234 800 000 0000"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      required
                      disabled={isLoading}
                      className="pl-10 h-12 bg-muted/50 border-border/50 focus:bg-background transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state" className="text-sm font-medium">
                    State <span className="text-destructive">*</span>
                  </Label>
                  <select
                    id="state"
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    required
                    disabled={isLoading}
                    className="flex h-12 w-full rounded-md border border-border/50 bg-muted/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:bg-background transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select your state</option>
                    {NIGERIAN_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-muted-foreground pl-1">
                    {role === "buyer"
                      ? "You'll see vendors in your state by default"
                      : "Buyers in your state will see your pools first"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-medium">
                    City{" "}
                    <span className="text-muted-foreground text-xs">
                      (Optional)
                    </span>
                  </Label>
                  <Input
                    id="city"
                    type="text"
                    placeholder="e.g., Ikeja, Victoria Island"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    disabled={isLoading}
                    className="h-12 bg-muted/50 border-border/50 focus:bg-background transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                    <PasswordInput
                      id="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required
                      disabled={isLoading}
                      className="pl-10 h-12 bg-muted/50 border-border/50 focus:bg-background transition-colors"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground pl-1">
                    Must be at least 8 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium"
                  >
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                    <PasswordInput
                      id="confirmPassword"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      required
                      disabled={isLoading}
                      className="pl-10 h-12 bg-muted/50 border-border/50 focus:bg-background transition-colors"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className={`w-full h-12 text-white rounded-xl font-semibold shadow-lg transition-all duration-300 group ${
                    role === "vendor"
                      ? "bg-accent hover:bg-accent/90 shadow-accent/20 hover:shadow-xl"
                      : "bg-primary hover:bg-primary/90 shadow-primary/20 hover:shadow-xl"
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 bg-background border-border hover:bg-muted/50 flex items-center justify-center gap-2 rounded-xl transition-colors"
                  disabled={isGoogleLoading}
                  onClick={() => {
                    setIsGoogleLoading(true);
                    // Store role in localStorage before redirecting to Google
                    localStorage.setItem("farmshare_google_signup_role", role);
                    window.location.href = `${httpRequest.baseURL}/auth/google`;
                  }}
                >
                  {isGoogleLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <GoogleIcon />
                      Google
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground leading-relaxed pt-2">
                  By signing up, you agree to our{" "}
                  <Link
                    href="/terms"
                    className="text-accent hover:underline font-medium"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-accent hover:underline font-medium"
                  >
                    Privacy Policy
                  </Link>
                </p>
              </form>
            </CardContent>
            <div className="px-6 pb-6">
              <div className="text-sm text-center text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-accent hover:text-accent/80 hover:underline font-semibold transition-colors"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
