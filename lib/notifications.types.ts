export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  medium: NotificationMedium;
  payload: NotificationPayload;
  read: boolean;
  createdAt: string;
  deliveredAt?: string;
}

export enum NotificationType {
  VERIFICATION = "VERIFICATION",
  PAYMENT = "PAYMENT",
  POOL_UPDATE = "POOL_UPDATE",
  DISPUTE = "DISPUTE",
  ADMIN = "ADMIN",
}

export enum NotificationMedium {
  IN_APP = "IN_APP",
  EMAIL = "EMAIL",
  SMS = "SMS",
  PUSH = "PUSH",
  WEBHOOK = "WEBHOOK",
}

export interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, any>;
  actions?: NotificationAction[];
  priority?: 'low' | 'normal' | 'high';
}

export interface NotificationAction {
  label: string;
  action: string;
  url?: string;
  method?: 'GET' | 'POST' | 'PATCH';
}

export interface DeviceRegistration {
  token: string;
  platform: 'ios' | 'android' | 'web';
  userId: string;
  preferences?: NotificationPreferences;
}

export interface NotificationResponse {
  notifications: Notification[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export interface NotificationPreferences {
  inApp: boolean;
  email: boolean;
  sms: boolean;
  push: boolean;
  types: NotificationType[];
  quietHours?: {
    start: string;
    end: string;
    timezone: string;
  };
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
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
  total: number;
}