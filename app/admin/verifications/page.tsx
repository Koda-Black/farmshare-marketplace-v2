"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, CheckCircle, XCircle, Clock, Eye } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { VerificationReviewModal } from "@/components/admin/verification-review-modal"

export default function AdminVerificationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedVerification, setSelectedVerification] = useState<any>(null)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)

  // Mock verification requests
  const verifications = [
    {
      id: "ver_1",
      user_id: "user_1",
      user_name: "John Doe Farms",
      user_email: "john@example.com",
      business_name: "John Doe Agricultural Supplies",
      registration_number: "RC123456",
      bank_account: "0123456789",
      bank_name: "Access Bank",
      submitted_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: "pending",
      documents: {
        id_front: "/docs/id_front.jpg",
        id_back: "/docs/id_back.jpg",
        selfie: "/docs/selfie.jpg",
        business_cert: "/docs/business.pdf",
      },
    },
    {
      id: "ver_2",
      user_id: "user_2",
      user_name: "Jane Smith",
      user_email: "jane@example.com",
      business_name: "Green Valley Farms",
      registration_number: "RC789012",
      bank_account: "9876543210",
      bank_name: "GTBank",
      submitted_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      status: "pending",
      documents: {
        id_front: "/docs/id_front.jpg",
        id_back: "/docs/id_back.jpg",
        selfie: "/docs/selfie.jpg",
      },
    },
    {
      id: "ver_3",
      user_id: "user_3",
      user_name: "Mike Johnson",
      user_email: "mike@example.com",
      business_name: "Tropical Harvest Ltd",
      registration_number: "RC345678",
      bank_account: "5555555555",
      bank_name: "Zenith Bank",
      submitted_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      status: "approved",
      documents: {
        id_front: "/docs/id_front.jpg",
        id_back: "/docs/id_back.jpg",
        selfie: "/docs/selfie.jpg",
        business_cert: "/docs/business.pdf",
      },
    },
  ]

  const handleReview = (verification: any) => {
    setSelectedVerification(verification)
    setIsReviewModalOpen(true)
  }

  const statusConfig = {
    pending: { icon: Clock, color: "text-yellow-600", bg: "bg-yellow-100", label: "Pending" },
    approved: { icon: CheckCircle, color: "text-success", bg: "bg-success/10", label: "Approved" },
    rejected: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", label: "Rejected" },
  }

  return (
    <div className="container py-8">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Vendor Verifications</h1>
          <p className="text-muted-foreground mt-1">Review and approve vendor verification requests</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{verifications.filter((v) => v.status === "pending").length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{verifications.filter((v) => v.status === "approved").length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{verifications.filter((v) => v.status === "rejected").length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or business..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>

        {/* Verifications Table */}
        <Card>
          <CardHeader>
            <CardTitle>Verification Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Business Name</TableHead>
                  <TableHead>Registration</TableHead>
                  <TableHead>Bank Account</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {verifications.map((verification) => {
                  const StatusIcon = statusConfig[verification.status as keyof typeof statusConfig].icon
                  return (
                    <TableRow key={verification.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{verification.user_name}</p>
                          <p className="text-sm text-muted-foreground">{verification.user_email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{verification.business_name}</TableCell>
                      <TableCell className="font-mono text-sm">{verification.registration_number}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-mono text-sm">{verification.bank_account}</p>
                          <p className="text-xs text-muted-foreground">{verification.bank_name}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(verification.submitted_at).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={statusConfig[verification.status as keyof typeof statusConfig].bg}
                        >
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {statusConfig[verification.status as keyof typeof statusConfig].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => handleReview(verification)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {selectedVerification && (
        <VerificationReviewModal
          open={isReviewModalOpen}
          onOpenChange={setIsReviewModalOpen}
          verification={selectedVerification}
        />
      )}
    </div>
  )
}
