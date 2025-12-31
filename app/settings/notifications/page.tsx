"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Bell, Mail, MessageSquare, RefreshCw, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useNotificationPreferences } from "@/hooks/use-notifications"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function NotificationSettingsPage() {
  const { toast } = useToast()
  const { preferences, isLoading, error, update: updatePreferences } = useNotificationPreferences()
  const [isUpdating, setIsUpdating] = useState(false)

  const handleSave = async () => {
    if (!preferences) return

    setIsUpdating(true)
    try {
      await updatePreferences(preferences)
      toast({
        title: "Settings saved",
        description: "Your notification preferences have been updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save notification preferences. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleToggle = (path: string) => {
    if (!preferences) return

    const keys = path.split('.')
    const updatedPreferences = { ...preferences }
    let current = updatedPreferences

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i] as keyof typeof current] as any
    }

    current[keys[keys.length - 1] as keyof typeof current] = !current[keys[keys.length - 1] as keyof typeof current]

    // Update local state immediately for responsive UI
    updatePreferences(updatedPreferences).catch(() => {
      // Revert on error
      updatePreferences(preferences).catch(() => {})
    })
  }

  return (
    <div className="px-[30px] py-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Notification Settings</h1>
        <p className="text-muted-foreground mt-1">Manage how you receive notifications from FarmShare</p>
      </div>

      {error && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin mr-3" />
          <span>Loading preferences...</span>
        </div>
      ) : preferences ? (
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
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive important updates via email
                  </p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={preferences.email}
                  onCheckedChange={() => handleToggle("email")}
                />
              </div>
            </CardContent>
          </Card>

          {/* SMS Notifications */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                <CardTitle>SMS Notifications</CardTitle>
              </div>
              <CardDescription>Receive updates and alerts via SMS</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="smsNotifications">SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive important updates via text message
                  </p>
                </div>
                <Switch
                  id="smsNotifications"
                  checked={preferences.sms}
                  onCheckedChange={() => handleToggle("sms")}
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
                  <Label htmlFor="pushNotifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive instant notifications on your device
                  </p>
                </div>
                <Switch
                  id="pushNotifications"
                  checked={preferences.push}
                  onCheckedChange={() => handleToggle("push")}
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
                  <Label htmlFor="inAppNotifications">In-App Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Show notifications in the notification center
                  </p>
                </div>
                <Switch
                  id="inAppNotifications"
                  checked={preferences.inApp}
                  onCheckedChange={() => handleToggle("inApp")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Types */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <CardTitle>Notification Types</CardTitle>
              </div>
              <CardDescription>Choose which types of notifications you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="verificationNotifications">Verification Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Updates about your identity verification status
                  </p>
                </div>
                <Switch
                  id="verificationNotifications"
                  checked={preferences.types.verification}
                  onCheckedChange={() => handleToggle("types.verification")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="paymentNotifications">Payment Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Payment confirmations and transaction updates
                  </p>
                </div>
                <Switch
                  id="paymentNotifications"
                  checked={preferences.types.payment}
                  onCheckedChange={() => handleToggle("types.payment")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="poolUpdateNotifications">Pool Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Updates about pool status and changes
                  </p>
                </div>
                <Switch
                  id="poolUpdateNotifications"
                  checked={preferences.types.poolUpdates}
                  onCheckedChange={() => handleToggle("types.poolUpdates")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="disputeNotifications">Dispute Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Notifications about dispute status changes
                  </p>
                </div>
                <Switch
                  id="disputeNotifications"
                  checked={preferences.types.disputes}
                  onCheckedChange={() => handleToggle("types.disputes")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="adminNotifications">Admin Messages</Label>
                  <p className="text-sm text-muted-foreground">
                    Important messages from FarmShare administrators
                  </p>
                </div>
                <Switch
                  id="adminNotifications"
                  checked={preferences.types.admin}
                  onCheckedChange={() => handleToggle("types.admin")}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              size="lg"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Preferences"
              )}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
