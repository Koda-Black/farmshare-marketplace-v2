"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, Upload, Info } from "lucide-react"
import { Card } from "@/components/ui/card"

interface BusinessRegistrationStepProps {
  onComplete: () => void
}

export function BusinessRegistrationStep({ onComplete }: BusinessRegistrationStepProps) {
  const [registrationNumber, setRegistrationNumber] = useState("")
  const [businessName, setBusinessName] = useState("")
  const [document, setDocument] = useState<File | null>(null)
  const [isLookingUp, setIsLookingUp] = useState(false)
  const [lookupResult, setLookupResult] = useState<{
    found: boolean
    name?: string
    status?: string
  } | null>(null)

  const handleLookup = async () => {
    if (!registrationNumber) return

    setIsLookingUp(true)
    try {
      // TODO: Replace with actual government registry API lookup
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock lookup result
      setLookupResult({
        found: true,
        name: "FarmCo Agricultural Supplies Ltd",
        status: "Active",
      })
      setBusinessName("FarmCo Agricultural Supplies Ltd")
    } catch (error) {
      setLookupResult({
        found: false,
      })
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
              placeholder="RC123456"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
            />
            <Button onClick={handleLookup} disabled={!registrationNumber || isLookingUp} variant="outline">
              {isLookingUp ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Looking up...
                </>
              ) : (
                "Verify"
              )}
            </Button>
          </div>
        </div>

        {lookupResult && (
          <Alert variant={lookupResult.found ? "default" : "destructive"}>
            <AlertDescription>
              {lookupResult.found ? (
                <div className="flex items-center justify-between">
                  <span>Business found: {lookupResult.name}</span>
                  <Badge className="bg-success text-success-foreground">{lookupResult.status}</Badge>
                </div>
              ) : (
                "Business not found in registry. Please check the registration number."
              )}
            </AlertDescription>
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

      <div className="flex gap-3">
        <Button onClick={onComplete} className="bg-primary hover:bg-primary/90">
          Continue
        </Button>
        <Button onClick={onComplete} variant="outline">
          Skip this step
        </Button>
      </div>
    </div>
  )
}
