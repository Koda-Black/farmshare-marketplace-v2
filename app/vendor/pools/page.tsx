"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search } from "lucide-react"
import { CreatePoolModal } from "@/components/vendor/create-pool-modal"
import { PoolCard } from "@/components/vendor/pool-card"
import { useStore } from "@/lib/store"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function VendorPoolsPage() {
  const user = useStore((state) => state.user)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards")

  // Mock pools data
  const mockPools = [
    {
      id: "pool_1",
      vendor_id: user?.id || "",
      product_name: "Premium Rice",
      product_description: "50kg bags of premium quality rice",
      slots_count: 10,
      slots_filled: 8,
      price_total: 500000,
      price_per_slot: 50000,
      allow_home_delivery: true,
      home_delivery_cost: 5000,
      delivery_deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active" as const,
      created_at: new Date().toISOString(),
    },
    {
      id: "pool_2",
      vendor_id: user?.id || "",
      product_name: "Organic Tomatoes",
      product_description: "Fresh organic tomatoes - 25kg crates",
      slots_count: 15,
      slots_filled: 15,
      price_total: 225000,
      price_per_slot: 15000,
      allow_home_delivery: false,
      delivery_deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: "full" as const,
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "pool_3",
      vendor_id: user?.id || "",
      product_name: "Yellow Maize",
      product_description: "100kg bags of yellow maize",
      slots_count: 8,
      slots_filled: 3,
      price_total: 320000,
      price_per_slot: 40000,
      allow_home_delivery: true,
      home_delivery_cost: 8000,
      delivery_deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active" as const,
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  return (
    <div className="container px-[30px] py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Pools</h1>
            <p className="text-muted-foreground mt-1">Manage all your buying pools</p>
          </div>
          <Button
            size="lg"
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Pool
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search pools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                <Button variant={viewMode === "cards" ? "default" : "outline"} onClick={() => setViewMode("cards")}>
                  Cards
                </Button>
                <Button variant={viewMode === "table" ? "default" : "outline"} onClick={() => setViewMode("table")}>
                  Table
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pools Display */}
        {viewMode === "cards" ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockPools.map((pool) => (
              <PoolCard key={pool.id} pool={pool} />
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>All Pools</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Price/Slot</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPools.map((pool) => (
                    <TableRow key={pool.id}>
                      <TableCell className="font-medium">{pool.product_name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{pool.status}</Badge>
                      </TableCell>
                      <TableCell>
                        {pool.slots_filled}/{pool.slots_count}
                      </TableCell>
                      <TableCell>₦{pool.price_per_slot.toLocaleString()}</TableCell>
                      <TableCell>{new Date(pool.delivery_deadline).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      <CreatePoolModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
    </div>
  )
}
