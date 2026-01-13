"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Loader2, Package } from "lucide-react";
import { CreatePoolModal } from "@/components/vendor/create-pool-modal";
import { PoolCard } from "@/components/vendor/pool-card";
import { useStore } from "@/lib/store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { httpRequest } from "@/lib/httpRequest";

export default function VendorPoolsPage() {
  const user = useStore((state) => state.user);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [vendorPools, setVendorPools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch vendor's pools from API
  const fetchVendorPools = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const response = await httpRequest.get(`/pools?vendorId=${user.id}`);
      const data = response.data || response;
      setVendorPools(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch vendor pools:", error);
      setVendorPools([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchVendorPools();
  }, [fetchVendorPools]);

  // Filter pools based on search query
  const filteredPools = vendorPools.filter((pool) =>
    pool.product_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container px-[30px] py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Pools</h1>
            <p className="text-muted-foreground mt-1">
              Manage all your buying pools
            </p>
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
                <Button
                  variant={viewMode === "cards" ? "default" : "outline"}
                  onClick={() => setViewMode("cards")}
                >
                  Cards
                </Button>
                <Button
                  variant={viewMode === "table" ? "default" : "outline"}
                  onClick={() => setViewMode("table")}
                >
                  Table
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pools Display */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : filteredPools.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery ? "No pools found" : "No pools yet"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? "Try adjusting your search query"
                : "Create your first pool to start selling"}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-accent hover:bg-accent/90"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Pool
              </Button>
            )}
          </div>
        ) : viewMode === "cards" ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredPools.map((pool) => (
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
                  {filteredPools.map((pool) => (
                    <TableRow key={pool.id}>
                      <TableCell className="font-medium">
                        {pool.product_name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{pool.status}</Badge>
                      </TableCell>
                      <TableCell>
                        {pool.slots_filled}/{pool.slots_count}
                      </TableCell>
                      <TableCell>
                        ₦{(pool.price_per_slot || 0).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {new Date(pool.delivery_deadline).toLocaleDateString()}
                      </TableCell>
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

      <CreatePoolModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </div>
  );
}
