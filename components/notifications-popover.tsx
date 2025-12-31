"use client"

import { Bell, BellRing } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import { useNotifications } from "@/hooks/use-notifications"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { notificationsService } from "@/lib/notifications.service"
import { cn } from "@/lib/utils"

export function NotificationsPopover() {
  const { isAuthenticated } = useStore()
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    refresh
  } = useNotifications()

  if (!isAuthenticated) {
    return null
  }

  const handleMarkAsRead = async (notificationId: string) => {
    await markAsRead(notificationId)
  }

  const handleMarkAllAsRead = async () => {
    await markAllAsRead()
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "VERIFICATION":
        return "✅"
      case "PAYMENT":
        return "💳"
      case "POOL_UPDATE":
        return "🏊"
      case "DISPUTE":
        return "⚠️"
      case "ADMIN":
        return "👤"
      default:
        return "📢"
    }
  }

  const getNotificationColor = (type: string, read: boolean) => {
    if (read) return ""

    switch (type) {
      case "VERIFICATION":
        return "bg-green-50 border-l-4 border-l-green-500"
      case "PAYMENT":
        return "bg-blue-50 border-l-4 border-l-blue-500"
      case "POOL_UPDATE":
        return "bg-purple-50 border-l-4 border-l-purple-500"
      case "DISPUTE":
        return "bg-orange-50 border-l-4 border-l-orange-500"
      case "ADMIN":
        return "bg-gray-50 border-l-4 border-l-gray-500"
      default:
        return "bg-muted/30"
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {unreadCount > 0 ? (
            <>
              <BellRing className="h-5 w-5" />
              <Badge
                variant="destructive"
                className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </Badge>
            </>
          ) : (
            <Bell className="h-5 w-5" />
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="font-semibold">Notifications</h3>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
              >
                Mark all as read
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={refresh}
              disabled={isLoading}
              className="h-8 w-8 p-0"
            >
              <Bell className={cn("h-4 w-4", isLoading && "animate-spin")} />
            </Button>
          </div>
        </div>
        <ScrollArea className="h-[400px]">
          {isLoading && notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground/50 mb-2 animate-spin" />
              <p className="text-sm text-muted-foreground">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "block p-4 hover:bg-accent transition-colors cursor-pointer",
                    getNotificationColor(notification.type, notification.read)
                  )}
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 text-lg mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium leading-tight">
                          {notification.payload.title}
                        </p>
                        {!notification.read && (
                          <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground leading-snug">
                        {notification.payload.body}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notificationsService.formatNotificationTimestamp(notification.createdAt)}
                      </p>
                      {notification.payload.data?.url && (
                        <Link
                          href={notification.payload.data.url}
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          View details →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <div className="border-t p-2">
          <Link href="/notifications">
            <Button variant="ghost" className="w-full" size="sm">
              View all notifications
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  )
}
