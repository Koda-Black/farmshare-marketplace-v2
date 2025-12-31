import { useEffect, useCallback, useState } from "react";
import { useStore } from "@/lib/store";
import { notificationsService } from "@/lib/notifications.service";
import type {
  Notification as AppNotification,
  NotificationType,
  NotificationMedium,
  NotificationPreferences,
  DeviceRegistration,
  QueueJobStatus,
  QueueStats,
} from "@/lib/notifications.types";

/**
 * Hook for managing app notifications from the backend
 */
export function useNotifications() {
  const {
    appNotifications,
    appNotificationsUnreadCount,
    appNotificationsTotal,
    appNotificationsPage,
    appNotificationsHasMore,
    notificationPreferences,
    isAuthenticated,
    setAppNotifications,
    addAppNotification,
    markAppNotificationAsRead,
    markAllAppNotificationsAsRead,
    deleteAppNotification,
    loadMoreNotifications,
    setNotificationPreferences,
    clearNotifications,
  } = useStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch notifications from the backend
   */
  const fetchNotifications = useCallback(
    async (params?: {
      page?: number;
      limit?: number;
      unreadOnly?: boolean;
      type?: NotificationType;
    }) => {
      if (!isAuthenticated) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await notificationsService.getNotifications(params);
        setAppNotifications(response.notifications, response.total, response.notifications.length >= (params?.limit || 20));
      } catch (err: any) {
        setError(err.message || "Failed to fetch notifications");
        console.error("Fetch notifications error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, setAppNotifications]
  );

  /**
   * Load more notifications (pagination)
   */
  const loadMore = useCallback(async () => {
    if (!isAuthenticated || isLoading || !appNotificationsHasMore) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await notificationsService.getNotifications({
        page: appNotificationsPage + 1,
        limit: 20,
      });

      // Append new notifications to existing ones
      const updatedNotifications = [...appNotifications, ...response.notifications];
      setAppNotifications(updatedNotifications, response.total, response.notifications.length >= 20);

      loadMoreNotifications();
    } catch (err: any) {
      setError(err.message || "Failed to load more notifications");
      console.error("Load more notifications error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [
    isAuthenticated,
    isLoading,
    appNotificationsHasMore,
    appNotificationsPage,
    appNotifications,
    setAppNotifications,
    loadMoreNotifications,
  ]);

  /**
   * Mark a notification as read
   */
  const markAsRead = useCallback(
    async (notificationId: string) => {
      try {
        await notificationsService.markAsRead(notificationId);
        markAppNotificationAsRead(notificationId);
      } catch (err: any) {
        setError(err.message || "Failed to mark notification as read");
        console.error("Mark as read error:", err);
      }
    },
    [markAppNotificationAsRead]
  );

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationsService.markAllAsRead();
      markAllAppNotificationsAsRead();
    } catch (err: any) {
      setError(err.message || "Failed to mark all notifications as read");
      console.error("Mark all as read error:", err);
    }
  }, [markAllAppNotificationsAsRead]);

  /**
   * Delete a notification
   */
  const deleteNotification = useCallback(
    async (notificationId: string) => {
      try {
        await notificationsService.deleteNotification(notificationId);
        deleteAppNotification(notificationId);
      } catch (err: any) {
        setError(err.message || "Failed to delete notification");
        console.error("Delete notification error:", err);
      }
    },
    [deleteAppNotification]
  );

  /**
   * Refresh notifications
   */
  const refresh = useCallback(() => {
    fetchNotifications({ page: 1, limit: 20 });
  }, [fetchNotifications]);

  // Auto-refresh notifications when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications({ page: 1, limit: 20 });
    } else {
      clearNotifications();
    }
  }, [isAuthenticated, fetchNotifications, clearNotifications]);

  return {
    // Data
    notifications: appNotifications,
    unreadCount: appNotificationsUnreadCount,
    totalCount: appNotificationsTotal,
    hasMore: appNotificationsHasMore,
    preferences: notificationPreferences,

    // Loading states
    isLoading,
    error,

    // Actions
    fetch: fetchNotifications,
    loadMore,
    markAsRead,
    markAllAsRead,
    delete: deleteNotification,
    refresh,
  };
}

/**
 * Hook for managing notification preferences
 */
export function useNotificationPreferences() {
  const { notificationPreferences, setNotificationPreferences, isAuthenticated } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch notification preferences
   */
  const fetchPreferences = useCallback(async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    setError(null);

    try {
      const preferences = await notificationsService.getNotificationPreferences();
      setNotificationPreferences(preferences);
    } catch (err: any) {
      setError(err.message || "Failed to fetch notification preferences");
      console.error("Fetch preferences error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, setNotificationPreferences]);

  /**
   * Update notification preferences
   */
  const updatePreferences = useCallback(
    async (updates: Partial<NotificationPreferences>) => {
      if (!isAuthenticated) return;

      setIsLoading(true);
      setError(null);

      try {
        const updatedPreferences = await notificationsService.updateNotificationPreferences(updates);
        setNotificationPreferences(updatedPreferences);
        return updatedPreferences;
      } catch (err: any) {
        setError(err.message || "Failed to update notification preferences");
        console.error("Update preferences error:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, setNotificationPreferences]
  );

  // Auto-fetch preferences when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && !notificationPreferences) {
      fetchPreferences();
    }
  }, [isAuthenticated, notificationPreferences, fetchPreferences]);

  return {
    preferences: notificationPreferences,
    isLoading,
    error,
    fetch: fetchPreferences,
    update: updatePreferences,
  };
}

/**
 * Hook for managing push notification devices
 */
export function useNotificationDevices() {
  const { registeredDevices, registerDevice, unregisterDevice, isAuthenticated } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Register device for push notifications
   */
  const register = useCallback(
    async (token: string, platform: 'web' | 'ios' | 'android' = 'web') => {
      if (!isAuthenticated) return;

      setIsLoading(true);
      setError(null);

      try {
        await notificationsService.registerDevice({ token, platform });
        registerDevice({ token, platform, registeredAt: new Date().toISOString() });
      } catch (err: any) {
        setError(err.message || "Failed to register device");
        console.error("Register device error:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, registerDevice]
  );

  /**
   * Unregister device from push notifications
   */
  const unregister = useCallback(
    async (token: string) => {
      if (!isAuthenticated) return;

      setIsLoading(true);
      setError(null);

      try {
        await notificationsService.unregisterDevice(token);
        unregisterDevice(token);
      } catch (err: any) {
        setError(err.message || "Failed to unregister device");
        console.error("Unregister device error:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, unregisterDevice]
  );

  /**
   * Request notification permission and register device
   */
  const requestPermissionAndRegister = useCallback(
    async (platform: 'web' | 'ios' | 'android' = 'web') => {
      if (typeof window === "undefined" || !("Notification" in window)) {
        throw new Error("Notifications not supported in this browser");
      }

      let permission = globalThis.Notification.permission;

      if (permission === "default") {
        permission = await globalThis.Notification.requestPermission();
      }

      if (permission !== "granted") {
        throw new Error("Notification permission denied");
      }

      // For web, get FCM token (you'll need to integrate Firebase here)
      if (platform === "web") {
        // This is where you would integrate Firebase Cloud Messaging
        // to get the FCM token
        const mockToken = `web_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await register(mockToken, platform);
        return mockToken;
      }

      return null;
    },
    [register]
  );

  return {
    devices: registeredDevices,
    isLoading,
    error,
    register,
    unregister,
    requestPermissionAndRegister,
  };
}

/**
 * Hook for monitoring queue status
 */
export function useQueueMonitoring() {
  const { queueStats, jobStatuses, setQueueStats, setJobStatus, clearJobStatus, isAdminAuthenticated } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch queue statistics
   */
  const fetchQueueStats = useCallback(async () => {
    if (!isAdminAuthenticated) return;

    setIsLoading(true);
    setError(null);

    try {
      const stats = await notificationsService.getQueueStats();
      setQueueStats(stats);
    } catch (err: any) {
      setError(err.message || "Failed to fetch queue statistics");
      console.error("Fetch queue stats error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [isAdminAuthenticated, setQueueStats]);

  /**
   * Get job status
   */
  const getJobStatus = useCallback(
    async (jobId: string): Promise<QueueJobStatus | null> => {
      try {
        const status = await notificationsService.getJobStatus(jobId);
        setJobStatus(jobId, status);
        return status;
      } catch (err: any) {
        console.error("Get job status error:", err);
        return null;
      }
    },
    [setJobStatus]
  );

  /**
   * Monitor job status (polling)
   */
  const monitorJob = useCallback(
    (jobId: string, onCompleted?: (status: QueueJobStatus) => void, onError?: (error: string) => void) => {
      const pollInterval = setInterval(async () => {
        try {
          const status = await getJobStatus(jobId);
          if (status) {
            if (status.status === "completed" || status.status === "failed") {
              clearInterval(pollInterval);
              if (onCompleted) onCompleted(status);
            }
          }
        } catch (err: any) {
          clearInterval(pollInterval);
          if (onError) onError(err.message);
        }
      }, 2000); // Poll every 2 seconds

      // Cleanup function
      return () => clearInterval(pollInterval);
    },
    [getJobStatus]
  );

  // Auto-refresh queue stats for admin users
  useEffect(() => {
    if (isAdminAuthenticated) {
      fetchQueueStats();
      const interval = setInterval(fetchQueueStats, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isAdminAuthenticated, fetchQueueStats]);

  return {
    stats: queueStats,
    jobStatuses,
    isLoading,
    error,
    fetchStats: fetchQueueStats,
    getJobStatus,
    monitorJob,
    clearJobStatus: (jobId: string) => {
      clearJobStatus(jobId);
    },
  };
}

/**
 * Hook for real-time notification delivery simulation
 * (In a real implementation, this would use WebSockets or Server-Sent Events)
 */
export function useRealtimeNotifications() {
  const { addAppNotification, isAuthenticated } = useStore();
  const [isConnected, setIsConnected] = useState(false);

  // Simulate real-time notifications
  useEffect(() => {
    if (!isConnected && isAuthenticated) {
      // In a real implementation, you would establish a WebSocket connection here
      setIsConnected(true);

      // Simulate incoming notifications (for demo purposes)
      const simulatedNotifications = [
        {
          id: `sim_${Date.now()}`,
          userId: "current_user",
          type: NotificationType.VERIFICATION,
          medium: NotificationMedium.IN_APP,
          payload: {
            title: "Verification Complete",
            body: "Your identity verification has been approved!",
            priority: "normal" as const,
          },
          read: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: `sim_${Date.now() + 1}`,
          userId: "current_user",
          type: NotificationType.PAYMENT,
          medium: NotificationMedium.IN_APP,
          payload: {
            title: "Payment Received",
            body: "Your payment of ₦5,000 has been confirmed.",
            priority: "normal" as const,
          },
          read: false,
          createdAt: new Date().toISOString(),
        },
      ];

      // Add simulated notification after 10 seconds (for demo)
      const timer = setTimeout(() => {
        const randomNotification = simulatedNotifications[Math.floor(Math.random() * simulatedNotifications.length)];
        addAppNotification(randomNotification);
      }, 10000);

      return () => {
        clearTimeout(timer);
        setIsConnected(false);
      };
    }
  }, [isAuthenticated, addAppNotification, isConnected]);

  return { isConnected };
}