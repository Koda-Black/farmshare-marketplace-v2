"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MoreVertical, Ban } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { useAdminAuth } from "@/hooks/use-admin"

export default function AdminPoolsPage() {
  const { isAdminAuthenticated } = useAdminAuth()
  const [searchQuery, setSearchQuery] = useState("")

  // Check if admin is authenticated
  if (!isAdminAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">
            Admin Authentication Required
          </h1>
          <p className="text-muted-foreground mb-4">
            Please log in to access admin pools
          </p>
          <Button asChild>
            <a href="/admin/login">Go to Admin Login</a>
          </Button>
        </div>
      </div>
    )
  }

  // Mock pools data
  const pools = [
    {
      id: "pool_1",
      product_name: "Premium Rice",
      vendor_name: "FarmCo Supplies",
      slots_count: 10,
      slots_filled: 8,
      price_per_slot: 50000,
      status: "active",
      created_at: new Date().toISOString(),
    },
    {
      id: "pool_2",
      product_name: "Organic Tomatoes",
      vendor_name: "Green Valley Farms",
      slots_count: 15,
      slots_filled: 15,
      price_per_slot: 15000,
      status: "full",
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "pool_3",
      product_name: "Yellow Maize",
      vendor_name: "FarmCo Supplies",
      slots_count: 8,
      slots_filled: 3,
      price_per_slot: 40000,
      status: "active",
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 space-y-8 p-4 pt-20 md:pt-6 md:p-6 lg:p-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Pool Management</h1>
          <p className="text-muted-foreground mt-1">Monitor and manage all buying pools</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pools.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pools.filter((p) => p.status === "active").length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Full</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pools.filter((p) => p.status === "full").length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Fill Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search pools by product or vendor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>

        {/* Pools Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Pools</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pool ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Price/Slot</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pools.map((pool) => (
                  <TableRow key={pool.id}>
                    <TableCell className="font-mono text-sm">{pool.id}</TableCell>
                    <TableCell className="font-medium">{pool.product_name}</TableCell>
                    <TableCell>{pool.vendor_name}</TableCell>
                    <TableCell>
                      {pool.slots_filled}/{pool.slots_count}
                    </TableCell>
                    <TableCell>₦{pool.price_per_slot.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {pool.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(pool.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>View Buyers</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Ban className="mr-2 h-4 w-4" />
                            Suspend Pool
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        </main>
      </div>
    </div>
  )
}
