"use client";

import { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { Camera, RotateCcw, Check } from "lucide-react";

interface WebcamCaptureProps {
  onCapture: (imageData: string) => void;
  label?: string;
  buttonText?: string;
}

export function WebcamCapture({
  onCapture,
  label = "Capture Photo",
  buttonText = "Take Photo",
}: WebcamCaptureProps) {
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      onCapture(imageSrc);
    }
  }, [webcamRef, onCapture]);

  const retake = () => {
    setCapturedImage(null);
  };

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

  // Screenshot quality (0.0 to 1.0) - lower = smaller file size
  const screenshotQuality = 0.7;

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium">{label}</div>

      <div className="relative aspect-video w-full overflow-hidden rounded-lg border-2 border-dashed bg-muted">
        {capturedImage ? (
          <img
            src={capturedImage}
            alt="Captured"
            className="h-full w-full object-cover"
          />
        ) : (
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            screenshotQuality={screenshotQuality}
            videoConstraints={videoConstraints}
            onUserMedia={() => setIsCameraReady(true)}
            className="h-full w-full object-cover"
          />
        )}

        {!isCameraReady && !capturedImage && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <div className="text-center">
              <Camera className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                Initializing camera...
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {capturedImage ? (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={retake}
              className="flex-1"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Retake
            </Button>
            <Button type="button" className="flex-1" disabled>
              <Check className="mr-2 h-4 w-4" />
              Photo Captured
            </Button>
          </>
        ) : (
          <Button
            type="button"
            onClick={capture}
            disabled={!isCameraReady}
            className="w-full"
          >
            <Camera className="mr-2 h-4 w-4" />
            {buttonText}
          </Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Make sure your face is clearly visible and well-lit
      </p>
    </div>
  );
}
