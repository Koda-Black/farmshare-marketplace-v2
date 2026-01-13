"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Loader2,
  RefreshCw,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { VerificationReviewModal } from "@/components/admin/verification-review-modal";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminBreadcrumbs } from "@/components/admin/admin-breadcrumbs";
import { useAdminAuth } from "@/hooks/use-admin";
import {
  adminService,
  type Verification,
  type PaginatedVerifications,
} from "@/lib/admin.service";

export default function AdminVerificationsPage() {
  const { isAdminAuthenticated } = useAdminAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVerification, setSelectedVerification] = useState<any>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Real data state
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  // Load verifications from API
  const loadVerifications = useCallback(async () => {
    if (!isAdminAuthenticated) return;

    setLoading(true);
    setError(null);
    try {
      const response = await adminService.getPendingVerifications({
        page: pagination.page,
        limit: pagination.limit,
      });
      setVerifications(response.verifications || []);
      setPagination((prev) => ({
        ...prev,
        total: response.total,
        totalPages: response.totalPages,
      }));
    } catch (err) {
      console.error("Failed to load verifications:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load verifications"
      );
      setVerifications([]);
    } finally {
      setLoading(false);
    }
  }, [isAdminAuthenticated, pagination.page, pagination.limit]);

  useEffect(() => {
    loadVerifications();
  }, [loadVerifications]);

  // Check if admin is authenticated
  if (!isAdminAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">
            Admin Authentication Required
          </h1>
          <p className="text-muted-foreground mb-4">
            Please log in to access admin verifications
          </p>
          <Button asChild>
            <a href="/admin/login">Go to Admin Login</a>
          </Button>
        </div>
      </div>
    );
  }

  const handleReview = (verification: Verification) => {
    setSelectedVerification(verification);
    setIsReviewModalOpen(true);
  };

  const handleModalClose = (open: boolean) => {
    setIsReviewModalOpen(open);
    if (!open) {
      // Refresh the list when modal closes
      loadVerifications();
    }
  };

  const statusConfig = {
    pending: {
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-100 dark:bg-yellow-900/30",
      label: "Pending",
    },
    approved: {
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-100 dark:bg-green-900/30",
      label: "Approved",
    },
    verified: {
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-100 dark:bg-green-900/30",
      label: "Verified",
    },
    rejected: {
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-100 dark:bg-red-900/30",
      label: "Rejected",
    },
  };

  // Filter verifications by search query
  const filteredVerifications = verifications.filter((v) => {
    const query = searchQuery.toLowerCase();
    return (
      v.user?.name?.toLowerCase().includes(query) ||
      v.user?.email?.toLowerCase().includes(query) ||
      v.documents?.business?.registrationNumber?.toLowerCase().includes(query)
    );
  });

  // Helper to format steps display
  const formatSteps = (steps: any[]) => {
    if (!steps || steps.length === 0) return "N/A";
    const stepNames: Record<string, string> = {
      govt_id: "ID",
      bank: "Bank",
      business_reg: "Business",
      tax: "Tax",
    };
    return steps.map((s) => stepNames[s.step] || s.step).join(", ");
  };

  // Count by status
  const pendingCount = verifications.filter(
    (v) => v.status?.toLowerCase() === "pending"
  ).length;
  const approvedCount = verifications.filter(
    (v) => v.status?.toLowerCase() === "approved"
  ).length;
  const rejectedCount = verifications.filter(
    (v) => v.status?.toLowerCase() === "rejected"
  ).length;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 space-y-6 p-4 pt-20 md:pt-6 md:p-6 lg:p-8">
          {/* Breadcrumbs */}
          <AdminBreadcrumbs items={[{ label: "Verifications" }]} />

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Vendor Verifications
              </h1>
              <p className="text-muted-foreground mt-1">
                Review and approve vendor verification requests
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadVerifications}
              disabled={loading}
              className="w-fit"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending Review
                </CardTitle>
                <div className="h-8 w-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-yellow-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? "—" : pendingCount}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Approved
                </CardTitle>
                <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? "—" : approvedCount}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Rejected
                </CardTitle>
                <div className="h-8 w-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <XCircle className="h-4 w-4 text-red-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? "—" : rejectedCount}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or business..."
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

          {/* Verifications Table */}
          <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Verification Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-[200px]">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : filteredVerifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                  <Clock className="h-12 w-12 mb-4 opacity-20" />
                  <p>No verification requests found</p>
                  {searchQuery && (
                    <p className="text-sm mt-1">
                      Try adjusting your search query
                    </p>
                  )}
                </div>
              ) : (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Vendor</TableHead>
                        <TableHead className="text-xs">Business Info</TableHead>
                        <TableHead className="text-xs">
                          Verification Steps
                        </TableHead>
                        <TableHead className="text-xs">Submitted</TableHead>
                        <TableHead className="text-xs">Status</TableHead>
                        <TableHead className="text-xs">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredVerifications.map((verification) => {
                        const status =
                          verification.status?.toLowerCase() || "pending";
                        const config =
                          statusConfig[status as keyof typeof statusConfig] ||
                          statusConfig.pending;
                        const StatusIcon = config.icon;
                        return (
                          <TableRow key={verification.id}>
                            <TableCell className="py-3">
                              <div>
                                <p className="font-medium text-sm">
                                  {verification.user?.name || "Unknown"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {verification.user?.email || "—"}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="py-3">
                              <div>
                                <p className="text-sm">
                                  {verification.documents?.business
                                    ?.registrationNumber || "No registration"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {verification.documents?.bank?.bankName ||
                                    "No bank info"}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="py-3">
                              <div className="flex flex-wrap gap-1">
                                {verification.steps?.map((step) => (
                                  <Badge
                                    key={step.id}
                                    variant="outline"
                                    className="text-xs capitalize"
                                  >
                                    {step.step.replace("_", " ")}
                                  </Badge>
                                )) || (
                                  <span className="text-xs text-muted-foreground">
                                    No steps
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="py-3 text-xs text-muted-foreground">
                              {new Date(
                                verification.createdAt
                              ).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="py-3">
                              <Badge
                                variant="secondary"
                                className={`${config.bg} ${config.color} text-xs`}
                              >
                                <StatusIcon className="mr-1 h-3 w-3" />
                                {config.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleReview(verification)}
                                className="h-8"
                              >
                                <Eye className="mr-1.5 h-3.5 w-3.5" />
                                Review
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
        </main>
      </div>

      {selectedVerification && (
        <VerificationReviewModal
          open={isReviewModalOpen}
          onOpenChange={handleModalClose}
          verification={selectedVerification}
        />
      )}
    </div>
  );
}
