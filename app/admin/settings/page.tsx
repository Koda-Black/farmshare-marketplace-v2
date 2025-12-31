"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAdminAuth } from "@/hooks/use-admin"
import { adminService } from "@/lib/admin.service"
import { Shield, ShieldCheck, ShieldOff, QrCode, Key, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default function AdminSettingsPage() {
  const { admin, isAdminAuthenticated } = useAdminAuth()
  const [mfaEnabled, setMfaEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // MFA Setup States
  const [showMfaSetup, setShowMfaSetup] = useState(false)
  const [showMfaDisable, setShowMfaDisable] = useState(false)
  const [qrCode, setQrCode] = useState("")
  const [mfaSecret, setMfaSecret] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [disableCode, setDisableCode] = useState("")

  useEffect(() => {
    if (admin) {
      setMfaEnabled(admin.mfaEnabled || false)
    }
  }, [admin])

  // Check if admin is authenticated
  if (!isAdminAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Admin Authentication Required</h1>
          <p className="text-muted-foreground mb-4">Please log in to access admin settings</p>
          <Button asChild>
            <a href="/admin/login">Go to Admin Login</a>
          </Button>
        </div>
      </div>
    )
  }

  const handleEnableMfa = async () => {
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const result = await adminService.enableMfa()
      setQrCode(result.qrCode)
      setMfaSecret(result.secret)
      setShowMfaSetup(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to enable MFA")
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirmEnableMfa = async () => {
    if (verificationCode.length !== 6) {
      setError("Please enter a 6-digit verification code")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      await adminService.confirmEnableMfa(verificationCode)
      setMfaEnabled(true)
      setShowMfaSetup(false)
      setSuccess("MFA enabled successfully! Your account is now more secure.")
      setVerificationCode("")
      setQrCode("")
      setMfaSecret("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to confirm MFA setup")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisableMfa = async () => {
    if (disableCode.length !== 6) {
      setError("Please enter a 6-digit verification code")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      await adminService.disableMfa(disableCode)
      setMfaEnabled(false)
      setShowMfaDisable(false)
      setSuccess("MFA disabled successfully. Consider enabling it again for better security.")
      setDisableCode("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to disable MFA")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 space-y-8 p-4 pt-20 md:pt-6 md:p-6 lg:p-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Admin Settings</h1>
            <p className="text-muted-foreground mt-1">Manage your admin account security and preferences</p>
            <p className="text-sm text-muted-foreground">Welcome, {admin?.name}</p>
          </div>

          {/* Success Message */}
          {success && (
            <Alert className="bg-success/10 border-success/20">
              <CheckCircle className="h-4 w-4 text-success" />
              <AlertDescription className="text-success">{success}</AlertDescription>
            </Alert>
          )}

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your admin account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                  <p className="text-sm">{admin?.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                  <p className="text-sm">{admin?.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Role</Label>
                  <Badge variant="secondary">Administrator</Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Account Status</Label>
                  <Badge className="bg-success text-success-foreground">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Active
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>Manage your account security and authentication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* MFA Status */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {mfaEnabled ? (
                    <ShieldCheck className="h-8 w-8 text-success" />
                  ) : (
                    <ShieldOff className="h-8 w-8 text-muted-foreground" />
                  )}
                  <div>
                    <h3 className="font-medium">Two-Factor Authentication (2FA)</h3>
                    <p className="text-sm text-muted-foreground">
                      {mfaEnabled
                        ? "Your account is protected with 2FA. You'll need a verification code to log in."
                        : "Add an extra layer of security to your account with 2FA."
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={mfaEnabled ? "default" : "secondary"}>
                    {mfaEnabled ? "Enabled" : "Disabled"}
                  </Badge>
                  {!mfaEnabled ? (
                    <Button
                      onClick={handleEnableMfa}
                      disabled={isLoading}
                      variant="default"
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Key className="h-4 w-4 mr-2" />}
                      Enable 2FA
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setShowMfaDisable(true)}
                      disabled={isLoading}
                      variant="outline"
                    >
                      Disable 2FA
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </main>

        {/* MFA Setup Dialog */}
        {showMfaSetup && (
          <Dialog open={showMfaSetup} onOpenChange={setShowMfaSetup}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Enable Two-Factor Authentication</DialogTitle>
                <DialogDescription>
                  Scan the QR code below with your authenticator app
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {qrCode && (
                  <div className="flex justify-center">
                    <div className="p-4 bg-white rounded-lg border">
                      <img src={qrCode} alt="MFA QR Code" className="w-48 h-48" />
                    </div>
                  </div>
                )}
                <div className="text-center">
                  <Label className="text-sm font-medium">Can't scan?</Label>
                  <p className="text-xs text-muted-foreground mt-1 font-mono break-all">
                    {mfaSecret}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="verification-code">Verification Code</Label>
                  <Input
                    id="verification-code"
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    disabled={isLoading}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowMfaSetup(false)
                      setQrCode("")
                      setMfaSecret("")
                      setVerificationCode("")
                      setError("")
                    }}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirmEnableMfa}
                    disabled={isLoading || verificationCode.length !== 6}
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enable 2FA"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* MFA Disable Dialog */}
        {showMfaDisable && (
          <Dialog open={showMfaDisable} onOpenChange={setShowMfaDisable}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Disable Two-Factor Authentication</DialogTitle>
                <DialogDescription>
                  Are you sure you want to disable 2FA? This will make your account less secure.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="disable-code">Verification Code</Label>
                  <Input
                    id="disable-code"
                    placeholder="Enter 6-digit code"
                    value={disableCode}
                    onChange={(e) => setDisableCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    disabled={isLoading}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowMfaDisable(false)
                      setDisableCode("")
                      setError("")
                    }}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDisableMfa}
                    variant="destructive"
                    disabled={isLoading || disableCode.length !== 6}
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Disable 2FA"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}