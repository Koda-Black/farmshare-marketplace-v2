"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  AlertCircle,
  FileText,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAdminDashboard } from "@/hooks/use-admin";
import { useAdminAuth } from "@/hooks/use-admin";
import Link from "next/link";
import { format } from "date-fns";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminDisputesPage() {
  const { admin, isAdminAuthenticated } = useAdminAuth();
  const { managedDisputes, loadDisputes, resolveDispute } = useAdminDashboard();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDispute, setSelectedDispute] = useState<any>(null);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);

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

  const handleResolveDispute = async (
    disputeId: string,
    action: "refund" | "release" | "split"
  ) => {
    try {
      await resolveDispute({ disputeId, action });
      // Refresh disputes list
      loadDisputes({
        page: currentPage,
        limit: 20,
        status: statusFilter === "all" ? undefined : statusFilter,
      });
    } catch (error) {
      console.error("Failed to resolve dispute:", error);
    }
  };

  const filteredDisputes = managedDisputes?.filter((dispute) => {
    const matchesSearch =
      dispute.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.pool?.vendor?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      dispute.raisedBy?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || dispute.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800";
      case "in_review":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4" />;
      case "in_review":
        return <Clock className="h-4 w-4" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 space-y-8 p-4 pt-20 md:pt-6 md:p-6 lg:p-8">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link href="/admin">
                <ChevronLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-3xl font-bold">Dispute Management</h1>
            </div>
            <p className="text-muted-foreground">
              Monitor and resolve customer disputes across the platform
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Disputes
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {filteredDisputes?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {filteredDisputes?.filter((d) => d.status === "open")
                    .length || 0}{" "}
                  active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text font-medium">Open Cases</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {filteredDisputes?.filter((d) => d.status === "open")
                    .length || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Require attention
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {filteredDisputes?.filter((d) => d.status === "resolved")
                    .length || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Successfully resolved
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {filteredDisputes?.filter((d) => d.status === "in_review")
                    .length || 0}
                </div>
                <p className="text-xs text-muted-foreground">Under review</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:space-x-4">
                <div className="flex-1">
                  <Label htmlFor="search" className="sr-only">
                    Search disputes
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-400" />
                    <Input
                      id="search"
                      placeholder="Search by vendor, reason, or raised by..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="w-full md:w-48">
                  <Label htmlFor="status" className="sr-only">
                    Status filter
                  </Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="investigating">
                        Under Review
                      </SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={() => loadDisputes()} variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Disputes Table */}
          <Card>
            <CardHeader>
              <CardTitle>Dispute Cases</CardTitle>
              <CardDescription>
                All dispute cases across the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Pool</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Raised By</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDisputes?.map((dispute) => (
                      <TableRow key={dispute.id} className="hover:bg-gray-50">
                        <TableCell className="font-mono text-xs">
                          {dispute.id.slice(0, 8)}...
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {dispute.pool?.product?.name || "N/A"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {dispute.poolId.slice(0, 8)}...
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {dispute.pool?.vendor?.name || "N/A"}
                        </TableCell>
                        <TableCell>{dispute.raisedBy?.name || "N/A"}</TableCell>
                        <TableCell>
                          <p className="line-clamp-2 text-sm">
                            {dispute.reason}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(dispute.status)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(dispute.status)}
                              {dispute.status.charAt(0).toUpperCase() +
                                dispute.status.slice(1)}
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(dispute.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedDispute(dispute);
                                setIsViewDetailsOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {dispute.status === "open" && (
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleResolveDispute(dispute.id, "refund")
                                }
                              >
                                Resolve
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredDisputes?.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="text-center text-muted-foreground py-8"
                        >
                          <div className="flex flex-col items-center justify-center gap-2">
                            <AlertCircle className="h-12 w-12 text-muted-foreground" />
                            <p className="text-lg font-medium">
                              No disputes found
                            </p>
                            <p className="text-sm">
                              {searchTerm || statusFilter !== "all"
                                ? "Try adjusting your filters"
                                : "No disputes have been raised yet"}
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Dispute Details Modal */}
          {isViewDetailsOpen && selectedDispute && (
            <Card className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm p-4 overflow-y-auto">
              <div className="min-h-[80vh] max-w-4xl mx-auto">
                <Card>
                  <CardHeader className="flex justify-between items-start">
                    <div>
                      <CardTitle>Dispute Details</CardTitle>
                      <CardDescription>
                        ID: {selectedDispute.id}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsViewDetailsOpen(false)}
                    >
                      ×
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Pool Information */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">
                        Pool Information
                      </h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Label className="text-sm text-muted-foreground">
                            Product
                          </Label>
                          <p className="font-medium">
                            {selectedDispute.pool?.product?.name}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">
                            Pool ID
                          </Label>
                          <p className="font-mono text-sm">
                            {selectedDispute.poolId}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">
                            Vendor
                          </Label>
                          <p className="font-medium">
                            {selectedDispute.pool?.vendor?.name}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">
                            Price
                          </Label>
                          <p className="font-medium">
                            ₦
                            {selectedDispute.pool?.priceTotal?.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Dispute Details */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">
                        Dispute Information
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm text-muted-foreground">
                            Reason
                          </Label>
                          <p className="text-base">{selectedDispute.reason}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">
                            Status
                          </Label>
                          <Badge
                            className={getStatusColor(selectedDispute.status)}
                          >
                            <div className="flex items-center gap-1">
                              {getStatusIcon(selectedDispute.status)}
                              {selectedDispute.status.charAt(0).toUpperCase() +
                                selectedDispute.status.slice(1)}
                            </div>
                          </Badge>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">
                            Complainants
                          </Label>
                          <p className="text-base">
                            {selectedDispute.complainantCount} users involved
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">
                            Evidence Files
                          </Label>
                          {selectedDispute.evidenceFiles?.length > 0 ? (
                            <div className="space-y-2">
                              {selectedDispute.evidenceFiles.map(
                                (file: string, index: number) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between p-2 border rounded"
                                  >
                                    <span className="text-sm truncate flex-1">
                                      {file}
                                    </span>
                                    <Button size="sm" variant="outline">
                                      <Download className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )
                              )}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              No evidence files provided
                            </p>
                          )}
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">
                            Timeline
                          </Label>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span>
                                Created:{" "}
                                {format(
                                  new Date(selectedDispute.createdAt),
                                  "PPP"
                                )}
                              </span>
                            </div>
                            {selectedDispute.resolvedAt && (
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span>
                                  Resolved:{" "}
                                  {format(
                                    new Date(selectedDispute.resolvedAt),
                                    "PPP"
                                  )}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    {selectedDispute.status === "open" && (
                      <div className="flex gap-2 pt-4 border-t">
                        <Button
                          onClick={() => {
                            handleResolveDispute(selectedDispute.id, "refund");
                            setIsViewDetailsOpen(false);
                          }}
                          variant="destructive"
                        >
                          Refund All
                        </Button>
                        <Button
                          onClick={() => {
                            handleResolveDispute(selectedDispute.id, "release");
                            setIsViewDetailsOpen(false);
                          }}
                        >
                          Release to Vendor
                        </Button>
                        <Button
                          onClick={() => {
                            handleResolveDispute(selectedDispute.id, "split");
                            setIsViewDetailsOpen(false);
                          }}
                          variant="outline"
                        >
                          Split Payment
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
