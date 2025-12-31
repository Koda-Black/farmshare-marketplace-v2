"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bell, BellRing, Check, CheckCheck, Trash2, Settings, RefreshCw, X } from "lucide-react";
import { useNotifications, useNotificationPreferences } from "@/hooks/use-notifications";
import type { Notification as AppNotification, NotificationType } from "@/lib/notifications.types";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface NotificationCenterProps {
  className?: string;
}

export function NotificationCenter({ className }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    delete: deleteNotification,
    loadMore,
    refresh,
    hasMore
  } = useNotifications();
  const { preferences, update: updatePreferences } = useNotificationPreferences();

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (notificationId: string) => {
    await markAsRead(notificationId);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleDelete = async (notificationId: string) => {
    await deleteNotification(notificationId);
  };

  const handleRefresh = async () => {
    await refresh();
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.VERIFICATION:
        return "✅";
      case NotificationType.PAYMENT:
        return "💳";
      case NotificationType.POOL_UPDATE:
        return "🏊";
      case NotificationType.DISPUTE:
        return "⚠️";
      case NotificationType.ADMIN:
        return "👤";
      default:
        return "📢";
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case NotificationType.VERIFICATION:
        return "text-green-600 border-green-200 bg-green-50";
      case NotificationType.PAYMENT:
        return "text-blue-600 border-blue-200 bg-blue-50";
      case NotificationType.POOL_UPDATE:
        return "text-purple-600 border-purple-200 bg-purple-50";
      case NotificationType.DISPUTE:
        return "text-orange-600 border-orange-200 bg-orange-50";
      case NotificationType.ADMIN:
        return "text-gray-600 border-gray-200 bg-gray-50";
      default:
        return "text-gray-500 border-gray-200 bg-gray-50";
    }
  };

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="relative h-9 w-9 p-0"
          >
            {unreadCount > 0 ? (
              <>
                <BellRing className="h-5 w-5" />
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Badge>
              </>
            ) : (
              <Bell className="h-5 w-5" />
            )}
            <span className="sr-only">Notifications</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-96 p-0"
          align="end"
          sideOffset={8}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <DropdownMenuLabel className="text-base font-semibold">
              Notifications
            </DropdownMenuLabel>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="h-8 px-2 text-xs"
                >
                  <CheckCheck className="h-3 w-3 mr-1" />
                  Mark all read
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
                className="h-8 w-8 p-0"
              >
                <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
              </Button>
            </div>
          </div>

          <ScrollArea className="h-96">
            {error && (
              <div className="p-4 text-center text-sm text-red-600">
                {error}
                <Button
                  variant="link"
                  size="sm"
                  onClick={handleRefresh}
                  className="ml-2"
                >
                  Retry
                </Button>
              </div>
            )}

            {isLoading && notifications.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                <RefreshCw className="h-6 w-6 mx-auto mb-2 animate-spin" />
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                No notifications yet
              </div>
            ) : (
              <div className="space-y-1">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={() => handleMarkAsRead(notification.id)}
                    onDelete={() => handleDelete(notification.id)}
                    getIcon={getNotificationIcon}
                    getColor={getNotificationColor}
                    formatTime={formatTimestamp}
                  />
                ))}

                {hasMore && (
                  <div className="p-2 text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={loadMore}
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : null}
                      Load more
                    </Button>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          <div className="p-2 border-t">
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="w-full justify-start"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Notification Settings
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Notification Settings</DialogTitle>
                </DialogHeader>
                <NotificationSettings
                  preferences={preferences}
                  onUpdate={updatePreferences}
                />
              </DialogContent>
            </Dialog>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

interface NotificationItemProps {
  notification: AppNotification;
  onMarkAsRead: () => void;
  onDelete: () => void;
  getIcon: (type: NotificationType) => string;
  getColor: (type: NotificationType) => string;
  formatTime: (date: string) => string;
}

function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
  getIcon,
  getColor,
  formatTime
}: NotificationItemProps) {
  const isRead = notification.read;
  const isUrgent = notification.payload.priority === 'high';

  return (
    <div
      className={cn(
        "p-3 transition-colors hover:bg-muted/50 cursor-pointer relative group",
        !isRead && "bg-muted/30",
        getColor(notification.type)
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "text-lg flex-shrink-0 mt-0.5",
          isRead && "opacity-60"
        )}>
          {getIcon(notification.type)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h4 className={cn(
                "text-sm font-medium truncate",
                !isRead && "font-semibold"
              )}>
                {notification.payload.title}
              </h4>
              <p className={cn(
                "text-xs text-muted-foreground mt-1 line-clamp-2",
                !isRead && "text-foreground"
              )}>
                {notification.payload.body}
              </p>
            </div>

            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {formatTime(notification.createdAt)}
              </span>
              {isUrgent && (
                <Badge variant="destructive" className="text-xs px-1 py-0">
                  Urgent
                </Badge>
              )}
            </div>
          </div>

          {notification.payload.actions && notification.payload.actions.length > 0 && (
            <div className="flex gap-2 mt-2">
              {notification.payload.actions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle action click
                    if (action.url) {
                      window.open(action.url, '_blank');
                    }
                  }}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      {!isRead && (
        <div className="absolute left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full" />
      )}

      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        {!isRead && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsRead();
            }}
          >
            <Check className="h-3 w-3" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

interface NotificationSettingsProps {
  preferences: any;
  onUpdate: (updates: any) => Promise<void>;
}

function NotificationSettings({ preferences, onUpdate }: NotificationSettingsProps) {
  const [localPreferences, setLocalPreferences] = useState(preferences);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setLocalPreferences(preferences);
  }, [preferences]);

  const handleUpdate = async (updates: any) => {
    setIsLoading(true);
    try {
      await onUpdate(updates);
    } catch (error) {
      console.error('Failed to update preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = (path: string) => {
    const keys = path.split('.');
    const newPreferences = { ...localPreferences };
    let current = newPreferences;

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i] as keyof typeof current] as any;
    }

    current[keys[keys.length - 1] as keyof typeof current] = !current[keys[keys.length - 1] as keyof typeof current];

    setLocalPreferences(newPreferences);
    handleUpdate(newPreferences);
  };

  if (!preferences) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        Loading preferences...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-3">Notification Channels</h3>
        <div className="space-y-3">
          {Object.entries({
            email: "Email Notifications",
            sms: "SMS Notifications",
            push: "Push Notifications",
            inApp: "In-App Notifications"
          }).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between">
              <label className="text-sm">{label}</label>
              <button
                onClick={() => handleToggle(key)}
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                  localPreferences[key as keyof typeof localPreferences]
                    ? "bg-primary"
                    : "bg-muted"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                    localPreferences[key as keyof typeof localPreferences]
                      ? "translate-x-6"
                      : "translate-x-1"
                  )}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-sm font-medium mb-3">Notification Types</h3>
        <div className="space-y-3">
          {Object.entries({
            verification: "Identity Verification",
            payment: "Payment Updates",
            poolUpdates: "Pool Updates",
            disputes: "Dispute Updates",
            admin: "Admin Messages"
          }).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between">
              <label className="text-sm">{label}</label>
              <button
                onClick={() => handleToggle(`types.${key}`)}
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                  localPreferences.types?.[key as keyof typeof localPreferences.types]
                    ? "bg-primary"
                    : "bg-muted"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                    localPreferences.types?.[key as keyof typeof localPreferences.types]
                      ? "translate-x-6"
                      : "translate-x-1"
                  )}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}