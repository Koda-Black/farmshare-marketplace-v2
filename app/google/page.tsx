"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { jwtDecode } from "jwt-decode";

export default function OAuthCallback() {
  const router = useRouter();
  const { setUser } = useStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("token");
    const refreshToken = params.get("refresh");

    if (accessToken) {
      const decoded: any = jwtDecode(accessToken);
      setUser({
        id: decoded.sub,
        email: decoded.email,
        role: decoded.role,
        accessToken,
        refreshToken: refreshToken || "",
        name: decoded.name || "",
        created_at: new Date().toISOString(),
      });
      router.push("/marketplace");
    }
  }, [router, setUser]);

  return <div>Authenticating...</div>;
}
