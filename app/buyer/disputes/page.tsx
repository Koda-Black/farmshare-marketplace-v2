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
  Filter,
  Eye,
  FileText,
  Plus,
} from "lucide-react";
import { format } from "date-fns";

export default function BuyerDisputesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Mock disputes data - in real implementation, this would come from API
  const [disputes, setDisputes] = useState([
    {
      id: "dispute_1",
      pool_id: "pool_1",
      pool_name: "Organic Tomatoes",
      vendor_name: "Green Valley Farms",
      reason: "Product quality issues - tomatoes not as organic as advertised",
      status: "resolved",
      resolution: "Partial refund issued - 30% compensation",
      evidence_files: ["photo1.jpg", "photo2.jpg"],
      created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      resolved_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      amount_involved: 30000,
    },
    {
      id: "dispute_2",
      pool_id: "pool_2",
      pool_name: "Fresh Vegetables Mix",
      vendor_name: "FarmCo Supplies",
      reason: "Late delivery - vegetables arrived 3 days late",
      status: "in_review",
      resolution: null,
      evidence_files: ["delivery_receipt.jpg"],
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      resolved_at: null,
      amount_involved: 12000,
    },
    {
      id: "dispute_3",
      pool_id: "pool_3",
      pool_name: "Premium Rice",
      vendor_name: "Harvest Valley Farms",
      reason: "Wrong product variant received",
      status: "open",
      resolution: null,
      evidence_files: ["product_photo.jpg", "order_screenshot.png"],
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      resolved_at: null,
      amount_involved: 25000,
    },
  ]);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredDisputes = disputes.filter((dispute) => {
    const matchesSearch = dispute.pool_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dispute.vendor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dispute.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || dispute.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusConfig = {
    open: { icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10", label: "Open" },
    in_review: { icon: Clock, color: "text-yellow-600", bg: "bg-yellow-100", label: "In Review" },
    resolved: { icon: CheckCircle, color: "text-success", bg: "bg-success/10", label: "Resolved" },
  };

  return (
    <div className="px-[30px] py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Disputes</h1>
        <p className="text-muted-foreground mt-1">
          Track and manage dispute resolutions for your pool investments
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Disputes</CardTitle>
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
            <div className="text-2xl font-bold">
              {disputes.filter(d => d.status === "open").length}
            </div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Review</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {disputes.filter(d => d.status === "in_review").length}
            </div>
            <p className="text-xs text-muted-foreground">Being processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {disputes.filter(d => d.status === "resolved").length}
            </div>
            <p className="text-xs text-muted-foreground">Successfully resolved</p>
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
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading disputes...</p>
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
                  const StatusIcon = statusConfig[dispute.status as keyof typeof statusConfig].icon;
                  const statusColor = statusConfig[dispute.status as keyof typeof statusConfig].color;
                  const statusBg = statusConfig[dispute.status as keyof typeof statusConfig].bg;
                  const statusLabel = statusConfig[dispute.status as keyof typeof statusConfig].label;

                  return (
                    <TableRow key={dispute.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{dispute.pool_name}</p>
                          <p className="text-sm text-muted-foreground">
                            ID: {dispute.pool_id}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{dispute.vendor_name}</TableCell>
                      <TableCell>
                        <p className="max-w-xs truncate" title={dispute.reason}>
                          {dispute.reason}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${statusBg} ${statusColor}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusLabel}
                        </Badge>
                      </TableCell>
                      <TableCell>₦{dispute.amount_involved.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{format(new Date(dispute.created_at), "MMM dd, yyyy")}</div>
                          {dispute.resolved_at && (
                            <div className="text-muted-foreground">
                              Resolved: {format(new Date(dispute.resolved_at), "MMM dd")}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" asChild>
                          <a href={`/buyer/disputes/${dispute.id}`}>
                            <Eye className="h-4 w-4" />
                          </a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredDisputes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      {searchTerm || statusFilter !== "all"
                        ? "No disputes found matching your filters"
                        : "No disputes filed yet. All your transactions have been smooth!"}
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