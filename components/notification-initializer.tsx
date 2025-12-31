"use client"

import { useEffect } from "react"
import { useStore } from "@/lib/store"
import { useNotifications } from "@/hooks/use-notifications"

export function NotificationInitializer() {
  const { isAuthenticated } = useStore()
  const { fetch: fetchNotifications } = useNotifications()

  useEffect(() => {
    // Fetch real notifications from backend when user is authenticated
    if (isAuthenticated) {
      fetchNotifications({ page: 1, limit: 20 })
    }
  }, [isAuthenticated, fetchNotifications])

  return null
}
