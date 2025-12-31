import { httpRequest } from "./httpRequest";
import {
  Notification,
  NotificationType,
  NotificationMedium,
  NotificationPayload,
  NotificationAction,
  DeviceRegistration,
  NotificationResponse,
  NotificationPreferences,
  QueueJobStatus,
  QueueStats,
} from "./notifications.types";

// ============================================================================
// NOTIFICATIONS SERVICE
// ============================================================================

export class NotificationsService {
  /**
   * Get user notifications with pagination
   */
  async getNotifications(params?: {
    page?: number;
    limit?: number;
    read?: boolean;
    type?: NotificationType;
  }): Promise<NotificationResponse> {
    try {
      const response = await httpRequest.get<NotificationResponse>("/notifications/me", {
        params,
      });
      return response;
    } catch (error: any) {
      console.error("Failed to fetch notifications:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch notifications");
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<{ message: string }> {
    try {
      const response = await httpRequest.patch<{ message: string }>(
        `/notifications/${notificationId}/read`
      );
      return response;
    } catch (error: any) {
      console.error("Failed to mark notification as read:", error);
      throw new Error(error.response?.data?.message || "Failed to mark notification as read");
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<{ message: string; count: number }> {
    try {
      const response = await httpRequest.patch<{ message: string; count: number }>(
        "/notifications/read-all"
      );
      return response;
    } catch (error: any) {
      console.error("Failed to mark all notifications as read:", error);
      throw new Error(error.response?.data?.message || "Failed to mark all notifications as read");
    }
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string): Promise<{ message: string }> {
    try {
      const response = await httpRequest.delete<{ message: string }>(
        `/notifications/${notificationId}`
      );
      return response;
    } catch (error: any) {
      console.error("Failed to delete notification:", error);
      throw new Error(error.response?.data?.message || "Failed to delete notification");
    }
  }

  /**
   * Get notification preferences
   */
  async getNotificationPreferences(): Promise<NotificationPreferences> {
    try {
      const response = await httpRequest.get<NotificationPreferences>("/notifications/preferences");
      return response;
    } catch (error: any) {
      console.error("Failed to fetch notification preferences:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch notification preferences");
    }
  }

  /**
   * Update notification preferences
   */
  async updateNotificationPreferences(preferences: NotificationPreferences): Promise<{ message: string }> {
    try {
      const response = await httpRequest.patch<{ message: string }>(
        "/notifications/preferences",
        preferences
      );
      return response;
    } catch (error: any) {
      console.error("Failed to update notification preferences:", error);
      throw new Error(error.response?.data?.message || "Failed to update notification preferences");
    }
  }

  /**
   * Register device for push notifications
   */
  async registerDevice(deviceRegistration: DeviceRegistration): Promise<{ message: string }> {
    try {
      const response = await httpRequest.post<{ message: string }>(
        "/notifications/devices/register",
        deviceRegistration
      );
      return response;
    } catch (error: any) {
      console.error("Device registration failed:", error);
      throw new Error(error.response?.data?.message || "Failed to register device");
    }
  }

  /**
   * Unregister device from push notifications
   */
  async unregisterDevice(token: string): Promise<{ message: string }> {
    try {
      const response = await httpRequest.post<{ message: string }>(
        "/notifications/devices/unregister",
        { token }
      );
      return response;
    } catch (error: any) {
      console.error("Device unregistration failed:", error);
      throw new Error(error.response?.data?.message || "Failed to unregister device");
    }
  }

  /**
   * Send notification (admin only)
   */
  async sendNotification(data: {
    userId: string;
    type: NotificationType;
    medium: NotificationMedium;
    payload: NotificationPayload;
  }): Promise<{ message: string; notificationId: string }> {
    try {
      const response = await httpRequest.post<{ message: string; notificationId: string }>(
        "/notifications/send",
        data
      );
      return response;
    } catch (error: any) {
      console.error("Failed to send notification:", error);
      throw new Error(error.response?.data?.message || "Failed to send notification");
    }
  }

  /**
   * Get queue statistics (admin only)
   */
  async getQueueStats(): Promise<QueueStats> {
    try {
      const response = await httpRequest.get<QueueStats>("/notifications/queue/stats");
      return response;
    } catch (error: any) {
      console.error("Failed to fetch queue stats:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch queue stats");
    }
  }

  /**
   * Get job status (admin only)
   */
  async getJobStatus(jobId: string): Promise<QueueJobStatus> {
    try {
      const response = await httpRequest.get<QueueJobStatus>(`/notifications/queue/jobs/${jobId}`);
      return response;
    } catch (error: any) {
      console.error("Failed to fetch job status:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch job status");
    }
  }

  /**
   * Create notification payload helper
   */
  createNotificationPayload(
    title: string,
    body: string,
    options?: {
      data?: Record<string, any>;
      actions?: NotificationAction[];
      priority?: 'low' | 'normal' | 'high';
    }
  ): NotificationPayload {
    return {
      title,
      body,
      data: options?.data || {},
      actions: options?.actions || [],
      priority: options?.priority || 'normal',
    };
  }

  /**
   * Format notification timestamp for display
   */
  formatNotificationTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) {
      return 'Just now';
    } else if (diffMins < 60) {
      return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  }
}

export const notificationsService = new NotificationsService();