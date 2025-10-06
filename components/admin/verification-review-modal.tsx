"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, FileText, ImageIcon, Loader2, Info } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface VerificationReviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  verification: any
}

export function VerificationReviewModal({ open, onOpenChange, verification }: VerificationReviewModalProps) {
  const [decision, setDecision] = useState<"approve" | "reject" | null>(null)
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!decision) return

    setIsSubmitting(true)
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      console.log("Verification decision:", {
        verification_id: verification.id,
        decision,
        notes,
      })

      onOpenChange(false)
      setDecision(null)
      setNotes("")
    } catch (error) {
      console.error("Failed to submit decision:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Review Verification Request</DialogTitle>
          <DialogDescription>Review vendor documents and make a decision</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Vendor Info */}
          <div className="space-y-3">
            <h3 className="font-semibold">Vendor Information</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Name</p>
                <p className="font-medium">{verification.user_name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="font-medium">{verification.user_email}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Business Name</p>
                <p className="font-medium">{verification.business_name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Registration Number</p>
                <p className="font-medium font-mono">{verification.registration_number}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Bank Account</p>
                <p className="font-medium font-mono">{verification.bank_account}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Bank</p>
                <p className="font-medium">{verification.bank_name}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Documents */}
          <div className="space-y-3">
            <h3 className="font-semibold">Submitted Documents</h3>
            <Tabs defaultValue="id">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="id">ID Documents</TabsTrigger>
                <TabsTrigger value="selfie">Selfie</TabsTrigger>
                <TabsTrigger value="business">Business Docs</TabsTrigger>
                <TabsTrigger value="bank">Bank Info</TabsTrigger>
              </TabsList>

              <TabsContent value="id" className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>ID Front</Label>
                    <div className="border rounded-lg p-4 bg-muted/30 flex items-center justify-center h-48">
                      <div className="text-center space-y-2">
                        <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">ID Front Image</p>
                        <Button variant="outline" size="sm">
                          View Full Size
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>ID Back</Label>
                    <div className="border rounded-lg p-4 bg-muted/30 flex items-center justify-center h-48">
                      <div className="text-center space-y-2">
                        <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">ID Back Image</p>
                        <Button variant="outline" size="sm">
                          View Full Size
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    Verify that the ID is clear, not expired, and matches the vendor's information.
                  </AlertDescription>
                </Alert>
              </TabsContent>

              <TabsContent value="selfie" className="space-y-4">
                <div className="space-y-2">
                  <Label>Live Selfie</Label>
                  <div className="border rounded-lg p-4 bg-muted/30 flex items-center justify-center h-64">
                    <div className="text-center space-y-2">
                      <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Selfie Image</p>
                      <Button variant="outline" size="sm">
                        View Full Size
                      </Button>
                    </div>
                  </div>
                </div>
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    <strong>Face Match: 94%</strong> - The selfie matches the ID photo with high confidence.
                  </AlertDescription>
                </Alert>
              </TabsContent>

              <TabsContent value="business" className="space-y-4">
                {verification.documents.business_cert ? (
                  <div className="space-y-2">
                    <Label>Business Registration Certificate</Label>
                    <div className="border rounded-lg p-6 bg-muted/30 flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">business_certificate.pdf</p>
                        <Button variant="outline" size="sm">
                          Download & Review
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      No business registration documents submitted. This is optional but recommended.
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>

              <TabsContent value="bank" className="space-y-4">
                <div className="space-y-3">
                  <div className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Account Number</span>
                      <span className="font-mono font-medium">{verification.bank_account}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Bank Name</span>
                      <span className="font-medium">{verification.bank_name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Account Name</span>
                      <span className="font-medium">{verification.business_name}</span>
                    </div>
                  </div>
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      Bank account verified via Paystack. Account name matches business registration.
                    </AlertDescription>
                  </Alert>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <Separator />

          {/* Decision */}
          <div className="space-y-3">
            <h3 className="font-semibold">Make Decision</h3>
            <div className="grid md:grid-cols-2 gap-3">
              <Button
                variant={decision === "approve" ? "default" : "outline"}
                className={decision === "approve" ? "bg-success hover:bg-success/90 text-success-foreground" : ""}
                onClick={() => setDecision("approve")}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve Verification
              </Button>
              <Button
                variant={decision === "reject" ? "default" : "outline"}
                className={
                  decision === "reject" ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground" : ""
                }
                onClick={() => setDecision("reject")}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject Verification
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about this decision..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!decision || isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Decision"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
