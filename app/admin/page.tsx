"use client";

import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/hooks/use-admin";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function AdminIndexPage() {
  const router = useRouter();
  const { isAdminAuthenticated } = useAdminAuth();

  useEffect(() => {
    // Only redirect if authenticated (middleware handles unauthenticated)
    if (isAdminAuthenticated) {
      router.push("/admin/dashboard");
    }
  }, [isAdminAuthenticated, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-lg text-muted-foreground">
          Loading admin dashboard...
        </p>
      </div>
    </div>
  );
}
