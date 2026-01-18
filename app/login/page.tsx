"use client";

import type React from "react";
import Cookies from "js-cookie";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { httpRequest } from "@/lib/httpRequest";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserRole, useStore } from "@/lib/store";
import {
  Loader2,
  AlertCircle,
  Leaf,
  ArrowRight,
  Mail,
  Lock,
} from "lucide-react";

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    isVerified: boolean;
  };
}

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

export default function LoginPage() {
  const router = useRouter();
  const setUser = useStore((state) => state.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { accessToken, refreshToken, user } =
        await httpRequest.post<LoginResponse>(
          httpRequest.endpoints.auth.login,
          { email, password },
        );

      // Destructure user data
      const userData = {
        ...user,
        accessToken,
        refreshToken,
        created_at: new Date().toISOString(),
        role: user.role as UserRole,
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
        },
      );

      // Redirect based on role
      switch (user.role) {
        case "vendor":
          router.push("/vendor/dashboard");
          break;
        case "buyer":
          router.push("/buyer/marketplace");
          break;
        case "admin":
          router.push("/admin");
          break;
        default:
          router.push("/");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

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
            Welcome back to the community
          </h1>
          <p className="text-xl text-primary-foreground/80 leading-relaxed max-w-md">
            Access your dashboard, manage your pools, and continue trading with
            trusted farmers and buyers.
          </p>

          <div className="mt-12 grid grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm">
              <div className="text-3xl font-bold">10K+</div>
              <div className="text-sm text-primary-foreground/70">
                Active Users
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm">
              <div className="text-3xl font-bold">₦50M+</div>
              <div className="text-sm text-primary-foreground/70">
                Traded Monthly
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent shadow-lg shadow-accent/25">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">farmshare</span>
            </Link>
          </div>

          <Card className="border-0 shadow-none lg:border lg:shadow-xl">
            <CardHeader className="space-y-2 text-center pb-8">
              <CardTitle className="text-3xl font-bold">Welcome back</CardTitle>
              <CardDescription className="text-base">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive" className="animate-fade-in">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                      className="pl-10 h-12 bg-muted/50 border-border/50 focus:bg-background transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-accent hover:text-accent/80 hover:underline transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                    <PasswordInput
                      id="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      className="pl-10 h-12 bg-muted/50 border-border/50 focus:bg-background transition-colors"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold shadow-lg shadow-primary/20 hover:shadow-xl transition-all duration-300 group"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
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
                    // Clear any stored signup role since this is login
                    localStorage.removeItem("farmshare_google_signup_role");
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
                      Sign in with Google
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 pt-4">
              <div className="text-sm text-center text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="text-accent hover:text-accent/80 hover:underline font-semibold transition-colors"
                >
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
