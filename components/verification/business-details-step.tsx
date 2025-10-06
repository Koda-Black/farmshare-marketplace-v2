"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

interface BusinessDetailsStepProps {
  onComplete: () => void
}

export function BusinessDetailsStep({ onComplete }: BusinessDetailsStepProps) {
  const [taxId, setTaxId] = useState("")
  const [businessAddress, setBusinessAddress] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          These details are optional but help buyers trust your business and may be required for tax purposes.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="tax-id">Tax Identification Number (TIN)</Label>
          <Input id="tax-id" placeholder="12345678-0001" value={taxId} onChange={(e) => setTaxId(e.target.value)} />
          <p className="text-xs text-muted-foreground">
            Your TIN may be required for tax reporting on large transactions
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Business Address</Label>
          <Textarea
            id="address"
            placeholder="123 Farm Road, Agricultural District"
            value={businessAddress}
            onChange={(e) => setBusinessAddress(e.target.value)}
            rows={3}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" placeholder="Lagos" value={city} onChange={(e) => setCity(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input id="state" placeholder="Lagos State" value={state} onChange={(e) => setState(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={onComplete} className="bg-primary hover:bg-primary/90">
          Complete Verification
        </Button>
        <Button onClick={onComplete} variant="outline">
          Skip this step
        </Button>
      </div>
    </div>
  )
}
