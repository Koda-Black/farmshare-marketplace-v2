import { create } from "zustand"
import { persist } from "zustand/middleware"

export type UserRole = "vendor" | "buyer" | "admin"

export type VerificationStatus = "pending" | "verified" | "rejected" | "incomplete"

export interface User {
  id: string
  email: string
  role: UserRole
  name: string
  phone?: string
  verification_status?: VerificationStatus
  bank_verified?: boolean
  created_at: string
}

export interface Pool {
  id: string
  vendor_id: string
  product_name: string
  product_description: string
  slots_count: number
  slots_filled: number
  price_total: number
  price_per_slot: number
  allow_home_delivery: boolean
  home_delivery_cost?: number
  delivery_deadline: string
  status: "active" | "full" | "completed" | "cancelled"
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: "payment" | "pool_full" | "verification" | "dispute" | "general"
  title: string
  message: string
  read: boolean
  timestamp: string
  link?: string
  created_at: string
}

interface AppState {
  // Auth
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  logout: () => void

  // Theme
  theme: "light" | "dark"
  toggleTheme: () => void

  // Notifications
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Notification) => void
  markNotificationAsRead: (id: string) => void
  markAllNotificationsAsRead: () => void
  deleteNotification: (id: string) => void

  // Pools (cached)
  pools: Pool[]
  setPools: (pools: Pool[]) => void
  addPool: (pool: Pool) => void
  updatePool: (id: string, updates: Partial<Pool>) => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Auth
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => set({ user: null, isAuthenticated: false, notifications: [] }),

      // Theme
      theme: "light",
      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === "light" ? "dark" : "light"
          if (typeof document !== "undefined") {
            document.documentElement.classList.toggle("dark", newTheme === "dark")
          }
          return { theme: newTheme }
        }),

      // Notifications
      notifications: [],
      unreadCount: 0,
      addNotification: (notification) =>
        set((state) => ({
          notifications: [notification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        })),
      markNotificationAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
          unreadCount: Math.max(0, state.unreadCount - 1),
        })),
      markAllNotificationsAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        })),
      deleteNotification: (id) =>
        set((state) => {
          const notification = state.notifications.find((n) => n.id === id)
          return {
            notifications: state.notifications.filter((n) => n.id !== id),
            unreadCount: notification && !notification.read ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
          }
        }),

      // Pools
      pools: [],
      setPools: (pools) => set({ pools }),
      addPool: (pool) => set((state) => ({ pools: [pool, ...state.pools] })),
      updatePool: (id, updates) =>
        set((state) => ({
          pools: state.pools.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),
    }),
    {
      name: "farmshare-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        theme: state.theme,
      }),
    },
  ),
)
