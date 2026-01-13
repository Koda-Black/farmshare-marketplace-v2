"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { GovernmentIdStep } from "@/components/verification/government-id-step";
import { BusinessRegistrationStep } from "@/components/verification/business-registration-step";
import { BankAccountStep } from "@/components/verification/bank-account-step";
import { BusinessDetailsStep } from "@/components/verification/business-details-step";
import { useStore } from "@/lib/store";
import { verificationService } from "@/lib/verification.service";
import { useToast } from "@/hooks/use-toast";

type VerificationStep = "id" | "business" | "bank" | "details";

export default function VendorVerificationPage() {
  const router = useRouter();
  const user = useStore((state) => state.user);
  const updateUser = useStore((state) => state.setUser);
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<VerificationStep>("id");
  const [completedSteps, setCompletedSteps] = useState<Set<VerificationStep>>(
    new Set()
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationData, setVerificationData] = useState<{
    idFile?: File;
    businessFile?: File;
    bankData?: { accountNumber: string; bankCode: string; accountName: string };
    businessDetails?: {
      taxId?: string;
      address?: string;
      city?: string;
      state?: string;
    };
  }>({});

  const steps = [
    { id: "id" as const, label: "Government ID", required: true },
    {
      id: "business" as const,
      label: "Business Registration",
      required: false,
    },
    { id: "bank" as const, label: "Bank Account", required: true },
    { id: "details" as const, label: "Business Details", required: false },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);
  const progress = ((completedSteps.size + 1) / steps.length) * 100;

  const handleStepComplete = (step: VerificationStep, data?: any) => {
    setCompletedSteps((prev) => new Set([...prev, step]));

    // Store data from each step
    if (data) {
      setVerificationData((prev) => ({
        ...prev,
        ...(step === "id" && data.file ? { idFile: data.file } : {}),
        ...(step === "business" && data.file
          ? { businessFile: data.file }
          : {}),
        ...(step === "bank" && data.bankData
          ? { bankData: data.bankData }
          : {}),
        ...(step === "details" && data.businessDetails
          ? { businessDetails: data.businessDetails }
          : {}),
      }));
    }

    const nextStepIndex = currentStepIndex + 1;
    if (nextStepIndex < steps.length) {
      setCurrentStep(steps[nextStepIndex].id);
    }
  };

  // Map frontend step names to backend expected format
  const mapStepToBackend = (step: string): string => {
    const stepMap: Record<string, string> = {
      id: "govt_id",
      business: "business_reg",
      bank: "bank",
      details: "tax",
    };
    return stepMap[step] || step;
  };

  const handleSubmitVerification = async () => {
    setIsSubmitting(true);
    try {
      // Start the verification process with the required steps (mapped to backend format)
      const stepsToVerify = ["govt_id", "bank"];
      if (completedSteps.has("business")) stepsToVerify.push("business_reg");
      if (completedSteps.has("details")) stepsToVerify.push("tax");

      const startResult = await verificationService.startVerification(
        stepsToVerify
      );

      if (startResult.verificationId) {
        // Collect all files for submission
        const files: File[] = [];
        if (verificationData.idFile) files.push(verificationData.idFile);
        if (verificationData.businessFile)
          files.push(verificationData.businessFile);

        // Submit verification with collected data
        await verificationService.submitVerification(
          startResult.verificationId,
          files,
          {
            bankData: verificationData.bankData,
            businessDetails: verificationData.businessDetails,
          }
        );
      }

      // Update user state to reflect pending verification
      if (user) {
        updateUser({
          ...user,
          verification_status: "pending",
        });
      }

      toast({
        title: "Verification Submitted!",
        description:
          "Your verification is being reviewed. You'll be notified once approved.",
      });

      router.push("/vendor/dashboard");
    } catch (error: any) {
      console.error("Verification submission failed:", error);
      toast({
        title: "Submission Failed",
        description:
          error.message || "Failed to submit verification. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const allRequiredStepsComplete = steps
    .filter((s) => s.required)
    .every((s) => completedSteps.has(s.id));

  useEffect(() => {
    // ✅ if user just became verified, redirect automatically
    if (user?.role === "vendor" && user?.verification_status === "verified") {
      router.replace("/vendor/dashboard");
    }
  }, [user?.verification_status, user?.role, router]);

  return (
    <div className="container mx-auto px-[30px] max-w-4xl py-12">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Vendor Verification</h1>
          <p className="text-muted-foreground leading-relaxed">
            Complete the verification process to start creating buying pools and
            selling products on FarmShare.
          </p>
        </div>

        {/* Progress */}
        <Card>
          <CardContent className="">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Verification Progress</span>
                <span className="text-muted-foreground">
                  {completedSteps.size} of {steps.length} steps completed
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Steps Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.has(step.id);
            const isCurrent = currentStep === step.id;
            const isAccessible =
              index === 0 || completedSteps.has(steps[index - 1].id);

            return (
              <button
                key={step.id}
                onClick={() => isAccessible && setCurrentStep(step.id)}
                disabled={!isAccessible}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                  isCurrent
                    ? "border-primary bg-primary/5"
                    : isCompleted
                    ? "border-success bg-success/5"
                    : "border-border bg-muted/30"
                } ${
                  isAccessible
                    ? "hover:border-primary/50 cursor-pointer"
                    : "opacity-50 cursor-not-allowed"
                }`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    isCompleted
                      ? "bg-success text-success-foreground"
                      : isCurrent
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">{step.label}</p>
                  {!step.required && (
                    <Badge variant="secondary" className="text-xs mt-1">
                      Optional
                    </Badge>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Current Step Content */}
        <Card>
          <CardHeader>
            <CardTitle>
              {steps.find((s) => s.id === currentStep)?.label}
            </CardTitle>
            <CardDescription>
              {currentStep === "id" &&
                "Upload your government-issued ID for identity verification"}
              {currentStep === "business" &&
                "Provide your business registration details (optional but recommended)"}
              {currentStep === "bank" &&
                "Connect your bank account to receive payments"}
              {currentStep === "details" &&
                "Add additional business information (optional)"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentStep === "id" && (
              <GovernmentIdStep onComplete={() => handleStepComplete("id")} />
            )}
            {currentStep === "business" && (
              <BusinessRegistrationStep
                onComplete={() => handleStepComplete("business")}
              />
            )}
            {currentStep === "bank" && (
              <BankAccountStep onComplete={() => handleStepComplete("bank")} />
            )}
            {currentStep === "details" && (
              <BusinessDetailsStep
                onComplete={() => handleStepComplete("details")}
              />
            )}
          </CardContent>
        </Card>

        {/* Blocked Actions Warning */}
        {!allRequiredStepsComplete && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You must complete all required verification steps before you can
              create buying pools and start selling.
            </AlertDescription>
          </Alert>
        )}

        {/* Submit Button */}
        {allRequiredStepsComplete && (
          <Card className="border-success bg-success/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-semibold text-success">
                    Verification Complete!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Submit your verification for admin review
                  </p>
                </div>
                <Button
                  size="lg"
                  onClick={handleSubmitVerification}
                  disabled={isSubmitting}
                  className="bg-success hover:bg-success/90 text-success-foreground"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit for Review"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
