"use client"

import { useStore } from "@/lib/store"
import { formatDistanceToNow } from "date-fns"
import { Bell, Check, CheckCheck, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export default function NotificationsPage() {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } = useStore()

  const unreadNotifications = notifications.filter((n) => !n.read)
  const readNotifications = notifications.filter((n) => n.read)

  const NotificationCard = ({
    notification,
  }: {
    notification: (typeof notifications)[0]
  }) => (
    <Card className={`p-4 ${!notification.read ? "bg-primary/5 border-primary/20" : ""}`}>
      <div className="flex gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className="font-semibold text-base">{notification.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
            </div>
            {!notification.read && <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-2" />}
          </div>
          <div className="flex items-center gap-4">
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(notification.timestamp), {
                addSuffix: true,
              })}
            </p>
            {notification.link && (
              <Link href={notification.link} className="text-xs text-primary hover:underline">
                View details
              </Link>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {!notification.read && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => markNotificationAsRead(notification.id)}
              title="Mark as read"
            >
              <Check className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={() => deleteNotification(notification.id)} title="Delete">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground mt-1">Stay updated with your FarmShare activity</p>
        </div>
        {unreadNotifications.length > 0 && (
          <Button onClick={markAllNotificationsAsRead} variant="outline">
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
        )}
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
          <TabsTrigger value="unread">Unread ({unreadNotifications.length})</TabsTrigger>
          <TabsTrigger value="read">Read ({readNotifications.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3">
          {notifications.length === 0 ? (
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
            notifications.map((notification) => <NotificationCard key={notification.id} notification={notification} />)
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
  )
}
