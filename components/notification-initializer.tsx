"use client"

import { useEffect } from "react"
import { useStore } from "@/lib/store"
import { mockNotifications } from "@/lib/mock-notifications"

export function NotificationInitializer() {
  const { notifications, addNotification } = useStore()

  useEffect(() => {
    // Load mock notifications on first render if none exist
    if (notifications.length === 0) {
      mockNotifications.forEach((notification) => {
        addNotification(notification)
      })
    }
  }, []) // Only run once on mount

  return null
}
