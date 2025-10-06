"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"

interface BankAccountStepProps {
  onComplete: () => void
}

export function BankAccountStep({ onComplete }: BankAccountStepProps) {
  const [bankCode, setBankCode] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [accountName, setAccountName] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "success" | "error">("idle")

  const handleVerifyAccount = async () => {
    if (!bankCode || !accountNumber) return

    setIsVerifying(true)
    try {
      // TODO: Replace with actual Paystack account verification API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock verification result
      setAccountName("John Doe Farms")
      setVerificationStatus("success")
    } catch (error) {
      setVerificationStatus("error")
    } finally {
      setIsVerifying(false)
    }
  }

  const isVerified = verificationStatus === "success"

  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Your bank account must be verified to receive payments. We use Paystack for secure payment processing.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="bank">Bank</Label>
          <Select value={bankCode} onValueChange={setBankCode}>
            <SelectTrigger id="bank">
              <SelectValue placeholder="Select your bank" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="044">Access Bank</SelectItem>
              <SelectItem value="063">Diamond Bank</SelectItem>
              <SelectItem value="050">Ecobank</SelectItem>
              <SelectItem value="070">Fidelity Bank</SelectItem>
              <SelectItem value="011">First Bank</SelectItem>
              <SelectItem value="214">First City Monument Bank</SelectItem>
              <SelectItem value="058">Guaranty Trust Bank</SelectItem>
              <SelectItem value="030">Heritage Bank</SelectItem>
              <SelectItem value="301">Jaiz Bank</SelectItem>
              <SelectItem value="082">Keystone Bank</SelectItem>
              <SelectItem value="526">Parallex Bank</SelectItem>
              <SelectItem value="076">Polaris Bank</SelectItem>
              <SelectItem value="101">Providus Bank</SelectItem>
              <SelectItem value="221">Stanbic IBTC Bank</SelectItem>
              <SelectItem value="068">Standard Chartered Bank</SelectItem>
              <SelectItem value="232">Sterling Bank</SelectItem>
              <SelectItem value="100">Suntrust Bank</SelectItem>
              <SelectItem value="032">Union Bank</SelectItem>
              <SelectItem value="033">United Bank for Africa</SelectItem>
              <SelectItem value="215">Unity Bank</SelectItem>
              <SelectItem value="035">Wema Bank</SelectItem>
              <SelectItem value="057">Zenith Bank</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="account-number">Account Number</Label>
          <div className="flex gap-2">
            <Input
              id="account-number"
              placeholder="0123456789"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              maxLength={10}
            />
            <Button
              onClick={handleVerifyAccount}
              disabled={!bankCode || accountNumber.length !== 10 || isVerifying}
              variant="outline"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify"
              )}
            </Button>
          </div>
        </div>

        {accountName && verificationStatus === "success" && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>Account Name: {accountName}</span>
              <Badge className="bg-success text-success-foreground">Verified</Badge>
            </AlertDescription>
          </Alert>
        )}

        {verificationStatus === "error" && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Could not verify account. Please check your details and try again.</AlertDescription>
          </Alert>
        )}
      </div>

      <Button
        onClick={onComplete}
        disabled={!isVerified}
        className="bg-success hover:bg-success/90 text-success-foreground"
      >
        <CheckCircle className="mr-2 h-4 w-4" />
        Continue to Next Step
      </Button>
    </div>
  )
}
