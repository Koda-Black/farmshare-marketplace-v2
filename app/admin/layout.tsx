"use client";

import { useAdminAuth } from "@/hooks/use-admin";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { admin, isAdminAuthenticated } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isHydrated, setIsHydrated] = useState(false);

  // Wait for Zustand hydration to complete
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Bypass authentication checks for login page
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    // Only redirect after hydration and if not authenticated and not on login page
    if (isHydrated && !isLoginPage && admin !== null && !isAdminAuthenticated) {
      router.push("/admin/login");
    }
  }, [admin, isAdminAuthenticated, router, isHydrated, isLoginPage]);

  // Show loading state while hydrating (but not for login page)
  if (!isHydrated && !isLoginPage) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // For login page, render children immediately
  if (isLoginPage) {
    return <>{children}</>;
  }

  // If not authenticated, show login prompt
  if (!isAdminAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Admin Authentication Required
          </h1>
          <p className="text-muted-foreground mb-4">
            Please log in to access the admin dashboard
          </p>
          <Button asChild>
            <Link href="/admin/login">Go to Admin Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  // If authenticated, render children
  return <div className="min-h-screen">{children}</div>;
}
