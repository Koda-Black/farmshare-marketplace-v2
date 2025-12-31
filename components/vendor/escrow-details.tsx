"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  DollarSign,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Loader2,
  Shield,
  Package,
} from "lucide-react"
import { useVendorEscrows } from "@/hooks/use-escrow"
import { formatCurrency } from "@/lib/utils"

interface EscrowDetailsProps {
  poolId: string
  isVendor?: boolean
}

export function EscrowDetails({ poolId, isVendor = false }: EscrowDetailsProps) {
  const { vendorEscrows, loading, releaseEscrow, getEscrowDetails } = useVendorEscrows()
  const [escrowDetails, setEscrowDetails] = useState<any>(null)
  const [isReleasing, setIsReleasing] = useState(false)

  // Find the specific escrow for this pool
  const poolEscrow = vendorEscrows.find(e => e.pool.id === poolId) || escrowDetails

  useEffect(() => {
    if (!poolEscrow && poolId) {
      loadEscrowDetails()
    } else {
      setEscrowDetails(poolEscrow)
    }
  }, [poolId, poolEscrow])

  const loadEscrowDetails = async () => {
    try {
      const details = await getEscrowDetails(poolId)
      setEscrowDetails(details)
    } catch (error) {
      console.error("Failed to load escrow details:", error)
    }
  }

  const handleReleaseEscrow = async () => {
    if (!poolEscrow) return

    setIsReleasing(true)
    try {
      await releaseEscrow(poolId, "Pool completed successfully - releasing funds to vendor")
      // Refresh the details
      await loadEscrowDetails()
    } catch (error: any) {
      console.error("Failed to release escrow:", error)
    } finally {
      setIsReleasing(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Loading escrow details...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!poolEscrow) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No escrow details available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const { escrow, calculations, pool } = poolEscrow
  const progressPercentage = pool.slots_count > 0 ? (pool.slots_filled / pool.slots_count) * 100 : 0
  const canRelease = pool.status === 'COMPLETED' && escrow.totalHeld > 0 && escrow.releasedAmount < escrow.totalHeld

  return (
    <div className="space-y-6">
      {/* Escrow Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Escrow Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                ₦{escrow.totalHeld.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Total Held</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                ₦{escrow.releasedAmount.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Released</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                ₦{escrow.withheldAmount.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Withheld</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">
                {calculations.commissionRate}%
              </p>
              <p className="text-xs text-muted-foreground">Commission</p>
            </div>
          </div>

          {escrow.withheldReason && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Withheld Amount:</strong> {escrow.withheldReason}
              </AlertDescription>
            </Alert>
          )}

          {canRelease && isVendor && (
            <Button
              onClick={handleReleaseEscrow}
              disabled={isReleasing}
              className="w-full"
            >
              {isReleasing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Releasing Funds...
                </>
              ) : (
                <>
                  <DollarSign className="mr-2 h-4 w-4" />
                  Release Escrow Funds
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Pool Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Pool Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Pool Filling Progress</span>
              <span className="font-medium">{pool.slots_filled}/{pool.slots_count} slots</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {progressPercentage.toFixed(1)}% complete
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Status</p>
              <Badge variant={pool.status === 'COMPLETED' ? 'default' : 'secondary'}>
                {pool.status}
              </Badge>
            </div>
            <div>
              <p className="text-muted-foreground">Delivery Deadline</p>
              <p className="font-medium">
                {new Date(pool.delivery_deadline).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Financial Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Pool Value</span>
              <span className="font-medium">₦{escrow.totalHeld.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Platform Commission ({calculations.commissionRate}%)</span>
              <span className="font-medium text-red-600">-₦{calculations.commission.toLocaleString()}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Net for Vendor</span>
              <span className="text-green-600">₦{calculations.netForVendor.toLocaleString()}</span>
            </div>
          </div>

          <Alert>
            <DollarSign className="h-4 w-4" />
            <AlertDescription>
              Funds are held securely in escrow until the pool is completed and delivered.
              The platform commission ({calculations.commissionRate}%) is automatically deducted.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Participants */}
      {pool.subscriptions && pool.subscriptions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Pool Participants ({pool.subscriptions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pool.subscriptions.slice(0, 5).map((subscription: any) => (
                <div key={subscription.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{subscription.user?.name || "Anonymous User"}</p>
                    <p className="text-xs text-muted-foreground">{subscription.user?.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{subscription.slots} slots</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(subscription.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {pool.subscriptions.length > 5 && (
                <p className="text-sm text-muted-foreground text-center">
                  ... and {pool.subscriptions.length - 5} more participants
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Escrow Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
              <div>
                <p className="font-medium">Escrow Created</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(escrow.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            {escrow.releasedAmount > 0 && (
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                <div>
                  <p className="font-medium">Funds Released</p>
                  <p className="text-sm text-muted-foreground">
                    ₦{escrow.releasedAmount.toLocaleString()} released to vendor
                  </p>
                </div>
              </div>
            )}
            {pool.status === 'COMPLETED' && escrow.releasedAmount === 0 && (
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2" />
                <div>
                  <p className="font-medium">Ready for Release</p>
                  <p className="text-sm text-muted-foreground">
                    Pool completed - funds can be released to vendor
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}