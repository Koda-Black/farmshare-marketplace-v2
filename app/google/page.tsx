"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore, UserRole } from "@/lib/store";
import { jwtDecode } from "jwt-decode";
import { httpRequest } from "@/lib/httpRequest";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, MapPin, ArrowRight, Leaf } from "lucide-react";
import Link from "next/link";
import Cookies from "js-cookie";

// Nigerian states
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
];

interface GoogleData {
  email: string;
  name: string;
  picture?: string;
}

export default function OAuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useStore();

  const [mode, setMode] = useState<
    "loading" | "complete_signup" | "error" | "success"
  >("loading");
  const [googleData, setGoogleData] = useState<GoogleData | null>(null);
  const [role, setRole] = useState<UserRole>("buyer");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");
    const refresh = searchParams.get("refresh");
    const roleParam = searchParams.get("role");
    const modeParam = searchParams.get("mode");
    const errorParam = searchParams.get("error");
    const googleDataParam = searchParams.get("googleData");
    const email = searchParams.get("email");

    // Handle errors
    if (errorParam === "account_not_found") {
      setError(`No account found for ${email}. Please sign up first.`);
      setMode("error");
      return;
    }

    if (errorParam === "oauth_failed") {
      setError("Google authentication failed. Please try again.");
      setMode("error");
      return;
    }

    // Handle successful login (has tokens)
    if (token && refresh) {
      try {
        const decoded: any = jwtDecode(token);
        const userData = {
          id: decoded.sub,
          email: decoded.email,
          role: (roleParam || decoded.role || "buyer") as UserRole,
          accessToken: token,
          refreshToken: refresh,
          name: decoded.name || "",
          created_at: new Date().toISOString(),
        };

        setUser(userData);

        // Save cookie for middleware
        Cookies.set(
          "farmshare-auth",
          JSON.stringify({ state: { user: userData } }),
          { expires: 7, sameSite: "lax" },
        );

        // Redirect based on role
        const userRole = roleParam || decoded.role || "buyer";
        if (userRole === "vendor") {
          router.push("/vendor/dashboard");
        } else if (userRole === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/buyer/marketplace");
        }
        return;
      } catch (err) {
        setError("Failed to process login. Please try again.");
        setMode("error");
        return;
      }
    }

    // Handle signup flow (needs to collect state)
    if (modeParam === "signup" && googleDataParam) {
      try {
        const data = JSON.parse(decodeURIComponent(googleDataParam));
        setGoogleData(data);
        setRole((roleParam as UserRole) || "buyer");
        setMode("complete_signup");
      } catch (err) {
        setError("Invalid Google data. Please try again.");
        setMode("error");
      }
      return;
    }

    // If nothing matched, show error
    setError("Invalid authentication response. Please try again.");
    setMode("error");
  }, [searchParams, router, setUser]);

  const handleCompleteSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!state) {
      setError("Please select your state");
      return;
    }

    if (!googleData) {
      setError("Google data missing. Please try again.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await httpRequest.post<{
        accessToken: string;
        refreshToken: string;
        user: { id: string; name: string; email: string; role: string };
        redirectTo: string;
      }>("/auth/google/complete-signup", {
        email: googleData.email,
        name: googleData.name,
        picture: googleData.picture,
        role: role.toUpperCase(),
        state,
        city,
      });

      const userData = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        role: response.user.role as UserRole,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        created_at: new Date().toISOString(),
      };

      setUser(userData);

      // Save cookie for middleware
      Cookies.set(
        "farmshare-auth",
        JSON.stringify({ state: { user: userData } }),
        { expires: 7, sameSite: "lax" },
      );

      // Redirect based on role - vendors go to verification
      router.push(response.redirectTo);
    } catch (err: any) {
      setError(err.message || "Failed to complete signup");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (mode === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Authenticating with Google...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (mode === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 mx-auto mb-4">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle>Authentication Failed</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full">
              <Link href="/signup">Sign Up</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/login">Try Login Again</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Complete signup state - collect state/city
  if (mode === "complete_signup" && googleData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <Link href="/" className="flex items-center justify-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent shadow-lg">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">farmshare</span>
            </Link>

            {googleData.picture && (
              <img
                src={googleData.picture}
                alt={googleData.name}
                className="h-16 w-16 rounded-full mx-auto border-2 border-primary"
              />
            )}

            <div>
              <CardTitle className="text-2xl">
                Almost there, {googleData.name.split(" ")[0]}!
              </CardTitle>
              <CardDescription className="mt-2">
                Complete your {role === "vendor" ? "vendor" : "buyer"} profile
                to get started
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleCompleteSignup} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Signing up with:{" "}
                  <span className="font-medium text-foreground">
                    {googleData.email}
                  </span>
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="state"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  Your State <span className="text-destructive">*</span>
                </label>
                <select
                  id="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="flex h-12 w-full rounded-md border border-border/50 bg-muted/50 px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:bg-background transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select your state</option>
                  {NIGERIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground">
                  {role === "buyer"
                    ? "You'll see vendors in your state by default"
                    : "Buyers in your state will see your pools first"}
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="city" className="text-sm font-medium">
                  City{" "}
                  <span className="text-muted-foreground text-xs">
                    (Optional)
                  </span>
                </label>
                <input
                  id="city"
                  type="text"
                  placeholder="e.g., Ikeja, Victoria Island"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={isSubmitting}
                  className="flex h-12 w-full rounded-md border border-border/50 bg-muted/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:bg-background transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <Button
                type="submit"
                className={`w-full h-12 text-white rounded-xl font-semibold shadow-lg transition-all duration-300 group ${
                  role === "vendor"
                    ? "bg-accent hover:bg-accent/90"
                    : "bg-primary hover:bg-primary/90"
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Complete Signup
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>

              {role === "vendor" && (
                <p className="text-xs text-center text-muted-foreground">
                  After signup, you'll be directed to complete vendor
                  verification
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
