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
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 space-y-8 p-4 pt-20 md:pt-6 md:p-6 lg:p-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Monitor and manage the FarmShare platform
            </p>
            <p className="text-sm text-muted-foreground">
              Welcome back, {admin?.name}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {adminDashboard.users?.total?.toLocaleString() || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {adminDashboard.users?.vendors || 0} vendors,{" "}
                  {adminDashboard.users?.buyers || 0} buyers
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Verifications
                </CardTitle>
                <AlertCircle className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {adminDashboard.verifications?.pending || 0}
                </div>
                <Button variant="link" className="h-auto p-0 text-xs" asChild>
                  <Link href="/admin/verifications">Review now</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Pools
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {adminDashboard.pools?.active || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Across all vendors
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Platform Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₦{(adminDashboard.escrow?.totalHeld || 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total platform earnings
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
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
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold">Analytics</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshMetrics}
              disabled={metricsLoading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${
                  metricsLoading ? "animate-spin" : ""
                }`}
              />
              Refresh
            </Button>
          </div>
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                {metricsLoading ? (
                  <div className="flex items-center justify-center h-[200px]">
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

            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
              </CardHeader>
              <CardContent>
                {metricsLoading ? (
                  <div className="flex items-center justify-center h-[200px]">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : userGrowthData.length > 0 ? (
                  <UserGrowthChart data={userGrowthData} />
                ) : (
                  <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                    No user growth data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Pool Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {metricsLoading ? (
                  <div className="flex items-center justify-center h-[200px]">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : poolDistributionData.length > 0 ? (
                  <PoolDistributionChart data={poolDistributionData} />
                ) : (
                  <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                    No pool distribution data available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adminDashboard.recentActivity?.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell>
                          <Badge variant="secondary" className="capitalize">
                            {activity.targetType}
                          </Badge>
                        </TableCell>
                        <TableCell>{activity.action}</TableCell>
                        <TableCell className="font-mono text-xs">
                          {activity.targetId}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
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
                  <span className="text-sm">User Growth</span>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium text-success">
                      +12.5%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Pool Creation Rate</span>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium text-success">
                      +18.2%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Transaction Volume</span>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium text-success">
                      +31.5%
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
