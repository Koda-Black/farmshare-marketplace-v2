"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  ChevronRight,
  Home,
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
import Link from "next/link";
import { httpRequest } from "@/lib/httpRequest";
import { format } from "date-fns";

interface Subscription {
  id: string;
  slots: number;
  deliveryFee: number | string;
  createdAt: string;
  pool: {
    id: string;
    status: string;
    pricePerSlot: string | number;
    allowHomeDelivery: boolean;
    product: {
      name: string;
    };
    vendor: {
      name: string;
    };
  };
}

export default function BuyerOrdersPage() {
  const [orders, setOrders] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchOrders = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      const data = await httpRequest.get<Subscription[]>(
        "/pools/user/subscriptions"
      );
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setOrders([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleRefresh = () => {
    fetchOrders(true);
  };

  const getStatusConfig = (status: string) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case "open":
      case "filled":
        return {
          icon: Clock,
          color: "text-yellow-600",
          bg: "bg-yellow-100",
          label: "Pending",
        };
      case "delivered":
      case "completed":
        return {
          icon: CheckCircle,
          color: "text-success",
          bg: "bg-success/10",
          label: "Completed",
        };
      case "cancelled":
        return {
          icon: XCircle,
          color: "text-destructive",
          bg: "bg-destructive/10",
          label: "Cancelled",
        };
      default:
        return {
          icon: Clock,
          color: "text-muted-foreground",
          bg: "bg-muted",
          label: status || "Unknown",
        };
    }
  };

  const calculateAmount = (order: Subscription) => {
    const pricePerSlot = Number(order.pool?.pricePerSlot) || 0;
    const slots = Number(order.slots) || 0;
    const deliveryFee = Number(order.deliveryFee) || 0;
    return slots * pricePerSlot + deliveryFee;
  };

  const pendingCount = orders.filter((o) => {
    const status = o.pool?.status?.toLowerCase();
    return status === "open" || status === "filled";
  }).length;

  const completedCount = orders.filter((o) => {
    const status = o.pool?.status?.toLowerCase();
    return status === "delivered" || status === "completed";
  }).length;

  return (
    <div className="container px-[30px] py-8">
      <div className="space-y-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link
            href="/buyer/dashboard"
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <Home className="h-4 w-4" />
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">My Orders</span>
        </nav>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Orders</h1>
            <p className="text-muted-foreground mt-1">
              Track your pool purchases and deliveries
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Order History</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  You haven't joined any pools yet. Browse the marketplace to
                  find great deals!
                </p>
                <Button asChild className="mt-4">
                  <Link href="/buyer/marketplace">Browse Marketplace</Link>
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Slots</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Delivery</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => {
                    const statusConfig = getStatusConfig(order.pool?.status);
                    const StatusIcon = statusConfig.icon;
                    const amount = calculateAmount(order);
                    const hasDelivery = Number(order.deliveryFee) > 0;

                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          {order.pool?.product?.name || "Unknown Product"}
                        </TableCell>
                        <TableCell>
                          {order.pool?.vendor?.name || "Unknown Vendor"}
                        </TableCell>
                        <TableCell>{order.slots}</TableCell>
                        <TableCell>₦{amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {hasDelivery ? (
                              <Truck className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Package className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className="capitalize">
                              {hasDelivery ? "Delivery" : "Pickup"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={statusConfig.bg}
                          >
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {statusConfig.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {order.createdAt
                            ? format(new Date(order.createdAt), "MMM dd, yyyy")
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/buyer/pool/${order.pool?.id}`}>
                              View
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
