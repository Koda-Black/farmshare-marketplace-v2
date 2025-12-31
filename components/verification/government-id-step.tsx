"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  CheckCircle,
  Loader2,
  Camera,
  AlertCircle,
  X,
  FileText,
  Scan,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { WebcamCapture } from "./webcam-capture";
import { verificationService } from "@/lib/verification.service";

interface GovernmentIdStepProps {
  onComplete: () => void;
}

export function GovernmentIdStep({ onComplete }: GovernmentIdStepProps) {
  // Form state
  const [idType, setIdType] = useState<string>("");
  const [idImage, setIdImage] = useState<File | null>(null);
  const [idImagePreview, setIdImagePreview] = useState<string>("");
  const [selfieImage, setSelfieImage] = useState<string>("");

  // Extracted data from OCR
  const [extractedData, setExtractedData] = useState<{
    fullName?: string;
    documentNumber?: string;
    dateOfBirth?: string;
    gender?: string;
  } | null>(null);

  // Loading states
  const [isExtractingOcr, setIsExtractingOcr] = useState(false);
  const [isVerifyingFace, setIsVerifyingFace] = useState(false);

  // Verification results
  const [ocrResult, setOcrResult] = useState<{
    success: boolean;
    confidence?: number;
    message: string;
  } | null>(null);

  const [faceVerificationResult, setFaceVerificationResult] = useState<{
    success: boolean;
    confidence?: number;
    message: string;
  } | null>(null);

  // Show webcam modal
  const [showWebcam, setShowWebcam] = useState(false);

  // Handle ID document upload
  const handleIdUpload = async (file: File) => {
    setIdImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setIdImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Reset previous results
    setOcrResult(null);
    setExtractedData(null);
    setFaceVerificationResult(null);
  };

  // Extract data from ID using OCR
  const handleExtractData = async () => {
    if (!idImage) return;

    setIsExtractingOcr(true);
    setOcrResult(null);

    try {
      const result = await verificationService.extractDocumentData(idImage);

      if (result.success) {
        setExtractedData({
          fullName: result.fullName,
          documentNumber: result.documentNumber,
          dateOfBirth: result.dateOfBirth,
          gender: result.gender,
        });
        setOcrResult({
          success: true,
          confidence: result.confidence,
          message: `Document data extracted successfully (${result.confidence}% confidence)`,
        });
      } else {
        setOcrResult({
          success: false,
          message: result.message || "Could not extract document data. Please try a clearer image.",
        });
      }
    } catch (error: any) {
      setOcrResult({
        success: false,
        message: "OCR extraction failed. Please try again.",
      });
    } finally {
      setIsExtractingOcr(false);
    }
  };

  // Verify face match between selfie and ID
  const handleVerifyFace = async () => {
    if (!selfieImage || !idImagePreview) return;

    setIsVerifyingFace(true);
    setFaceVerificationResult(null);

    try {
      const result = await verificationService.verifyFace(
        selfieImage,
        idImagePreview,
        70 // 70% confidence threshold
      );

      if (result.success) {
        setFaceVerificationResult({
          success: true,
          confidence: result.confidence,
          message: `Face verification successful (${result.confidence?.toFixed(1)}% match)`,
        });
      } else {
        setFaceVerificationResult({
          success: false,
          confidence: result.confidence,
          message: result.message || "Faces do not match. Please try again.",
        });
      }
    } catch (error: any) {
      setFaceVerificationResult({
        success: false,
        message: "Face verification failed. Please try again.",
      });
    } finally {
      setIsVerifyingFace(false);
    }
  };

  // Handle selfie capture from webcam
  const handleSelfieCapture = (imageData: string) => {
    setSelfieImage(imageData);
    setShowWebcam(false);
    setFaceVerificationResult(null);
  };

  // Check if all steps are complete
  const isOcrComplete = ocrResult?.success && extractedData;
  const isFaceVerified = faceVerificationResult?.success;
  const isAllComplete = isOcrComplete && isFaceVerified;

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Upload a clear photo of your government ID and take a selfie for identity verification.
          We'll extract your information automatically.
        </AlertDescription>
      </Alert>

      {/* ID Type Selection */}
      <div className="space-y-2">
        <Label>ID Type</Label>
        <Select onValueChange={setIdType} value={idType}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select ID type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NIN">NIN Card</SelectItem>
            <SelectItem value="DRIVERS_LICENSE">Driver's License</SelectItem>
            <SelectItem value="PASSPORT">International Passport</SelectItem>
            <SelectItem value="VOTER_CARD">Voter's Card</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Step 1: Upload ID Document */}
      {idType && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <h3 className="font-medium">Step 1: Upload ID Document</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>ID Document Photo</Label>
              <Card className="border-2 border-dashed hover:border-primary/50 transition-colors">
                <label className="flex flex-col items-center justify-center h-48 cursor-pointer p-4">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      e.target.files?.[0] && handleIdUpload(e.target.files[0])
                    }
                  />
                  {idImagePreview ? (
                    <div className="relative w-full h-full">
                      <img
                        src={idImagePreview}
                        alt="ID preview"
                        className="w-full h-full object-contain rounded"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 bg-background"
                        onClick={(e) => {
                          e.preventDefault();
                          setIdImage(null);
                          setIdImagePreview("");
                          setOcrResult(null);
                          setExtractedData(null);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center space-y-2">
                      <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                      <p className="text-sm font-medium">Upload ID Document</p>
                      <p className="text-xs text-muted-foreground">
                        Click to select or drag and drop
                      </p>
                    </div>
                  )}
                </label>
              </Card>
            </div>

            {idImage && !isOcrComplete && (
              <Button
                onClick={handleExtractData}
                disabled={isExtractingOcr}
                className="w-full"
                variant="outline"
              >
                {isExtractingOcr ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Extracting Data...
                  </>
                ) : (
                  <>
                    <Scan className="mr-2 h-4 w-4" />
                    Extract Data from Document
                  </>
                )}
              </Button>
            )}

            {/* OCR Result */}
            {ocrResult && (
              <Alert variant={ocrResult.success ? "default" : "destructive"}>
                {ocrResult.success ? (
                  <CheckCircle className="h-4 w-4 text-success" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertDescription>
                  <div className="flex items-center justify-between">
                    <span>{ocrResult.message}</span>
                    {ocrResult.success && ocrResult.confidence && (
                      <Badge variant="secondary">
                        {ocrResult.confidence}% confidence
                      </Badge>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Extracted Data Display */}
            {extractedData && (
              <div className="grid gap-4 p-4 border rounded-lg bg-muted/30">
                <div className="flex items-center gap-2 text-success">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Data Extracted Successfully</span>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input value={extractedData.fullName || ""} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Document Number</Label>
                    <Input value={extractedData.documentNumber || ""} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Date of Birth</Label>
                    <Input value={extractedData.dateOfBirth || ""} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <Input value={extractedData.gender || ""} readOnly />
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Step 2: Take Selfie & Verify Face */}
      {isOcrComplete && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            <h3 className="font-medium">Step 2: Verify Your Face</h3>
          </div>

          {!showWebcam && !selfieImage && (
            <Button
              onClick={() => setShowWebcam(true)}
              className="w-full"
              variant="outline"
            >
              <Camera className="mr-2 h-4 w-4" />
              Take Selfie
            </Button>
          )}

          {showWebcam && (
            <WebcamCapture
              onCapture={handleSelfieCapture}
              label="Take a clear selfie"
              buttonText="Capture Selfie"
            />
          )}

          {selfieImage && !showWebcam && (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={selfieImage}
                  alt="Selfie"
                  className="w-full max-h-64 object-contain rounded-lg border"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 bg-background"
                  onClick={() => {
                    setSelfieImage("");
                    setFaceVerificationResult(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {!isFaceVerified && (
                <Button
                  onClick={handleVerifyFace}
                  disabled={isVerifyingFace}
                  className="w-full"
                >
                  {isVerifyingFace ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying Face Match...
                    </>
                  ) : (
                    <>
                      <Scan className="mr-2 h-4 w-4" />
                      Verify Face Match
                    </>
                  )}
                </Button>
              )}
            </div>
          )}

          {/* Face Verification Result */}
          {faceVerificationResult && (
            <Alert
              variant={faceVerificationResult.success ? "default" : "destructive"}
            >
              {faceVerificationResult.success ? (
                <CheckCircle className="h-4 w-4 text-success" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <span>{faceVerificationResult.message}</span>
                  {faceVerificationResult.success && faceVerificationResult.confidence && (
                    <Badge className="bg-success text-success-foreground">
                      {faceVerificationResult.confidence.toFixed(1)}% match
                    </Badge>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}
        </Card>
      )}

      {/* Complete Button */}
      {isAllComplete && (
        <Alert className="border-success bg-success/10">
          <CheckCircle className="h-4 w-4 text-success" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-success">Identity Verified!</p>
                <p className="text-sm text-muted-foreground">
                  Your identity has been successfully verified. Continue to the next step.
                </p>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Button
        onClick={onComplete}
        disabled={!isAllComplete}
        className="w-full bg-success hover:bg-success/90 text-success-foreground disabled:opacity-50"
      >
        <CheckCircle className="mr-2 h-4 w-4" />
        {isAllComplete ? "Continue to Next Step" : "Complete Verification First"}
      </Button>
    </div>
  );
}
