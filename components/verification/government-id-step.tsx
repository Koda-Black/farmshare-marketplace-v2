"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Upload, CheckCircle, Loader2, Camera, AlertCircle } from "lucide-react"
import { Card } from "@/components/ui/card"

interface GovernmentIdStepProps {
  onComplete: () => void
}

export function GovernmentIdStep({ onComplete }: GovernmentIdStepProps) {
  const [frontImage, setFrontImage] = useState<File | null>(null)
  const [backImage, setBackImage] = useState<File | null>(null)
  const [selfieImage, setSelfieImage] = useState<File | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean
    confidence: number
    message: string
  } | null>(null)

  const handleFileUpload = (file: File, type: "front" | "back" | "selfie") => {
    if (type === "front") setFrontImage(file)
    if (type === "back") setBackImage(file)
    if (type === "selfie") setSelfieImage(file)
  }

  const handleVerify = async () => {
    if (!frontImage || !backImage || !selfieImage) return

    setIsVerifying(true)
    try {
      // TODO: Replace with actual OCR + face match API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock verification result
      setVerificationResult({
        success: true,
        confidence: 94,
        message: "Face match successful. ID verified.",
      })
    } catch (error) {
      setVerificationResult({
        success: false,
        confidence: 0,
        message: "Verification failed. Please try again.",
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const canVerify = frontImage && backImage && selfieImage
  const isVerified = verificationResult?.success

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        {/* Front ID */}
        <div className="space-y-2">
          <Label>ID Front</Label>
          <Card className="border-2 border-dashed hover:border-primary/50 transition-colors">
            <label className="flex flex-col items-center justify-center h-40 cursor-pointer p-4">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "front")}
              />
              {frontImage ? (
                <div className="text-center space-y-2">
                  <CheckCircle className="h-8 w-8 text-success mx-auto" />
                  <p className="text-sm font-medium">{frontImage.name}</p>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
                  <p className="text-sm text-muted-foreground">Upload front</p>
                </div>
              )}
            </label>
          </Card>
        </div>

        {/* Back ID */}
        <div className="space-y-2">
          <Label>ID Back</Label>
          <Card className="border-2 border-dashed hover:border-primary/50 transition-colors">
            <label className="flex flex-col items-center justify-center h-40 cursor-pointer p-4">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "back")}
              />
              {backImage ? (
                <div className="text-center space-y-2">
                  <CheckCircle className="h-8 w-8 text-success mx-auto" />
                  <p className="text-sm font-medium">{backImage.name}</p>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
                  <p className="text-sm text-muted-foreground">Upload back</p>
                </div>
              )}
            </label>
          </Card>
        </div>

        {/* Selfie */}
        <div className="space-y-2">
          <Label>Live Selfie</Label>
          <Card className="border-2 border-dashed hover:border-primary/50 transition-colors">
            <label className="flex flex-col items-center justify-center h-40 cursor-pointer p-4">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "selfie")}
              />
              {selfieImage ? (
                <div className="text-center space-y-2">
                  <CheckCircle className="h-8 w-8 text-success mx-auto" />
                  <p className="text-sm font-medium">{selfieImage.name}</p>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <Camera className="h-8 w-8 text-muted-foreground mx-auto" />
                  <p className="text-sm text-muted-foreground">Take selfie</p>
                </div>
              )}
            </label>
          </Card>
        </div>
      </div>

      {/* Verification Result */}
      {verificationResult && (
        <Alert variant={verificationResult.success ? "default" : "destructive"}>
          {verificationResult.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertDescription className="flex items-center justify-between">
            <span>{verificationResult.message}</span>
            {verificationResult.success && (
              <Badge className="bg-success text-success-foreground">{verificationResult.confidence}% match</Badge>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {!isVerified ? (
          <Button
            onClick={handleVerify}
            disabled={!canVerify || isVerifying}
            className="bg-primary hover:bg-primary/90"
          >
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Identity"
            )}
          </Button>
        ) : (
          <Button onClick={onComplete} className="bg-success hover:bg-success/90 text-success-foreground">
            <CheckCircle className="mr-2 h-4 w-4" />
            Continue to Next Step
          </Button>
        )}
      </div>
    </div>
  )
}
