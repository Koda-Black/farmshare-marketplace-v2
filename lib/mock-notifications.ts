import type { Notification } from "./store"

// Mock notifications for demo purposes
export const mockNotifications: Notification[] = [
  {
    id: "1",
    user_id: "user-1",
    type: "pool_full",
    title: "Pool Filled Successfully",
    message: 'Your "Premium Rice 50kg Bags" pool has been filled! Payment will be processed within 24 hours.',
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    link: "/vendor/pools",
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: "2",
    user_id: "user-1",
    type: "payment",
    title: "Payment Received",
    message: "You received ₦45,000 for your completed pool. Funds have been transferred to your account.",
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    link: "/vendor/dashboard",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "3",
    user_id: "user-1",
    type: "general",
    title: "New Buyer Joined Your Pool",
    message: 'A buyer just joined your "Fresh Tomatoes 25kg" pool. 3 slots remaining.',
    read: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    link: "/vendor/pools",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: "4",
    user_id: "user-1",
    type: "verification",
    title: "Verification Approved",
    message: "Your vendor verification has been approved! You can now create pools and start selling.",
    read: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    link: "/vendor/dashboard",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
]

// Function to load mock notifications into store (for demo)
export function loadMockNotifications() {
  if (typeof window !== "undefined") {
    const { useStore } = require("./store")
    const store = useStore.getState()

    // Only load if no notifications exist
    if (store.notifications.length === 0) {
      mockNotifications.forEach((notification) => {
        store.addNotification(notification)
      })
    }
  }
}
