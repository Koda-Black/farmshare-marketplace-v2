"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Package,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
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
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAdminDashboard } from "@/hooks/use-admin";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { useAdminAuth } from "@/hooks/use-admin";
import { adminService } from "@/lib/admin.service";
import {
  RevenueChart,
  UserGrowthChart,
  PoolDistributionChart,
} from "@/components/admin/charts";
import { AdminBreadcrumbs } from "@/components/admin/admin-breadcrumbs";
import { BusinessMetrics } from "@/components/admin/business-metrics";

export default function AdminDashboardPage() {
  const { admin, isAdminAuthenticated } = useAdminAuth();
  const { adminDashboard, loading, loadDashboard } = useAdminDashboard();

  // Real metrics data from API
  const [revenueData, setRevenueData] = useState<
    Array<{ name: string; revenue: number }>
  >([]);
  const [userGrowthData, setUserGrowthData] = useState<
    Array<{ name: string; users: number; vendors: number; buyers: number }>
  >([]);
  const [poolDistributionData, setPoolDistributionData] = useState<
    Array<{ name: string; value: number; color: string }>
  >([]);
  const [metricsLoading, setMetricsLoading] = useState(true);

  // Load metrics on mount
  useEffect(() => {
    const loadMetrics = async () => {
      if (!isAdminAuthenticated) return;

      setMetricsLoading(true);
      try {
        const [revenue, userGrowth, poolDistribution] = await Promise.all([
          adminService.getRevenueMetrics("week"),
          adminService.getUserGrowthMetrics("month"),
          adminService.getPoolDistributionMetrics(),
        ]);

        setRevenueData(revenue);
        setUserGrowthData(userGrowth);
        setPoolDistributionData(poolDistribution);
      } catch (error) {
        console.error("Failed to load metrics:", error);
        // Fallback to empty data
      } finally {
        setMetricsLoading(false);
      }
    };

    loadMetrics();
  }, [isAdminAuthenticated]);

  const refreshMetrics = async () => {
    setMetricsLoading(true);
    try {
      const [revenue, userGrowth, poolDistribution] = await Promise.all([
        adminService.getRevenueMetrics("week"),
        adminService.getUserGrowthMetrics("month"),
        adminService.getPoolDistributionMetrics(),
      ]);

      setRevenueData(revenue);
      setUserGrowthData(userGrowth);
      setPoolDistributionData(poolDistribution);
    } catch (error) {
      console.error("Failed to refresh metrics:", error);
    } finally {
      setMetricsLoading(false);
    }
  };

  // Check if admin is authenticated
  if (!isAdminAuthenticated) {
    return (
      <div className="container px-[30px] py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">
              Admin Authentication Required
            </h1>
            <p className="text-muted-foreground mb-4">
              Please log in to access the admin dashboard
            </p>
            <Button asChild>
              <Link href="/admin/login">Go to Admin Login</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading.dashboard || !adminDashboard) {
    return (
      <div className="container px-[30px] py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <h1 className="text-xl font-semibold">Loading Dashboard...</h1>
            <p className="text-muted-foreground">
              Fetching platform statistics
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 space-y-6 p-4 pt-20 md:pt-6 md:p-6 lg:p-8">
          {/* Breadcrumbs */}
          <AdminBreadcrumbs items={[{ label: "Dashboard" }]} />

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Welcome back,{" "}
                <span className="text-foreground font-medium">
                  {admin?.name}
                </span>
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshMetrics}
              disabled={metricsLoading}
              className="w-fit"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${
                  metricsLoading ? "animate-spin" : ""
                }`}
              />
              Refresh Data
            </Button>
          </div>

          {/* Business Metrics - MRR, ARR, Growth, Retention */}
          <BusinessMetrics
            escrow={adminDashboard.escrow || { totalHeld: 0, totalReleased: 0 }}
            users={
              adminDashboard.users || {
                total: 0,
                newThisWeek: 0,
                vendors: 0,
                buyers: 0,
              }
            }
            pools={
              adminDashboard.pools || {
                total: 0,
                active: 0,
                completed: 0,
                completedThisWeek: 0,
              }
            }
          />

          {/* Platform Stats Grid */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
            <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Users
                </CardTitle>
                <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Users className="h-4 w-4 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {adminDashboard.users?.total?.toLocaleString() || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {adminDashboard.users?.vendors || 0} vendors •{" "}
                  {adminDashboard.users?.buyers || 0} buyers
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Approved Vendors
                </CardTitle>
                <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {adminDashboard.users?.verifiedVendors || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  of {adminDashboard.users?.vendors || 0} total vendors
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending Verifications
                </CardTitle>
                <div className="h-8 w-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {adminDashboard.verifications?.pending || 0}
                </div>
                <Button
                  variant="link"
                  className="h-auto p-0 text-xs mt-1 text-primary"
                  asChild
                >
                  <Link href="/admin/verifications">Review now →</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Pools
                </CardTitle>
                <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Package className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {adminDashboard.pools?.active || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {adminDashboard.pools?.total || 0} total pools
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Escrow Held
                </CardTitle>
                <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₦{(adminDashboard.escrow?.totalHeld || 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  ₦
                  {(adminDashboard.escrow?.totalReleased || 0).toLocaleString()}{" "}
                  released
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <Button
                  variant="outline"
                  className="justify-start bg-transparent"
                  asChild
                >
                  <Link href="/admin/verifications">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Review Verifications
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="justify-start bg-transparent"
                  asChild
                >
                  <Link href="/admin/users">
                    <Users className="mr-2 h-4 w-4" />
                    Manage Users
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="justify-start bg-transparent"
                  asChild
                >
                  <Link href="/admin/pools">
                    <Package className="mr-2 h-4 w-4" />
                    Monitor Pools
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="justify-start bg-transparent"
                  asChild
                >
                  <Link href="/admin/disputes">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Handle Disputes
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Charts Section */}
          <div className="pt-2">
            <h2 className="text-xl font-semibold mb-4">Analytics Overview</h2>
          </div>
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">
                  Weekly Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                {metricsLoading ? (
                  <div className="flex items-center justify-center h-[280px]">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : revenueData.length > 0 ? (
                  <RevenueChart data={revenueData} />
                ) : (
                  <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                    No revenue data available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">
                  User Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                {metricsLoading ? (
                  <div className="flex items-center justify-center h-[280px]">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : userGrowthData.length > 0 ? (
                  <UserGrowthChart data={userGrowthData} />
                ) : (
                  <div className="flex items-center justify-center h-[280px] text-muted-foreground">
                    No user growth data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">
                  Pool Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                {metricsLoading ? (
                  <div className="flex items-center justify-center h-[280px]">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : poolDistributionData.length > 0 ? (
                  <PoolDistributionChart data={poolDistributionData} />
                ) : (
                  <div className="flex items-center justify-center h-[280px] text-muted-foreground">
                    No pool distribution data available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Type</TableHead>
                      <TableHead className="text-xs">Action</TableHead>
                      <TableHead className="text-xs">Target</TableHead>
                      <TableHead className="text-xs">Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adminDashboard.recentActivity?.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell className="py-2">
                          <Badge
                            variant="secondary"
                            className="capitalize text-xs"
                          >
                            {activity.targetType}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-2 text-sm">
                          {activity.action}
                        </TableCell>
                        <TableCell className="py-2 font-mono text-xs max-w-[100px] truncate">
                          {activity.targetId}
                        </TableCell>
                        <TableCell className="py-2 text-xs text-muted-foreground">
                          {new Date(activity.createdAt).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!adminDashboard.recentActivity ||
                      adminDashboard.recentActivity.length === 0) && (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center text-muted-foreground"
                        >
                          No recent activity
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Platform Health */}
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Platform Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">System Status</span>
                  <Badge className="bg-success text-success-foreground">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Operational
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Payment Gateway</span>
                  <Badge className="bg-success text-success-foreground">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Connected
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Database</span>
                  <Badge className="bg-success text-success-foreground">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Healthy
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Growth Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">User Growth (This Week)</span>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium text-success">
                      +{adminDashboard.users?.newThisWeek || 0} new
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Verification Rate</span>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium text-success">
                      {adminDashboard.metrics?.verificationCompletionRate || 0}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Pool Completion</span>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium text-success">
                      {adminDashboard.pools?.completedThisWeek || 0} this week
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
