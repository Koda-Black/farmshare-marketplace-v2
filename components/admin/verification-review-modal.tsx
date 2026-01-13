"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  FileText,
  ImageIcon,
  Loader2,
  Info,
  User,
  Building2,
  ExternalLink,
  Phone,
  Mail,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminDashboard } from "@/hooks/use-admin";
import { useToast } from "@/hooks/use-toast";
import type { Verification } from "@/lib/admin.service";

interface VerificationReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  verification: Verification;
}

export function VerificationReviewModal({
  open,
  onOpenChange,
  verification,
}: VerificationReviewModalProps) {
  const [decision, setDecision] = useState<"approve" | "reject" | null>(null);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [feedback, setFeedback] = useState("");
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const { approveVerification, rejectVerification } = useAdminDashboard();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!decision) return;

    setIsSubmitting(true);
    try {
      if (decision === "approve") {
        await approveVerification(verification.id, notes);
        toast({
          title: "Verification Approved",
          description: `All verification steps for ${
            verification.user?.name || "this vendor"
          } have been approved.`,
          variant: "default",
        });
      } else {
        if (!rejectionReason) {
          toast({
            title: "Error",
            description: "Rejection reason is required",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
        await rejectVerification(verification.id, rejectionReason, feedback);
        toast({
          title: "Verification Rejected",
          description: `Verification for ${
            verification.user?.name || "this vendor"
          } has been rejected.`,
          variant: "destructive",
        });
      }

      onOpenChange(false);
      setDecision(null);
      setNotes("");
      setRejectionReason("");
      setFeedback("");
    } catch (error: any) {
      console.error("Failed to submit decision:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to submit decision. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageError = (key: string) => {
    setImageErrors((prev) => ({ ...prev, [key]: true }));
  };

  // Get document images from the consolidated verification data
  const govtIdFiles = verification.documents?.govtId?.files || [];
  const hasGovtIdFiles = govtIdFiles.length > 0;

  // Get step details for each verification step
  const getStepDetails = (stepName: string) => {
    return verification.steps?.find((s) => s.step === stepName)?.details || {};
  };

  const govtIdDetails = getStepDetails("govt_id");
  const businessDetails = getStepDetails("business_reg");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Review Verification Request
          </DialogTitle>
          <DialogDescription>
            Review all vendor documents and verification steps, then make a
            decision
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Vendor Info */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <User className="h-4 w-4" />
              Vendor Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground text-xs">Name</p>
                  <p className="font-medium">
                    {verification.user?.name || "Unknown"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground text-xs">Email</p>
                  <p className="font-medium">
                    {verification.user?.email || "Unknown"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground text-xs">Phone</p>
                  <p className="font-medium">
                    {verification.user?.phone || "Not provided"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground text-xs">
                    Registration Number
                  </p>
                  <p className="font-medium font-mono">
                    {verification.documents?.business?.registrationNumber ||
                      "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Verification Steps Status */}
            <div className="flex flex-wrap gap-2 mt-2">
              {verification.steps?.map((step) => (
                <Badge
                  key={step.id}
                  variant={
                    step.status === "VERIFIED"
                      ? "default"
                      : step.status === "REJECTED"
                      ? "destructive"
                      : "secondary"
                  }
                  className="capitalize"
                >
                  {step.step.replace("_", " ")} - {step.status.toLowerCase()}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Documents */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Submitted Documents
            </h3>
            <Tabs defaultValue="id">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="id">ID Documents</TabsTrigger>
                <TabsTrigger value="selfie">Selfie</TabsTrigger>
                <TabsTrigger value="business">Business</TabsTrigger>
                <TabsTrigger value="bank">Bank Info</TabsTrigger>
              </TabsList>

              <TabsContent value="id" className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {/* ID Front */}
                  <div className="space-y-2">
                    <Label className="flex items-center justify-between">
                      <span>ID Front</span>
                      <Badge variant="outline" className="text-xs">
                        {verification.documents?.govtId?.type ||
                          "Not specified"}
                      </Badge>
                    </Label>
                    <div className="border rounded-lg overflow-hidden bg-muted/30">
                      {hasGovtIdFiles &&
                      govtIdFiles[0] &&
                      !imageErrors["id-front"] ? (
                        <div className="relative h-48 w-full">
                          <Image
                            src={govtIdFiles[0]}
                            alt="ID Front"
                            fill
                            className="object-contain"
                            onError={() => handleImageError("id-front")}
                          />
                          <a
                            href={govtIdFiles[0]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute bottom-2 right-2"
                          >
                            <Button variant="secondary" size="sm">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Full Size
                            </Button>
                          </a>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-48">
                          <div className="text-center space-y-2">
                            <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              {hasGovtIdFiles
                                ? "Failed to load image"
                                : "No ID front uploaded"}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ID Back */}
                  <div className="space-y-2">
                    <Label>ID Back</Label>
                    <div className="border rounded-lg overflow-hidden bg-muted/30">
                      {hasGovtIdFiles &&
                      govtIdFiles[1] &&
                      !imageErrors["id-back"] ? (
                        <div className="relative h-48 w-full">
                          <Image
                            src={govtIdFiles[1]}
                            alt="ID Back"
                            fill
                            className="object-contain"
                            onError={() => handleImageError("id-back")}
                          />
                          <a
                            href={govtIdFiles[1]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute bottom-2 right-2"
                          >
                            <Button variant="secondary" size="sm">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Full Size
                            </Button>
                          </a>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-48">
                          <div className="text-center space-y-2">
                            <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              {hasGovtIdFiles && govtIdFiles.length > 1
                                ? "Failed to load image"
                                : "No ID back uploaded"}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* ID Details */}
                <div className="p-4 border rounded-lg bg-muted/20 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">ID Type</span>
                    <span className="font-medium">
                      {verification.documents?.govtId?.type || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">ID Number</span>
                    <span className="font-mono font-medium">
                      {verification.documents?.govtId?.number || "N/A"}
                    </span>
                  </div>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    Verify that the ID is clear, not expired, and matches the
                    vendor's information.
                  </AlertDescription>
                </Alert>
              </TabsContent>

              <TabsContent value="selfie" className="space-y-4">
                <div className="space-y-2">
                  <Label>Live Selfie</Label>
                  <div className="border rounded-lg overflow-hidden bg-muted/30">
                    {govtIdDetails?.selfieUrl && !imageErrors["selfie"] ? (
                      <div className="relative h-64 w-full">
                        <Image
                          src={govtIdDetails.selfieUrl}
                          alt="Selfie"
                          fill
                          className="object-contain"
                          onError={() => handleImageError("selfie")}
                        />
                        <a
                          href={govtIdDetails.selfieUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute bottom-2 right-2"
                        >
                          <Button variant="secondary" size="sm">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Full Size
                          </Button>
                        </a>
                      </div>
                    ) : hasGovtIdFiles &&
                      govtIdFiles[2] &&
                      !imageErrors["selfie-fallback"] ? (
                      <div className="relative h-64 w-full">
                        <Image
                          src={govtIdFiles[2]}
                          alt="Selfie"
                          fill
                          className="object-contain"
                          onError={() => handleImageError("selfie-fallback")}
                        />
                        <a
                          href={govtIdFiles[2]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute bottom-2 right-2"
                        >
                          <Button variant="secondary" size="sm">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Full Size
                          </Button>
                        </a>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-64">
                        <div className="text-center space-y-2">
                          <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            No selfie uploaded
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    Compare the selfie with the ID photo to verify identity
                    match.
                  </AlertDescription>
                </Alert>
              </TabsContent>

              <TabsContent value="business" className="space-y-4">
                <div className="space-y-4">
                  {businessDetails?.files?.length > 0 ? (
                    <div className="space-y-2">
                      <Label>Business Registration Certificate</Label>
                      <div className="border rounded-lg overflow-hidden bg-muted/30">
                        {businessDetails.files[0].match(
                          /\.(jpg|jpeg|png|gif|webp)$/i
                        ) ? (
                          <div className="relative h-64 w-full">
                            <Image
                              src={businessDetails.files[0]}
                              alt="Business Certificate"
                              fill
                              className="object-contain"
                              onError={() => handleImageError("business-cert")}
                            />
                          </div>
                        ) : (
                          <div className="p-6 flex items-center justify-center">
                            <div className="text-center space-y-2">
                              <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">
                                Business Certificate Document
                              </p>
                              <a
                                href={businessDetails.files[0]}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Button variant="outline" size="sm">
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  Download & Review
                                </Button>
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        No business registration documents submitted. This may
                        be optional for some vendor types.
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Business Details */}
                  <div className="p-4 border rounded-lg bg-muted/20 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Registration Number
                      </span>
                      <span className="font-mono font-medium">
                        {verification.documents?.business?.registrationNumber ||
                          "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Tax ID</span>
                      <span className="font-mono font-medium">
                        {verification.documents?.tax?.taxId || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="bank" className="space-y-4">
                <div className="space-y-3">
                  <div className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Account Number
                      </span>
                      <span className="font-mono font-medium">
                        {verification.documents?.bank?.accountId || "N/A"}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Bank Name
                      </span>
                      <span className="font-medium">
                        {verification.documents?.bank?.bankName || "N/A"}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Account Name
                      </span>
                      <span className="font-medium">
                        {verification.documents?.bank?.accountName || "N/A"}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Bank Code
                      </span>
                      <span className="font-mono font-medium">
                        {verification.documents?.bank?.bankCode || "N/A"}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Verification Status
                      </span>
                      <Badge
                        variant={
                          verification.documents?.bank?.verified
                            ? "default"
                            : "secondary"
                        }
                      >
                        {verification.documents?.bank?.verified
                          ? "Verified"
                          : "Pending"}
                      </Badge>
                    </div>
                  </div>
                  {verification.documents?.bank?.verified ? (
                    <Alert>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-xs">
                        Bank account has been verified via Paystack.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        Bank account verification is pending or not completed.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <Separator />

          {/* Decision */}
          <div className="space-y-3">
            <h3 className="font-semibold">Make Decision</h3>
            <p className="text-xs text-muted-foreground">
              This will approve or reject ALL {verification.steps?.length || 0}{" "}
              verification steps for this vendor.
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              <Button
                variant={decision === "approve" ? "default" : "outline"}
                className={
                  decision === "approve"
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : ""
                }
                onClick={() => setDecision("approve")}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve All Steps
              </Button>
              <Button
                variant={decision === "reject" ? "default" : "outline"}
                className={
                  decision === "reject"
                    ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                    : ""
                }
                onClick={() => setDecision("reject")}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject All Steps
              </Button>
            </div>

            {/* Approval Notes */}
            {decision === "approve" && (
              <div className="space-y-2 p-4 border border-green-500/20 rounded-lg bg-green-500/5">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes about this approval..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            )}

            {/* Rejection Form */}
            {decision === "reject" && (
              <div className="space-y-4 p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                <Alert>
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    Rejection requires a specific reason. The vendor will be
                    notified.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label htmlFor="rejectionReason">Rejection Reason *</Label>
                  <Textarea
                    id="rejectionReason"
                    placeholder="Provide a clear reason for rejection (e.g., 'Documents are unclear', 'Information does not match', 'Invalid documents')..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={2}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="feedback">
                    Feedback for Vendor (Optional)
                  </Label>
                  <Textarea
                    id="feedback"
                    placeholder="Provide constructive feedback to help the vendor fix the issues..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !decision ||
              isSubmitting ||
              (decision === "reject" && !rejectionReason)
            }
            className={
              decision === "approve" ? "bg-green-600 hover:bg-green-700" : ""
            }
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {decision === "approve" ? "Approving..." : "Rejecting..."}
              </>
            ) : (
              <>
                {decision === "approve" ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve Verification
                  </>
                ) : decision === "reject" ? (
                  <>
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject Verification
                  </>
                ) : (
                  "Select a Decision"
                )}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
