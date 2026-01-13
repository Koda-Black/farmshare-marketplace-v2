"use client";

import { useState, useCallback } from "react";
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
  Shield,
  User,
  CreditCard,
  Calendar,
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

  // Extract data from ID using OCR
  const extractDocumentData = useCallback(async (file: File) => {
    setIsExtractingOcr(true);
    setOcrResult(null);

    try {
      const result = await verificationService.extractDocumentData(file);

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
          message:
            result.message ||
            "Could not extract document data. Please try a clearer image.",
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
  }, []);

  // Handle ID document upload - AUTO-TRIGGERS OCR extraction
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

    // Auto-trigger OCR extraction
    extractDocumentData(file);
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
          message: `Face verification successful (${result.confidence?.toFixed(
            1
          )}% match)`,
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
      {/* Header */}
      <div className="text-center pb-2">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mx-auto mb-3">
          <Shield className="h-7 w-7 text-primary" />
        </div>
        <h2 className="text-xl font-semibold mb-1">Identity Verification</h2>
        <p className="text-sm text-muted-foreground">
          Upload your government ID and take a selfie to verify your identity
        </p>
      </div>

      {/* ID Type Selection */}
      <div className="space-y-2">
        <Label className="text-base font-medium">Select ID Type</Label>
        <Select onValueChange={setIdType} value={idType}>
          <SelectTrigger className="w-full h-12">
            <SelectValue placeholder="Choose your ID type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NIN">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                NIN Card
              </div>
            </SelectItem>
            <SelectItem value="DRIVERS_LICENSE">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Driver&apos;s License
              </div>
            </SelectItem>
            <SelectItem value="PASSPORT">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                International Passport
              </div>
            </SelectItem>
            <SelectItem value="VOTER_CARD">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Voter&apos;s Card
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Step 1: Upload ID Document */}
      {idType && (
        <Card className="p-6 space-y-4 border-2 border-muted hover:border-primary/30 transition-all">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Step 1: Upload ID Document</h3>
              <p className="text-sm text-muted-foreground">
                Upload a clear photo of your {idType.replace("_", " ")}
              </p>
            </div>
            {isOcrComplete && (
              <Badge className="ml-auto bg-success text-success-foreground">
                <CheckCircle className="h-3 w-3 mr-1" />
                Complete
              </Badge>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-base font-medium">ID Document Photo</Label>
              <Card className="border-2 border-dashed hover:border-primary/50 transition-colors overflow-hidden">
                <label className="flex flex-col items-center justify-center min-h-48 cursor-pointer p-4 relative">
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
                        className="w-full h-48 object-contain rounded"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 bg-background/80 hover:bg-background"
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

                      {/* OCR Progress Overlay */}
                      {isExtractingOcr && (
                        <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded">
                          <div className="text-center space-y-3">
                            <div className="relative">
                              <Scan className="h-10 w-10 text-primary animate-pulse" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">
                                Extracting Document Data...
                              </p>
                              <p className="text-xs text-muted-foreground">
                                This may take a few seconds
                              </p>
                            </div>
                            <Loader2 className="h-5 w-5 animate-spin mx-auto text-primary" />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center space-y-3 py-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto">
                        <Upload className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          Upload ID Document
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Click to select or drag and drop
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        JPG, PNG up to 10MB
                      </Badge>
                    </div>
                  )}
                </label>
              </Card>
            </div>

            {/* Retry button if OCR failed */}
            {ocrResult && !ocrResult.success && idImage && (
              <Button
                onClick={() => extractDocumentData(idImage)}
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
                    Retry Data Extraction
                  </>
                )}
              </Button>
            )}

            {/* OCR Result */}
            {ocrResult && (
              <Alert
                variant={ocrResult.success ? "default" : "destructive"}
                className={
                  ocrResult.success ? "border-success bg-success/10" : ""
                }
              >
                {ocrResult.success ? (
                  <CheckCircle className="h-4 w-4 text-success" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertDescription>
                  <div className="flex items-center justify-between">
                    <span>{ocrResult.message}</span>
                    {ocrResult.success && ocrResult.confidence && (
                      <Badge className="bg-success text-success-foreground">
                        {ocrResult.confidence}% confidence
                      </Badge>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Extracted Data Display */}
            {extractedData && (
              <Card className="p-4 bg-gradient-to-br from-success/5 to-primary/5 border-success/20">
                <div className="flex items-center gap-2 text-success mb-4">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-semibold">
                    Data Extracted Successfully
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      Full Name
                    </Label>
                    <Input
                      value={extractedData.fullName || ""}
                      readOnly
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CreditCard className="h-3 w-3" />
                      Document Number
                    </Label>
                    <Input
                      value={extractedData.documentNumber || ""}
                      readOnly
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      Date of Birth
                    </Label>
                    <Input
                      value={extractedData.dateOfBirth || ""}
                      readOnly
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      Gender
                    </Label>
                    <Input
                      value={extractedData.gender || ""}
                      readOnly
                      className="bg-background"
                    />
                  </div>
                </div>
              </Card>
            )}
          </div>
        </Card>
      )}

      {/* Step 2: Take Selfie & Verify Face */}
      {isOcrComplete && (
        <Card className="p-6 space-y-4 border-2 border-muted hover:border-primary/30 transition-all">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Camera className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Step 2: Verify Your Face</h3>
              <p className="text-sm text-muted-foreground">
                Take a selfie to match with your ID photo
              </p>
            </div>
            {isFaceVerified && (
              <Badge className="ml-auto bg-success text-success-foreground">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>

          {!showWebcam && !selfieImage && (
            <Card
              className="border-2 border-dashed p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => setShowWebcam(true)}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto mb-4">
                <Camera className="h-8 w-8 text-primary" />
              </div>
              <p className="font-medium mb-1">Take a Selfie</p>
              <p className="text-sm text-muted-foreground mb-4">
                Click to open your camera and take a clear photo of your face
              </p>
              <Button variant="outline" className="mx-auto">
                <Camera className="mr-2 h-4 w-4" />
                Open Camera
              </Button>
            </Card>
          )}

          {showWebcam && (
            <div className="space-y-4">
              <WebcamCapture
                onCapture={handleSelfieCapture}
                label="Take a clear selfie"
                buttonText="Capture Selfie"
              />
              <Button
                variant="ghost"
                onClick={() => setShowWebcam(false)}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
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
                  className="absolute top-2 right-2 bg-background/80 hover:bg-background"
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
                  className="w-full h-12"
                >
                  {isVerifyingFace ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying Face Match...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
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
              variant={
                faceVerificationResult.success ? "default" : "destructive"
              }
              className={
                faceVerificationResult.success
                  ? "border-success bg-success/10"
                  : ""
              }
            >
              {faceVerificationResult.success ? (
                <CheckCircle className="h-4 w-4 text-success" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <span>{faceVerificationResult.message}</span>
                  {faceVerificationResult.success &&
                    faceVerificationResult.confidence && (
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
        <Card className="p-4 border-success bg-gradient-to-r from-success/10 to-primary/10">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/20">
              <CheckCircle className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="font-semibold text-success">Identity Verified!</p>
              <p className="text-sm text-muted-foreground">
                Your identity has been successfully verified
              </p>
            </div>
          </div>
        </Card>
      )}

      <Button
        onClick={onComplete}
        disabled={!isAllComplete}
        className="w-full h-12 bg-success hover:bg-success/90 text-success-foreground disabled:opacity-50"
        size="lg"
      >
        <CheckCircle className="mr-2 h-5 w-5" />
        {isAllComplete
          ? "Continue to Next Step"
          : "Complete Verification First"}
      </Button>
    </div>
  );
}
