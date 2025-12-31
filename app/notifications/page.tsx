"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { useNotifications } from "@/hooks/use-notifications"
import { formatDistanceToNow } from "date-fns"
import { Bell, Check, CheckCheck, Trash2, RefreshCw, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { notificationsService } from "@/lib/notifications.service"
import { cn } from "@/lib/utils"

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const {
    notifications,
    unreadCount,
    totalCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    delete: deleteNotification,
    refresh,
    loadMore,
    hasMore
  } = useNotifications()

  const unreadNotifications = notifications.filter((n) => !n.read)
  const readNotifications = notifications.filter((n) => n.read)

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

  const NotificationCard = ({
    notification,
  }: {
    notification: typeof notifications[0]
  }) => (
    <Card className={`p-4 ${getNotificationColor(notification.type, notification.read)}`}>
      <div className="flex gap-4">
        <div className="flex-shrink-0 text-lg mt-0.5">
          {getNotificationIcon(notification.type)}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className="font-semibold text-base">{notification.payload.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{notification.payload.body}</p>
              {notification.payload.priority === 'high' && (
                <Badge variant="destructive" className="text-xs mt-2">
                  Urgent
                </Badge>
              )}
            </div>
            {!notification.read && <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-2" />}
          </div>
          <div className="flex items-center gap-4">
            <p className="text-xs text-muted-foreground">
              {notificationsService.formatNotificationTimestamp(notification.createdAt)}
            </p>
            {notification.payload.data?.url && (
              <Link
                href={notification.payload.data.url}
                className="text-xs text-primary hover:underline"
              >
                View details
              </Link>
            )}
            {notification.payload.actions && notification.payload.actions.length > 0 && (
              <div className="flex gap-2">
                {notification.payload.actions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => {
                      if (action.url) {
                        window.open(action.url, '_blank')
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
        <div className="flex flex-col gap-2">
          {!notification.read && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => markAsRead(notification.id)}
              title="Mark as read"
            >
              <Check className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteNotification(notification.id)}
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )

  const handleMarkAllAsRead = async () => {
    await markAllAsRead()
  }

  const handleRefresh = async () => {
    await refresh()
  }

  return (
    <div className="px-[30px] py-8">
      <div className="max-w-4xl mx-auto">
      {error && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground mt-1">
            Stay updated with your FarmShare activity
            {totalCount > 0 && (
              <span className="ml-2">({unreadCount} unread)</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleRefresh}
            variant="outline"
            disabled={isLoading}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
            Refresh
          </Button>
          {unreadCount > 0 && (
            <Button onClick={handleMarkAllAsRead} variant="outline">
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All ({totalCount})</TabsTrigger>
          <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
          <TabsTrigger value="read">Read ({totalCount - unreadCount})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3">
          {isLoading && notifications.length === 0 ? (
            <Card className="p-12">
              <div className="flex flex-col items-center justify-center text-center">
                <Bell className="h-16 w-16 text-muted-foreground/50 mb-4 animate-spin" />
                <h3 className="text-lg font-semibold mb-2">Loading notifications...</h3>
              </div>
            </Card>
          ) : notifications.length === 0 ? (
            <Card className="p-12">
              <div className="flex flex-col items-center justify-center text-center">
                <Bell className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No notifications yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  When you receive notifications about your pools, orders, or account activity, they'll appear here.
                </p>
              </div>
            </Card>
          ) : (
            <>
              {notifications.map((notification) => (
                <NotificationCard key={notification.id} notification={notification} />
              ))}
              {hasMore && (
                <div className="text-center">
                  <Button
                    variant="outline"
                    onClick={loadMore}
                    disabled={isLoading}
                    className="mt-4"
                  >
                    {isLoading ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : null}
                    Load more notifications
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="unread" className="space-y-3">
          {unreadNotifications.length === 0 ? (
            <Card className="p-12">
              <div className="flex flex-col items-center justify-center text-center">
                <CheckCheck className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
                <p className="text-sm text-muted-foreground">You have no unread notifications.</p>
              </div>
            </Card>
          ) : (
            unreadNotifications.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))
          )}
        </TabsContent>

        <TabsContent value="read" className="space-y-3">
          {readNotifications.length === 0 ? (
            <Card className="p-12">
              <div className="flex flex-col items-center justify-center text-center">
                <Bell className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No read notifications</h3>
                <p className="text-sm text-muted-foreground">Notifications you've read will appear here.</p>
              </div>
            </Card>
          ) : (
            readNotifications.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))
          )}
        </TabsContent>
      </Tabs>
      </div>
    </div>
  )
}
