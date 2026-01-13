"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Eye,
  FileText,
  ChevronRight,
  Home,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { httpRequest } from "@/lib/httpRequest";

interface Dispute {
  id: string;
  reason: string;
  status: string;
  resolution?: string;
  createdAt: string;
  resolvedAt?: string;
  pool: {
    id: string;
    pricePerSlot: string | number;
    product: {
      name: string;
    };
    vendor: {
      name: string;
    };
  };
  subscription?: {
    slots: number;
    deliveryFee: number | string;
  };
}

export default function BuyerDisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDisputes = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      const data = await httpRequest.get<Dispute[]>("/disputes/my");
      setDisputes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch disputes:", error);
      setDisputes([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, []);

  const handleRefresh = () => {
    fetchDisputes(true);
  };

  const filteredDisputes = disputes.filter((dispute) => {
    const matchesSearch =
      dispute.pool?.product?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      dispute.pool?.vendor?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      dispute.reason?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      dispute.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const statusConfig: Record<
    string,
    {
      icon: typeof AlertTriangle;
      color: string;
      bg: string;
      label: string;
    }
  > = {
    open: {
      icon: AlertTriangle,
      color: "text-destructive",
      bg: "bg-destructive/10",
      label: "Open",
    },
    pending: {
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
      label: "Pending",
    },
    in_review: {
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
      label: "In Review",
    },
    resolved: {
      icon: CheckCircle,
      color: "text-success",
      bg: "bg-success/10",
      label: "Resolved",
    },
    closed: {
      icon: CheckCircle,
      color: "text-muted-foreground",
      bg: "bg-muted",
      label: "Closed",
    },
  };

  const getStatusConfig = (status: string) => {
    const statusLower = status?.toLowerCase();
    return (
      statusConfig[statusLower] || {
        icon: Clock,
        color: "text-muted-foreground",
        bg: "bg-muted",
        label: status || "Unknown",
      }
    );
  };

  const calculateAmount = (dispute: Dispute) => {
    const pricePerSlot = Number(dispute.pool?.pricePerSlot) || 0;
    const slots = Number(dispute.subscription?.slots) || 1;
    const deliveryFee = Number(dispute.subscription?.deliveryFee) || 0;
    return slots * pricePerSlot + deliveryFee;
  };

  const openCount = disputes.filter(
    (d) => d.status?.toLowerCase() === "open"
  ).length;
  const inReviewCount = disputes.filter((d) => {
    const status = d.status?.toLowerCase();
    return status === "in_review" || status === "pending";
  }).length;
  const resolvedCount = disputes.filter((d) => {
    const status = d.status?.toLowerCase();
    return status === "resolved" || status === "closed";
  }).length;

  return (
    <div className="px-[30px] py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link
          href="/buyer/dashboard"
          className="flex items-center gap-1 hover:text-foreground transition-colors"
        >
          <Home className="h-4 w-4" />
          Dashboard
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">My Disputes</span>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Disputes</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage dispute resolutions for your pool investments
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
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Disputes
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{disputes.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Disputes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openCount}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Review</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inReviewCount}</div>
            <p className="text-xs text-muted-foreground">Being processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolvedCount}</div>
            <p className="text-xs text-muted-foreground">
              Successfully resolved
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-col sm:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search disputes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_review">In Review</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Disputes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Dispute History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading disputes...</p>
            </div>
          ) : disputes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <CheckCircle className="h-12 w-12 text-success mb-4" />
              <h3 className="text-lg font-semibold mb-2">No disputes filed</h3>
              <p className="text-muted-foreground text-center max-w-md">
                All your transactions have been smooth! No disputes to show.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pool</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDisputes.map((dispute) => {
                  const config = getStatusConfig(dispute.status);
                  const StatusIcon = config.icon;
                  const amount = calculateAmount(dispute);

                  return (
                    <TableRow key={dispute.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {dispute.pool?.product?.name || "Unknown Pool"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            ID: {dispute.pool?.id?.slice(0, 8)}...
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {dispute.pool?.vendor?.name || "Unknown Vendor"}
                      </TableCell>
                      <TableCell>
                        <p className="max-w-xs truncate" title={dispute.reason}>
                          {dispute.reason}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${config.bg} ${config.color}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {config.label}
                        </Badge>
                      </TableCell>
                      <TableCell>₦{amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>
                            {dispute.createdAt
                              ? format(
                                  new Date(dispute.createdAt),
                                  "MMM dd, yyyy"
                                )
                              : "N/A"}
                          </div>
                          {dispute.resolvedAt && (
                            <div className="text-muted-foreground">
                              Resolved:{" "}
                              {format(new Date(dispute.resolvedAt), "MMM dd")}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/buyer/disputes/${dispute.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredDisputes.length === 0 && disputes.length > 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-muted-foreground py-8"
                    >
                      No disputes found matching your filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
