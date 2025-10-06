"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Bell, Mail, MessageSquare } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function NotificationSettingsPage() {
  const { toast } = useToast()
  const [settings, setSettings] = useState({
    // Email notifications
    emailPoolUpdates: true,
    emailOrderStatus: true,
    emailPayments: true,
    emailMarketing: false,
    emailWeeklyDigest: true,

    // Push notifications
    pushPoolUpdates: true,
    pushOrderStatus: true,
    pushPayments: true,
    pushMessages: true,
    pushPromotions: false,

    // In-app notifications
    inAppPoolUpdates: true,
    inAppOrderStatus: true,
    inAppPayments: true,
    inAppMessages: true,
  })

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your notification preferences have been updated.",
    })
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Notification Settings</h1>
        <p className="text-muted-foreground mt-1">Manage how you receive notifications from FarmShare</p>
      </div>

      <div className="space-y-6">
        {/* Email Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <CardTitle>Email Notifications</CardTitle>
            </div>
            <CardDescription>Receive updates and alerts via email</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="emailPoolUpdates">Pool Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when pools you're interested in are updated
                </p>
              </div>
              <Switch
                id="emailPoolUpdates"
                checked={settings.emailPoolUpdates}
                onCheckedChange={() => handleToggle("emailPoolUpdates")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="emailOrderStatus">Order Status</Label>
                <p className="text-sm text-muted-foreground">Updates about your order status and delivery</p>
              </div>
              <Switch
                id="emailOrderStatus"
                checked={settings.emailOrderStatus}
                onCheckedChange={() => handleToggle("emailOrderStatus")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="emailPayments">Payment Confirmations</Label>
                <p className="text-sm text-muted-foreground">Receipts and payment confirmations</p>
              </div>
              <Switch
                id="emailPayments"
                checked={settings.emailPayments}
                onCheckedChange={() => handleToggle("emailPayments")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="emailWeeklyDigest">Weekly Digest</Label>
                <p className="text-sm text-muted-foreground">Summary of new pools and platform updates</p>
              </div>
              <Switch
                id="emailWeeklyDigest"
                checked={settings.emailWeeklyDigest}
                onCheckedChange={() => handleToggle("emailWeeklyDigest")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="emailMarketing">Marketing & Promotions</Label>
                <p className="text-sm text-muted-foreground">Special offers and promotional content</p>
              </div>
              <Switch
                id="emailMarketing"
                checked={settings.emailMarketing}
                onCheckedChange={() => handleToggle("emailMarketing")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Push Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle>Push Notifications</CardTitle>
            </div>
            <CardDescription>Receive instant notifications on your device</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="pushPoolUpdates">Pool Updates</Label>
                <p className="text-sm text-muted-foreground">Real-time updates on pool status changes</p>
              </div>
              <Switch
                id="pushPoolUpdates"
                checked={settings.pushPoolUpdates}
                onCheckedChange={() => handleToggle("pushPoolUpdates")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="pushOrderStatus">Order Status</Label>
                <p className="text-sm text-muted-foreground">Instant updates on your order progress</p>
              </div>
              <Switch
                id="pushOrderStatus"
                checked={settings.pushOrderStatus}
                onCheckedChange={() => handleToggle("pushOrderStatus")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="pushPayments">Payment Alerts</Label>
                <p className="text-sm text-muted-foreground">Instant payment confirmations and alerts</p>
              </div>
              <Switch
                id="pushPayments"
                checked={settings.pushPayments}
                onCheckedChange={() => handleToggle("pushPayments")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="pushMessages">Messages</Label>
                <p className="text-sm text-muted-foreground">New messages from vendors or support</p>
              </div>
              <Switch
                id="pushMessages"
                checked={settings.pushMessages}
                onCheckedChange={() => handleToggle("pushMessages")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="pushPromotions">Promotions</Label>
                <p className="text-sm text-muted-foreground">Special deals and limited-time offers</p>
              </div>
              <Switch
                id="pushPromotions"
                checked={settings.pushPromotions}
                onCheckedChange={() => handleToggle("pushPromotions")}
              />
            </div>
          </CardContent>
        </Card>

        {/* In-App Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <CardTitle>In-App Notifications</CardTitle>
            </div>
            <CardDescription>Notifications within the FarmShare platform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="inAppPoolUpdates">Pool Updates</Label>
                <p className="text-sm text-muted-foreground">Show pool updates in notification center</p>
              </div>
              <Switch
                id="inAppPoolUpdates"
                checked={settings.inAppPoolUpdates}
                onCheckedChange={() => handleToggle("inAppPoolUpdates")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="inAppOrderStatus">Order Status</Label>
                <p className="text-sm text-muted-foreground">Show order updates in notification center</p>
              </div>
              <Switch
                id="inAppOrderStatus"
                checked={settings.inAppOrderStatus}
                onCheckedChange={() => handleToggle("inAppOrderStatus")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="inAppPayments">Payment Alerts</Label>
                <p className="text-sm text-muted-foreground">Show payment confirmations in notification center</p>
              </div>
              <Switch
                id="inAppPayments"
                checked={settings.inAppPayments}
                onCheckedChange={() => handleToggle("inAppPayments")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="inAppMessages">Messages</Label>
                <p className="text-sm text-muted-foreground">Show new messages in notification center</p>
              </div>
              <Switch
                id="inAppMessages"
                checked={settings.inAppMessages}
                onCheckedChange={() => handleToggle("inAppMessages")}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} size="lg">
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  )
}
