"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  DollarSign,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  Loader2,
  RefreshCw,
  ArrowUpRight,
  Wallet,
  Percent,
  Eye,
  ShieldAlert,
  Settings,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminBreadcrumbs } from "@/components/admin/admin-breadcrumbs";
import { useAdminAuth } from "@/hooks/use-admin";
import { useToast } from "@/hooks/use-toast";
import { adminService } from "@/lib/admin.service";
import { Separator } from "@/components/ui/separator";

export default function AdminPayoutsPage() {
  const { isAdminAuthenticated, admin } = useAdminAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  // Data state
  const [payouts, setPayouts] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulation modal state
  const [selectedPoolId, setSelectedPoolId] = useState<string | null>(null);
  const [simulation, setSimulation] = useState<any>(null);
  const [simulating, setSimulating] = useState(false);
  const [isSimModalOpen, setIsSimModalOpen] = useState(false);
  const [initiating, setInitiating] = useState(false);

  // MFA prompt state
  const [showMfaPrompt, setShowMfaPrompt] = useState(false);

  // Load data
  const loadData = useCallback(async () => {
    if (!isAdminAuthenticated) return;

    setLoading(true);
    setError(null);
    try {
      const [payoutsRes, statsRes] = await Promise.all([
        adminService.getPayouts({ limit: 50 }),
        adminService.getVendorPayoutStats(),
      ]);
      setPayouts(payoutsRes.payouts || []);
      setStats(statsRes);
    } catch (err) {
      console.error("Failed to load payouts:", err);
      setError(err instanceof Error ? err.message : "Failed to load payouts");
    } finally {
      setLoading(false);
    }
  }, [isAdminAuthenticated]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSimulate = async (poolId: string) => {
    setSelectedPoolId(poolId);
    setSimulating(true);
    setIsSimModalOpen(true);
    try {
      const result = await adminService.simulatePayout(poolId);
      setSimulation(result);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to simulate payout",
        variant: "destructive",
      });
      setIsSimModalOpen(false);
    } finally {
      setSimulating(false);
    }
  };

  const handleInitiatePayout = async () => {
    if (!selectedPoolId) return;

    // Check if MFA is enabled before allowing payout
    if (!admin?.mfaEnabled) {
      setShowMfaPrompt(true);
      return;
    }

    setInitiating(true);
    try {
      const result = await adminService.initiatePayout(selectedPoolId);
      toast({
        title: "Payout Initiated",
        description: `₦${result.payout.amount.toLocaleString()} sent to ${
          result.payout.vendor
        }`,
        variant: "default",
      });
      setIsSimModalOpen(false);
      loadData(); // Refresh data
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to initiate payout",
        variant: "destructive",
      });
    } finally {
      setInitiating(false);
    }
  };

  const handleGoToMfaSetup = () => {
    setShowMfaPrompt(false);
    setIsSimModalOpen(false);
    router.push("/admin/settings");
  };

  if (!isAdminAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">
            Admin Authentication Required
          </h1>
          <p className="text-muted-foreground mb-4">
            Please log in to access admin payouts
          </p>
          <Button asChild>
            <a href="/admin/login">Go to Admin Login</a>
          </Button>
        </div>
      </div>
    );
  }

  const statusConfig = {
    held: {
      color: "text-yellow-600",
      bg: "bg-yellow-100 dark:bg-yellow-900/30",
      label: "Held",
    },
    releasable: {
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-900/30",
      label: "Releasable",
    },
    released: {
      color: "text-green-600",
      bg: "bg-green-100 dark:bg-green-900/30",
      label: "Released",
    },
    disputed: {
      color: "text-red-600",
      bg: "bg-red-100 dark:bg-red-900/30",
      label: "Disputed",
    },
  };

  const filteredPayouts = payouts.filter((p) => {
    const query = searchQuery.toLowerCase();
    return (
      p.vendor?.name?.toLowerCase().includes(query) ||
      p.vendor?.email?.toLowerCase().includes(query) ||
      p.poolId?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 space-y-6 p-4 pt-20 md:pt-6 md:p-6 lg:p-8">
          {/* Breadcrumbs */}
          <AdminBreadcrumbs items={[{ label: "Payouts" }]} />

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Vendor Payouts
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage escrow releases with 2% platform fee deduction
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
              disabled={loading}
              className="w-fit"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Paid Out
                </CardTitle>
                <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading
                    ? "—"
                    : `₦${(
                        stats?.summary?.totalAmountPaidOut || 0
                      ).toLocaleString()}`}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  to {stats?.summary?.totalVendorsPaid || 0} vendors
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Platform Fees Collected
                </CardTitle>
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Percent className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading
                    ? "—"
                    : `₦${(
                        stats?.summary?.totalPlatformFeesCollected || 0
                      ).toLocaleString()}`}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats?.summary?.platformFeeRate || "2%"} per transaction
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending Payouts
                </CardTitle>
                <div className="h-8 w-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-yellow-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? "—" : stats?.pending?.count || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  ₦{(stats?.pending?.amount || 0).toLocaleString()} in escrow
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Payouts
                </CardTitle>
                <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? "—" : stats?.summary?.totalPayoutCount || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  completed transactions
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by vendor name, email, or pool ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardContent>
          </Card>

          {/* Error State */}
          {error && (
            <Card className="border-destructive/50 bg-destructive/5">
              <CardContent className="pt-6">
                <p className="text-destructive text-sm">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Payouts Table */}
          <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Escrow Payouts</CardTitle>
              <CardDescription>
                View and manage vendor payouts. Platform fee: 2% per
                transaction.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-[200px]">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : filteredPayouts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                  <Wallet className="h-12 w-12 mb-4 opacity-20" />
                  <p>No payouts found</p>
                </div>
              ) : (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Vendor</TableHead>
                        <TableHead className="text-xs">Total Held</TableHead>
                        <TableHead className="text-xs">
                          Platform Fee (2%)
                        </TableHead>
                        <TableHead className="text-xs">Net Payout</TableHead>
                        <TableHead className="text-xs">Status</TableHead>
                        <TableHead className="text-xs">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPayouts.map((payout) => {
                        const status = payout.status?.toLowerCase() || "held";
                        const config =
                          statusConfig[status as keyof typeof statusConfig] ||
                          statusConfig.held;
                        return (
                          <TableRow key={payout.id}>
                            <TableCell className="py-3">
                              <div>
                                <p className="font-medium text-sm">
                                  {payout.vendor?.name || "Unknown"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {payout.vendor?.email || "—"}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="py-3 font-mono text-sm">
                              ₦{payout.totalHeld?.toLocaleString() || "0"}
                            </TableCell>
                            <TableCell className="py-3 font-mono text-sm text-muted-foreground">
                              ₦{payout.platformFee?.toLocaleString() || "0"}
                            </TableCell>
                            <TableCell className="py-3 font-mono text-sm font-medium text-green-600">
                              ₦{payout.netPayout?.toLocaleString() || "0"}
                            </TableCell>
                            <TableCell className="py-3">
                              <Badge
                                variant="secondary"
                                className={`${config.bg} ${config.color} text-xs`}
                              >
                                {config.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSimulate(payout.poolId)}
                                className="h-8"
                              >
                                <Eye className="mr-1.5 h-3.5 w-3.5" />
                                {status === "released" ? "View" : "Simulate"}
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Vendor Breakdown */}
          {stats?.vendorBreakdown?.length > 0 && (
            <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Vendor Payout Summary</CardTitle>
                <CardDescription>
                  Breakdown of payouts by vendor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Vendor</TableHead>
                        <TableHead className="text-xs">Payouts</TableHead>
                        <TableHead className="text-xs">
                          Total Received
                        </TableHead>
                        <TableHead className="text-xs">Fees Paid</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stats.vendorBreakdown.map((vendor: any) => (
                        <TableRow key={vendor.vendorId}>
                          <TableCell className="py-3">
                            <div>
                              <p className="font-medium text-sm">
                                {vendor.vendorName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {vendor.vendorEmail}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="py-3 text-sm">
                            {vendor.payoutCount}
                          </TableCell>
                          <TableCell className="py-3 font-mono text-sm text-green-600">
                            ₦{vendor.totalPayouts?.toLocaleString()}
                          </TableCell>
                          <TableCell className="py-3 font-mono text-sm text-muted-foreground">
                            ₦{vendor.totalFees?.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>

      {/* Simulation Modal */}
      <Dialog open={isSimModalOpen} onOpenChange={setIsSimModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Payout Simulation
            </DialogTitle>
            <DialogDescription>
              Review the payout breakdown before initiating transfer
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto pr-2">
            {simulating ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : simulation ? (
              <div className="space-y-6">
                {/* Vendor Info */}
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold mb-2">Vendor</h4>
                  <p className="text-sm">
                    {simulation.vendor?.name || "Unknown"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {simulation.vendor?.email}
                  </p>
                </div>

                {/* Escrow Breakdown */}
                <div className="space-y-2">
                  <h4 className="font-semibold">Escrow Breakdown</h4>
                  <div className="p-4 border rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Held</span>
                      <span className="font-mono">
                        ₦{simulation.escrow?.totalHeld?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Withheld Amount
                      </span>
                      <span className="font-mono">
                        ₦{simulation.escrow?.withheldAmount?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Already Released
                      </span>
                      <span className="font-mono">
                        ₦{simulation.escrow?.alreadyReleased?.toLocaleString()}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-sm font-medium">
                      <span>Available for Payout</span>
                      <span className="font-mono">
                        ₦
                        {simulation.escrow?.availableForPayout?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Fee Calculation */}
                <div className="space-y-2">
                  <h4 className="font-semibold">Fee Calculation</h4>
                  <div className="p-4 border border-primary/20 bg-primary/5 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Platform Fee Rate
                      </span>
                      <Badge variant="secondary">
                        {simulation.calculation?.platformFeeRate}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Platform Fee
                      </span>
                      <span className="font-mono text-red-600">
                        -₦
                        {simulation.calculation?.platformFee?.toLocaleString()}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Net Payout to Vendor</span>
                      <span className="font-mono text-green-600">
                        ₦
                        {simulation.calculation?.netPayoutToVendor?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Buyer Breakdown */}
                {simulation.buyerBreakdown?.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold">Buyer Contributions</h4>
                    <div className="max-h-40 overflow-y-auto rounded-lg border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-xs">Buyer</TableHead>
                            <TableHead className="text-xs">Paid</TableHead>
                            <TableHead className="text-xs">Fee</TableHead>
                            <TableHead className="text-xs">Net</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {simulation.buyerBreakdown.map((buyer: any) => (
                            <TableRow key={buyer.buyerId}>
                              <TableCell className="text-xs">
                                {buyer.buyerName || buyer.buyerEmail}
                              </TableCell>
                              <TableCell className="text-xs font-mono">
                                ₦{buyer.amountPaid?.toLocaleString()}
                              </TableCell>
                              <TableCell className="text-xs font-mono text-muted-foreground">
                                ₦{buyer.platformFee?.toLocaleString()}
                              </TableCell>
                              <TableCell className="text-xs font-mono text-green-600">
                                ₦{buyer.netToVendor?.toLocaleString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}

                {/* Status Checks */}
                <div className="flex gap-4">
                  <Badge
                    variant={simulation.canPayout ? "default" : "destructive"}
                  >
                    {simulation.canPayout ? (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Eligible for Payout
                      </>
                    ) : (
                      "Not Eligible"
                    )}
                  </Badge>
                  <Badge
                    variant={
                      simulation.vendorBankConfigured ? "default" : "secondary"
                    }
                  >
                    {simulation.vendorBankConfigured
                      ? "Bank Configured"
                      : "No Bank Details"}
                  </Badge>
                </div>
              </div>
            ) : null}
          </div>

          <DialogFooter className="flex-shrink-0">
            <Button variant="outline" onClick={() => setIsSimModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleInitiatePayout}
              disabled={!simulation?.canPayout || initiating}
              className="bg-green-600 hover:bg-green-700"
            >
              {initiating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  Initiate Payout
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MFA Required Alert Dialog */}
      <AlertDialog open={showMfaPrompt} onOpenChange={setShowMfaPrompt}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <ShieldAlert className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <AlertDialogTitle className="text-lg">
                  MFA Required for Payouts
                </AlertDialogTitle>
              </div>
            </div>
            <AlertDialogDescription className="text-base">
              For security reasons, you must enable Multi-Factor Authentication
              (MFA) before initiating vendor payouts. This helps protect against
              unauthorized transactions and ensures the safety of funds.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="bg-muted/50 rounded-lg p-4 my-2">
            <h4 className="font-medium text-sm mb-2">Why is MFA required?</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Protects against unauthorized access</li>
              <li>• Prevents fraudulent payout attempts</li>
              <li>
                • Adds an extra layer of security for financial transactions
              </li>
            </ul>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleGoToMfaSetup}
              className="bg-primary"
            >
              <Settings className="mr-2 h-4 w-4" />
              Set Up MFA Now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
