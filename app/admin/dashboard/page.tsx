"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Package, DollarSign, TrendingUp, AlertCircle, CheckCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AdminDashboardPage() {
  // Mock stats
  const stats = {
    totalUsers: 156,
    totalVendors: 24,
    totalBuyers: 132,
    pendingVerifications: 8,
    activePools: 45,
    totalRevenue: 12500000,
    platformFees: 625000,
    growthRate: 23.5,
  }

  // Mock recent activities
  const recentActivities = [
    {
      id: 1,
      type: "verification",
      user: "John Doe Farms",
      action: "Submitted verification documents",
      timestamp: "2 hours ago",
      status: "pending",
    },
    {
      id: 2,
      type: "pool",
      user: "FarmCo Supplies",
      action: "Created new pool: Premium Rice",
      timestamp: "5 hours ago",
      status: "active",
    },
    {
      id: 3,
      type: "order",
      user: "Jane Smith",
      action: "Joined pool: Organic Tomatoes",
      timestamp: "1 day ago",
      status: "completed",
    },
    {
      id: 4,
      type: "dispute",
      user: "Mike Johnson",
      action: "Opened dispute for order #1234",
      timestamp: "2 days ago",
      status: "pending",
    },
  ]

  return (
    <div className="container px-[30px] py-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Monitor and manage the FarmShare platform</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalVendors} vendors, {stats.totalBuyers} buyers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingVerifications}</div>
              <Button variant="link" className="h-auto p-0 text-xs" asChild>
                <Link href="/admin/verifications">Review now</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Pools</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activePools}</div>
              <p className="text-xs text-muted-foreground">Across all vendors</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦{stats.platformFees.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">From ₦{stats.totalRevenue.toLocaleString()} total</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="justify-start bg-transparent" asChild>
                <Link href="/admin/verifications">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Review Verifications
                </Link>
              </Button>
              <Button variant="outline" className="justify-start bg-transparent" asChild>
                <Link href="/admin/users">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Users
                </Link>
              </Button>
              <Button variant="outline" className="justify-start bg-transparent" asChild>
                <Link href="/admin/pools">
                  <Package className="mr-2 h-4 w-4" />
                  Monitor Pools
                </Link>
              </Button>
              <Button variant="outline" className="justify-start bg-transparent" asChild>
                <Link href="/admin/disputes">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Handle Disputes
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {activity.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{activity.user}</TableCell>
                    <TableCell>{activity.action}</TableCell>
                    <TableCell className="text-muted-foreground">{activity.timestamp}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          activity.status === "completed"
                            ? "default"
                            : activity.status === "pending"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {activity.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Platform Health */}
        <div className="grid gap-4 md:grid-cols-2">
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
                  <span className="text-sm font-medium text-success">+{stats.growthRate}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Pool Creation Rate</span>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium text-success">+18.2%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Transaction Volume</span>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium text-success">+31.5%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
