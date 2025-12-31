import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
import { Notification as BackendNotification, NotificationType, NotificationMedium } from "./notifications.types";

export type UserRole = "vendor" | "buyer" | "admin";

export type VerificationStatus =
  | "pending"
  | "verified"
  | "rejected"
  | "incomplete";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  phone?: string;
  isVerified: boolean;
  accessToken?: string;
  refreshToken?: string;
  verification_status?: VerificationStatus;
  bank_verified?: boolean;
  created_at: string;
  businessName?: string;
  businessAddress?: string;
}

export interface Pool {
  id: string;
  vendor_id: string;
  vendor?: {
    id: string;
    name: string;
    email: string;
  };
  product_id: string;
  product?: {
    id: string;
    name: string;
    description?: string;
  };
  product_name: string;
  product_description: string;
  slots_count: number;
  slots_filled: number;
  price_total: number;
  price_per_slot: number;
  allow_home_delivery: boolean;
  home_delivery_cost?: number;
  delivery_deadline: string;
  status: "active" | "full" | "completed" | "cancelled";
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: "payment" | "pool_full" | "verification" | "dispute" | "general";
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  link?: string;
  created_at: string;
}

// Backend notification type compatibility
export type AppNotification = BackendNotification;

// ============================================================================
// ADMIN TYPES
// ============================================================================

export interface Admin {
  id: string;
  email: string;
  name: string;
  role: string;
  isAdmin: boolean;
  mfaEnabled: boolean;
  createdAt: string;
  accessToken?: string;
  refreshToken?: string;
  isAuthenticated?: boolean;
}

export interface AdminAuditLog {
  id: string;
  adminId: string;
  action: string;
  targetType: string;
  targetId: string;
  details: any;
  createdAt: string;
}

export interface AdminDashboard {
  users: {
    total: number;
    vendors: number;
    buyers: number;
    banned: number;
    probation: number;
    newThisWeek: number;
  };
  verifications: {
    pending: number;
    completed: number;
    newThisWeek: number;
  };
  disputes: {
    active: number;
    newThisWeek: number;
  };
  pools: {
    total: number;
    active: number;
    completed: number;
    completedThisWeek: number;
  };
  escrow: {
    totalHeld: number;
    totalReleased: number;
  };
  metrics: {
    verificationCompletionRate: number;
    disputeRate: number;
    userGrowthRate: number;
  };
  recentActivity?: AdminAuditLog[];
}

// ============================================================================
// ESCROW TYPES
// ============================================================================

export interface Escrow {
  id: string;
  poolId: string;
  totalHeld: number;
  releasedAmount: number;
  withheldAmount: number;
  withheldReason?: string;
  computations: any;
  createdAt: string;
  updatedAt: string;
}

export interface EscrowDetails {
  escrow: Escrow;
  calculations: {
    commission: number;
    netForVendor: number;
    commissionRate: number;
  };
  pool: Pool;
  pool?: {
    vendor?: User;
    product?: any;
    subscriptions?: Array<{
      id: string;
      userId: string;
      slots: number;
      user?: User;
    }>;
  };
}

// ============================================================================
// DISPUTE TYPES
// ============================================================================

export interface Dispute {
  id: string;
  poolId: string;
  raisedByUserId: string;
  reason: string;
  status: 'open' | 'in_review' | 'resolved' | 'rejected';
  evidenceFiles: string[];
  complainantCount: number;
  resolutionNotes?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
  pool?: Pool;
  raisedBy?: User;
}

export interface DisputeStatistics {
  total: number;
  open: number;
  inReview: number;
  resolved: number;
  rejected: number;
  resolutionRate: number;
}

// ============================================================================
// PAYMENT TYPES
// ============================================================================

export interface PaymentMethod {
  id: string;
  userId: string;
  method: 'STRIPE' | 'PAYSTACK';
  stripeSessionId?: string;
  paystackRef?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  poolId: string;
  amount: number;
  fees: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  type: 'PAYMENT' | 'ESCROW_HOLD' | 'ESCROW_RELEASE' | 'REFUND';
  externalTxnId?: string;
  metadata?: any;
  createdAt: string;
}

export interface UserPaymentMethods {
  stripe: PaymentMethod[];
  paystack: PaymentMethod[];
  defaultMethod?: string;
}

export interface PaymentStats {
  totalRevenue: number;
  totalTransactions: number;
  successRate: number;
  averageTransactionValue: number;
  revenueByMethod: {
    stripe: number;
    paystack: number;
  };
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
    transactions: number;
  }>;
}

// ============================================================================
// NOTIFICATION PREFERENCES TYPES
// ============================================================================

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  inApp: boolean;
  types: {
    verification: boolean;
    payment: boolean;
    poolUpdates: boolean;
    disputes: boolean;
    admin: boolean;
  };
}

export interface DeviceRegistration {
  token: string;
  platform: 'web' | 'ios' | 'android';
  registeredAt: string;
}

export interface QueueJobStatus {
  jobId: string;
  status: 'waiting' | 'active' | 'completed' | 'failed' | 'delayed';
  progress: number;
  data?: any;
  error?: string;
  createdAt: string;
  processedAt?: string;
}

export interface QueueStats {
  name: string;
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
}

// ============================================================================
// APP STATE INTERFACE
// ============================================================================

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;

  // Theme
  theme: "light" | "dark";
  toggleTheme: () => void;

  // Notifications (Legacy - for compatibility)
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;

  // Backend Notifications Integration
  appNotifications: AppNotification[];
  appNotificationsUnreadCount: number;
  appNotificationsTotal: number;
  appNotificationsPage: number;
  appNotificationsHasMore: boolean;
  notificationPreferences: NotificationPreferences | null;
  registeredDevices: DeviceRegistration[];

  // Notification Actions
  setAppNotifications: (notifications: AppNotification[], total: number, hasMore: boolean) => void;
  addAppNotification: (notification: AppNotification) => void;
  markAppNotificationAsRead: (id: string) => void;
  markAllAppNotificationsAsRead: () => void;
  deleteAppNotification: (id: string) => void;
  loadMoreNotifications: () => void;
  setNotificationPreferences: (preferences: NotificationPreferences) => void;
  registerDevice: (device: DeviceRegistration) => void;
  unregisterDevice: (token: string) => void;
  clearNotifications: () => void;

  // Queue Monitoring
  queueStats: QueueStats[];
  jobStatuses: Record<string, QueueJobStatus>;
  setQueueStats: (stats: QueueStats[]) => void;
  setJobStatus: (jobId: string, status: QueueJobStatus) => void;
  clearJobStatus: (jobId: string) => void;

  // Pools (cached)
  pools: Pool[];
  setPools: (pools: Pool[]) => void;
  addPool: (pool: Pool) => void;
  updatePool: (id: string, updates: Partial<Pool>) => void;

  // Verification (Government ID)
  selectedIdType?: string;
  setSelectedIdType?: (type: string) => void;

  // ==================== ADMIN STATE ====================

  // Admin Authentication
  admin: Admin | null;
  isAdminAuthenticated: boolean;
  setAdmin: (admin: Admin | null) => void;
  adminLogout: () => void;

  // Admin Dashboard
  adminDashboard: AdminDashboard | null;
  setAdminDashboard: (dashboard: AdminDashboard | null) => void;

  // Pending Verifications
  pendingVerifications: any[];
  setPendingVerifications: (verifications: any[]) => void;

  // User Management
  managedUsers: User[];
  setManagedUsers: (users: User[]) => void;

  // ==================== ESCROW STATE ====================

  // User's escrow details
  userEscrows: EscrowDetails[];
  setUserEscrows: (escrows: EscrowDetails[]) => void;
  addUserEscrow: (escrow: EscrowDetails) => void;
  updateUserEscrow: (poolId: string, updates: Partial<EscrowDetails>) => void;

  // Vendor's escrow management
  vendorEscrows: EscrowDetails[];
  setVendorEscrows: (escrows: EscrowDetails[]) => void;

  // ==================== DISPUTE STATE ====================

  // User's disputes
  userDisputes: Dispute[];
  setUserDisputes: (disputes: Dispute[]) => void;
  addUserDispute: (dispute: Dispute) => void;
  updateUserDispute: (id: string, updates: Partial<Dispute>) => void;

  // Admin dispute management
  managedDisputes: Dispute[];
  disputeStats: DisputeStatistics | null;
  setManagedDisputes: (disputes: Dispute[]) => void;
  setDisputeStats: (stats: DisputeStatistics | null) => void;

  // ==================== PAYMENT STATE ====================

  // User's payment methods
  userPaymentMethods: UserPaymentMethods | null;
  setUserPaymentMethods: (methods: UserPaymentMethods | null) => void;

  // User's transactions
  userTransactions: Transaction[];
  setUserTransactions: (transactions: Transaction[]) => void;
  addUserTransaction: (transaction: Transaction) => void;

  // Payment statistics
  paymentStats: PaymentStats | null;
  setPaymentStats: (stats: PaymentStats | null) => void;

  // Vendor earnings
  vendorEarnings: {
    totalEarnings: number;
    pendingEarnings: number;
    releasedEarnings: number;
    commissions: number;
    recentPayouts: Array<{
      id: string;
      amount: number;
      status: string;
      date: string;
    }>;
  } | null;
  setVendorEarnings: (earnings: any) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // ==================== AUTH ====================
      user: null,
      isAuthenticated: false,
      setUser: (user) => {
        // Normalize role to lowercase if it exists
        const normalizedUser = user ? {
          ...user,
          role: user.role?.toLowerCase()
        } : null;

        set({ user: normalizedUser, isAuthenticated: !!normalizedUser });

        if (typeof window !== "undefined") {
          if (normalizedUser) {
            Cookies.set(
              "farmshare-auth",
              JSON.stringify({ user: normalizedUser, isAuthenticated: true }),
              { expires: 7 }
            );
          } else {
            Cookies.remove("farmshare-auth");
          }
        }
      },
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          notifications: [],
          userEscrows: [],
          userDisputes: [],
          userPaymentMethods: null,
          userTransactions: [],
          paymentStats: null,
          vendorEarnings: null,
        }),

      // ==================== ADMIN AUTH ====================
      admin: null,
      isAdminAuthenticated: false,
      setAdmin: (admin) => {
        const isAuthenticated = !!(admin && (admin.isAuthenticated || admin.accessToken));
        set({ admin, isAdminAuthenticated: isAuthenticated });

        if (typeof window !== "undefined") {
          if (admin && isAuthenticated) {
            Cookies.set(
              "farmshare-admin-auth",
              JSON.stringify({ admin, isAdminAuthenticated: true }),
              { expires: 1 } // Admin sessions last 1 day
            );
          } else {
            Cookies.remove("farmshare-admin-auth");
          }
        }
      },
      adminLogout: () =>
        set({
          admin: null,
          isAdminAuthenticated: false,
          adminDashboard: null,
          pendingVerifications: [],
          managedUsers: [],
          managedDisputes: [],
          disputeStats: null,
        }),

      // ==================== THEME ====================
      theme: "light",
      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === "light" ? "dark" : "light";
          if (typeof document !== "undefined") {
            document.documentElement.classList.toggle(
              "dark",
              newTheme === "dark"
            );
          }
          return { theme: newTheme };
        }),

      // ==================== NOTIFICATIONS (LEGACY) ====================
      notifications: [],
      unreadCount: 0,
      addNotification: (notification) =>
        set((state) => ({
          notifications: [notification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        })),
      markNotificationAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        })),
      markAllNotificationsAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        })),
      deleteNotification: (id) =>
        set((state) => {
          const notification = state.notifications.find((n) => n.id === id);
          return {
            notifications: state.notifications.filter((n) => n.id !== id),
            unreadCount:
              notification && !notification.read
                ? Math.max(0, state.unreadCount - 1)
                : state.unreadCount,
          };
        }),

      // ==================== BACKEND NOTIFICATIONS ====================
      appNotifications: [],
      appNotificationsUnreadCount: 0,
      appNotificationsTotal: 0,
      appNotificationsPage: 1,
      appNotificationsHasMore: true,
      notificationPreferences: null,
      registeredDevices: [],
      queueStats: [],
      jobStatuses: {},

      setAppNotifications: (notifications, total, hasMore) =>
        set((state) => {
          const unreadCount = notifications.filter((n) => !n.read).length;
          return {
            appNotifications: notifications,
            appNotificationsTotal: total,
            appNotificationsUnreadCount: unreadCount,
            appNotificationsHasMore: hasMore,
          };
        }),

      addAppNotification: (notification) =>
        set((state) => {
          const isDuplicate = state.appNotifications.some((n) => n.id === notification.id);
          if (isDuplicate) return state;

          const newUnreadCount = notification.read
            ? state.appNotificationsUnreadCount
            : state.appNotificationsUnreadCount + 1;

          return {
            appNotifications: [notification, ...state.appNotifications],
            appNotificationsTotal: state.appNotificationsTotal + 1,
            appNotificationsUnreadCount: newUnreadCount,
          };
        }),

      markAppNotificationAsRead: (id) =>
        set((state) => {
          const wasUnread = state.appNotifications.find((n) => n.id === id && !n.read);
          return {
            appNotifications: state.appNotifications.map((n) =>
              n.id === id ? { ...n, read: true } : n
            ),
            appNotificationsUnreadCount: wasUnread
              ? Math.max(0, state.appNotificationsUnreadCount - 1)
              : state.appNotificationsUnreadCount,
          };
        }),

      markAllAppNotificationsAsRead: () =>
        set((state) => ({
          appNotifications: state.appNotifications.map((n) => ({ ...n, read: true })),
          appNotificationsUnreadCount: 0,
        })),

      deleteAppNotification: (id) =>
        set((state) => {
          const notification = state.appNotifications.find((n) => n.id === id);
          const wasUnread = notification && !notification.read;
          return {
            appNotifications: state.appNotifications.filter((n) => n.id !== id),
            appNotificationsTotal: state.appNotificationsTotal - 1,
            appNotificationsUnreadCount: wasUnread
              ? Math.max(0, state.appNotificationsUnreadCount - 1)
              : state.appNotificationsUnreadCount,
          };
        }),

      loadMoreNotifications: () =>
        set((state) => ({
          appNotificationsPage: state.appNotificationsPage + 1,
        })),

      setNotificationPreferences: (preferences) =>
        set({ notificationPreferences: preferences }),

      registerDevice: (device) =>
        set((state) => {
          const existingDeviceIndex = state.registeredDevices.findIndex(
            (d) => d.token === device.token
          );

          if (existingDeviceIndex >= 0) {
            const updatedDevices = [...state.registeredDevices];
            updatedDevices[existingDeviceIndex] = device;
            return { registeredDevices: updatedDevices };
          }

          return {
            registeredDevices: [...state.registeredDevices, device],
          };
        }),

      unregisterDevice: (token) =>
        set((state) => ({
          registeredDevices: state.registeredDevices.filter((d) => d.token !== token),
        })),

      clearNotifications: () =>
        set({
          appNotifications: [],
          appNotificationsUnreadCount: 0,
          appNotificationsTotal: 0,
          appNotificationsPage: 1,
          appNotificationsHasMore: true,
        }),

      setQueueStats: (stats) =>
        set({ queueStats: stats }),

      setJobStatus: (jobId, status) =>
        set((state) => ({
          jobStatuses: {
            ...state.jobStatuses,
            [jobId]: status,
          },
        })),

      clearJobStatus: (jobId) =>
        set((state) => {
          const newJobStatuses = { ...state.jobStatuses };
          delete newJobStatuses[jobId];
          return { jobStatuses: newJobStatuses };
        }),

      // ==================== POOLS ====================
      pools: [],
      setPools: (pools) => set({ pools }),
      addPool: (pool) => set((state) => ({ pools: [pool, ...state.pools] })),
      updatePool: (id, updates) =>
        set((state) => ({
          pools: state.pools.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),

      // ==================== VERIFICATION ====================
      selectedIdType: "",
      setSelectedIdType: (type) => set({ selectedIdType: type }),

      // ==================== ADMIN DASHBOARD ====================
      adminDashboard: null,
      setAdminDashboard: (dashboard) => set({ adminDashboard: dashboard }),

      // ==================== PENDING VERIFICATIONS ====================
      pendingVerifications: [],
      setPendingVerifications: (verifications) => set({ pendingVerifications: verifications }),

      // ==================== MANAGED USERS ====================
      managedUsers: [],
      setManagedUsers: (users) => set({ managedUsers: users }),

      // ==================== USER ESCROWS ====================
      userEscrows: [],
      setUserEscrows: (escrows) => set({ userEscrows: escrows }),
      addUserEscrow: (escrow) =>
        set((state) => ({
          userEscrows: [escrow, ...state.userEscrows],
        })),
      updateUserEscrow: (poolId, updates) =>
        set((state) => ({
          userEscrows: state.userEscrows.map((e) =>
            e.pool.id === poolId ? { ...e, ...updates } : e
          ),
        })),

      // ==================== VENDOR ESCROWS ====================
      vendorEscrows: [],
      setVendorEscrows: (escrows) => set({ vendorEscrows: escrows }),

      // ==================== USER DISPUTES ====================
      userDisputes: [],
      setUserDisputes: (disputes) => set({ userDisputes: disputes }),
      addUserDispute: (dispute) =>
        set((state) => ({
          userDisputes: [dispute, ...state.userDisputes],
        })),
      updateUserDispute: (id, updates) =>
        set((state) => ({
          userDisputes: state.userDisputes.map((d) =>
            d.id === id ? { ...d, ...updates } : d
          ),
        })),

      // ==================== MANAGED DISPUTES ====================
      managedDisputes: [],
      disputeStats: null,
      setManagedDisputes: (disputes) => set({ managedDisputes: disputes }),
      setDisputeStats: (stats) => set({ disputeStats: stats }),

      // ==================== PAYMENT METHODS ====================
      userPaymentMethods: null,
      setUserPaymentMethods: (methods) => set({ userPaymentMethods: methods }),

      // ==================== USER TRANSACTIONS ====================
      userTransactions: [],
      setUserTransactions: (transactions) => set({ userTransactions: transactions }),
      addUserTransaction: (transaction) =>
        set((state) => ({
          userTransactions: [transaction, ...state.userTransactions],
        })),

      // ==================== PAYMENT STATS ====================
      paymentStats: null,
      setPaymentStats: (stats) => set({ paymentStats: stats }),

      // ==================== VENDOR EARNINGS ====================
      vendorEarnings: null,
      setVendorEarnings: (earnings) => set({ vendorEarnings: earnings }),
    }),
    {
      name: "farmshare-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        admin: state.admin,
        isAdminAuthenticated: state.isAdminAuthenticated,
        theme: state.theme,
        selectedIdType: state.selectedIdType,
        // Don't persist data that should be fresh from API
        // userEscrows, userDisputes, transactions, etc. will be fetched on demand
      }),
    }
  )
);
