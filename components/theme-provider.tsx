"use client"

import type React from "react"

import { useEffect } from "react"
import { useStore } from "@/lib/store"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useStore((state) => state.theme)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [theme])

  return <>{children}</>
}
