"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, Upload, Info, AlertCircle, Building2, Calendar, FileText } from "lucide-react"
import { Card } from "@/components/ui/card"
import { verificationService } from "@/lib/verification.service"

interface BusinessRegistrationStepProps {
  onComplete: () => void
}

export function BusinessRegistrationStep({ onComplete }: BusinessRegistrationStepProps) {
  const [registrationNumber, setRegistrationNumber] = useState("")
  const [businessName, setBusinessName] = useState("")
  const [document, setDocument] = useState<File | null>(null)
  const [isLookingUp, setIsLookingUp] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const [companyDetails, setCompanyDetails] = useState<{
    companyName?: string
    businessType?: string
    status?: string
    registrationDate?: string
    address?: string
  } | null>(null)

  const handleLookup = async () => {
    if (!registrationNumber) return

    setIsLookingUp(true)
    setVerificationStatus("idle")
    setErrorMessage("")
    setCompanyDetails(null)

    try {
      const result = await verificationService.verifyBusinessRegistration(
        registrationNumber,
        businessName || undefined
      )

      if (result.success) {
        setCompanyDetails({
          companyName: result.companyName,
          businessType: result.businessType,
          status: result.status,
          registrationDate: result.registrationDate,
          address: result.address,
        })
        setBusinessName(result.companyName || "")
        setVerificationStatus("success")
      } else {
        setVerificationStatus("error")
        setErrorMessage(
          result.message || "Business not found in registry. Please check the registration number."
        )
      }
    } catch (error: any) {
      setVerificationStatus("error")
      setErrorMessage("Network error. Please try again.")
    } finally {
      setIsLookingUp(false)
    }
  }

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          This step is optional but highly recommended. Verified businesses build more trust with buyers.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="registration-number">Business Registration Number</Label>
          <div className="flex gap-2">
            <Input
              id="registration-number"
              placeholder="RC123456, BN123456, or IT123456"
              value={registrationNumber}
              onChange={(e) => {
                setRegistrationNumber(e.target.value.toUpperCase())
                // Reset verification when user changes input
                if (verificationStatus !== "idle") {
                  setVerificationStatus("idle")
                  setCompanyDetails(null)
                }
              }}
            />
            <Button onClick={handleLookup} disabled={!registrationNumber || isLookingUp} variant="outline">
              {isLookingUp ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify"
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Enter your CAC registration number (RC for Limited Company, BN for Business Name, IT for Incorporated Trustees)
          </p>
        </div>

        {/* Success Alert with Company Details */}
        {verificationStatus === "success" && companyDetails && (
          <Alert className="border-success bg-success/10">
            <CheckCircle className="h-4 w-4 text-success" />
            <AlertDescription>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-success">Business Verified!</p>
                  <Badge className="bg-success text-success-foreground">
                    {companyDetails.status || "Active"}
                  </Badge>
                </div>

                <div className="grid gap-2 text-sm">
                  {companyDetails.companyName && (
                    <div className="flex items-start gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Company Name</p>
                        <p className="font-medium">{companyDetails.companyName}</p>
                      </div>
                    </div>
                  )}

                  {companyDetails.businessType && (
                    <div className="flex items-start gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Business Type</p>
                        <p className="font-medium">{companyDetails.businessType}</p>
                      </div>
                    </div>
                  )}

                  {companyDetails.registrationDate && (
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Registration Date</p>
                        <p className="font-medium">{companyDetails.registrationDate}</p>
                      </div>
                    </div>
                  )}

                  {companyDetails.address && (
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Registered Address</p>
                        <p className="font-medium text-xs">{companyDetails.address}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Error Alert */}
        {verificationStatus === "error" && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="business-name">Business Name</Label>
          <Input
            id="business-name"
            placeholder="Your Business Name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Registration Certificate (Optional)</Label>
          <Card className="border-2 border-dashed hover:border-primary/50 transition-colors">
            <label className="flex flex-col items-center justify-center h-32 cursor-pointer p-4">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && setDocument(e.target.files[0])}
              />
              {document ? (
                <div className="text-center space-y-2">
                  <CheckCircle className="h-8 w-8 text-success mx-auto" />
                  <p className="text-sm font-medium">{document.name}</p>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
                  <p className="text-sm text-muted-foreground">Upload certificate</p>
                </div>
              )}
            </label>
          </Card>
        </div>
      </div>

      <div className="rounded-lg border bg-muted/30 p-4">
        <h4 className="text-sm font-medium mb-2">Why verify your business?</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Build trust with buyers and increase sales</li>
          <li>• Get a verified badge on your vendor profile</li>
          <li>• Access to higher-tier payment limits</li>
          <li>• This step is optional but highly recommended</li>
        </ul>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={onComplete}
          className="flex-1 bg-success hover:bg-success/90 text-success-foreground"
          disabled={verificationStatus === "success" ? false : false}
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Continue
        </Button>
        <Button onClick={onComplete} variant="outline" className="flex-1">
          Skip for now
        </Button>
      </div>
    </div>
  )
}
