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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Upload,
  FileText,
  X,
  AlertTriangle,
  Send,
  Loader2,
  Info,
  Camera,
} from "lucide-react"
import { useUserDisputes } from "@/hooks/use-disputes"
import { useStore } from "@/lib/store"

interface DisputeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pool: any
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function DisputeModal({ open, onOpenChange, pool, onSuccess, onError }: DisputeModalProps) {
  const { user } = useStore()
  const { createDispute, canCreateDispute, loading } = useUserDisputes()

  // Form state
  const [reason, setReason] = useState("")
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(false)
  const [canCreate, setCanCreate] = useState(true)
  const [eligibilityMessage, setEligibilityMessage] = useState("")

  // Check if user can create dispute for this pool
  const checkDisputeEligibility = async () => {
    if (!pool) return

    setIsCheckingEligibility(true)
    try {
      const result = await canCreateDispute(pool.id)
      setCanCreate(result.canCreate)
      setEligibilityMessage(result.reason || "")

      if (!result.canCreate && result.existingDispute) {
        onError?.(result.reason || "You already have an active dispute for this pool")
      }
    } catch (error: any) {
      console.error("Failed to check dispute eligibility:", error)
      setCanCreate(false)
      setEligibilityMessage("Unable to verify dispute eligibility. Please try again.")
    } finally {
      setIsCheckingEligibility(false)
    }
  }

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter(file => {
      // Allow images and documents up to 10MB
      const isValidType = file.type.startsWith('image/') || file.type === 'application/pdf'
      const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB
      return isValidType && isValidSize
    })

    setEvidenceFiles(prev => [...prev, ...validFiles])
  }

  // Remove file
  const removeFile = (index: number) => {
    setEvidenceFiles(prev => prev.filter((_, i) => i !== index))
  }

  // Handle dispute submission
  const handleSubmit = async () => {
    if (!user || !canCreate) return

    if (!reason.trim()) {
      onError?.("Please provide a reason for the dispute")
      return
    }

    setIsSubmitting(true)
    try {
      await createDispute({
        poolId: pool.id,
        reason: reason.trim(),
        files: evidenceFiles,
      })

      onSuccess?.()
      onOpenChange(false)

      // Reset form
      setReason("")
      setEvidenceFiles([])

    } catch (error: any) {
      console.error("Failed to create dispute:", error)
      onError?.(error.message || "Failed to create dispute. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Check eligibility when modal opens
  useState(() => {
    if (open && pool) {
      checkDisputeEligibility()
    }
  })

  const isFormValid = reason.trim().length > 0 && canCreate

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Open Dispute</DialogTitle>
          <DialogDescription>
            Report an issue with your order from the pool: {pool?.product_name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Pool Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Order Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Product</span>
                <span className="font-medium">{pool?.product_name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Vendor</span>
                <span className="font-medium">{pool?.vendor?.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Pool Status</span>
                <Badge variant="secondary">{pool?.status}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Delivery Deadline</span>
                <span className="font-medium">
                  {pool?.delivery_deadline ? new Date(pool.delivery_deadline).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Eligibility Check */}
          {isCheckingEligibility ? (
            <Card>
              <CardContent className="flex items-center justify-center py-6">
                <div className="text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Checking dispute eligibility...</p>
                </div>
              </CardContent>
            </Card>
          ) : !canCreate ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {eligibilityMessage || "You cannot create a dispute for this pool at this time."}
              </AlertDescription>
            </Alert>
          ) : (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                You are eligible to open a dispute for this pool. Please provide detailed information and any supporting evidence.
              </AlertDescription>
            </Alert>
          )}

          {/* Dispute Reason */}
          <div className="space-y-3">
            <Label htmlFor="reason">Dispute Reason *</Label>
            <Textarea
              id="reason"
              placeholder="Please describe the issue in detail. Include specific information about what went wrong, when it happened, and what you expected to happen."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              disabled={!canCreate}
            />
            <p className="text-xs text-muted-foreground">
              Be as specific as possible to help us resolve your dispute quickly.
            </p>
          </div>

          {/* Evidence Upload */}
          <div className="space-y-3">
            <Label>Supporting Evidence</Label>
            <p className="text-sm text-muted-foreground">
              Upload photos, screenshots, or documents that support your dispute claim (Optional but recommended)
            </p>

            {/* File Upload Area */}
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <input
                type="file"
                id="evidence-files"
                multiple
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                className="hidden"
                disabled={!canCreate}
              />
              <label htmlFor="evidence-files" className="cursor-pointer">
                <Upload className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">Click to upload files</p>
                <p className="text-xs text-muted-foreground">
                  Images and PDFs up to 10MB each
                </p>
              </label>
            </div>

            {/* Uploaded Files */}
            {evidenceFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Uploaded Files:</p>
                {evidenceFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      {file.type.startsWith('image/') ? (
                        <Camera className="h-4 w-4" />
                      ) : (
                        <FileText className="h-4 w-4" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      disabled={!canCreate}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dispute Process Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Dispute Process</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">1</div>
                  <span className="text-sm">Submit your dispute with evidence</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-xs font-medium">2</div>
                  <span className="text-sm">Admin team reviews your case</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-xs font-medium">3</div>
                  <span className="text-sm">Resolution decision is made</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-xs font-medium">4</div>
                  <span className="text-sm">Funds are distributed based on decision</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                This process typically takes 3-5 business days. You'll be notified of any updates.
              </p>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting || loading}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting Dispute...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit Dispute
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}