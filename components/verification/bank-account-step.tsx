"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { verificationService, type Bank } from "@/lib/verification.service";

interface BankAccountStepProps {
  onComplete: () => void;
}

export function BankAccountStep({ onComplete }: BankAccountStepProps) {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [isLoadingBanks, setIsLoadingBanks] = useState(true);
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch banks from Paystack on component mount
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const banksData = await verificationService.getSupportedBanks();

        // Remove duplicates by bank code
        const uniqueBanks = banksData.reduce((acc: Bank[], current: Bank) => {
          const exists = acc.find((bank) => bank.code === current.code);
          if (!exists) {
            acc.push(current);
          }
          return acc;
        }, []);

        setBanks(banksData.filter((bank) => bank.active));
      } catch (error) {
        console.error("Failed to fetch banks:", error);
        // Fall back to hardcoded banks if API fails
        setBanks([]);
      } finally {
        setIsLoadingBanks(false);
      }
    };

    fetchBanks();
  }, []);

  const handleVerifyAccount = async () => {
    if (!bankCode || !accountNumber) return;

    setIsVerifying(true);
    setVerificationStatus("idle");
    setErrorMessage("");

    try {
      const result = await verificationService.verifyBankAccount(
        accountNumber,
        bankCode
      );

      if (result.success && result.accountName) {
        setAccountName(result.accountName);
        setVerificationStatus("success");
      } else {
        setVerificationStatus("error");
        setErrorMessage(
          result.message ||
            "Could not verify account. Please check your details."
        );
      }
    } catch (error: any) {
      setVerificationStatus("error");
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const isVerified = verificationStatus === "success";

  // Hardcoded banks as fallback
  const fallbackBanks = [
    { code: "044", name: "Access Bank" },
    { code: "063", name: "Diamond Bank" },
    { code: "050", name: "Ecobank" },
    { code: "070", name: "Fidelity Bank" },
    { code: "011", name: "First Bank" },
    { code: "214", name: "First City Monument Bank" },
    { code: "058", name: "Guaranty Trust Bank" },
    { code: "030", name: "Heritage Bank" },
    { code: "301", name: "Jaiz Bank" },
    { code: "082", name: "Keystone Bank" },
    { code: "076", name: "Polaris Bank" },
    { code: "101", name: "Providus Bank" },
    { code: "221", name: "Stanbic IBTC Bank" },
    { code: "068", name: "Standard Chartered Bank" },
    { code: "232", name: "Sterling Bank" },
    { code: "100", name: "Suntrust Bank" },
    { code: "032", name: "Union Bank" },
    { code: "033", name: "United Bank for Africa" },
    { code: "215", name: "Unity Bank" },
    { code: "035", name: "Wema Bank" },
    { code: "057", name: "Zenith Bank" },
  ];

  const banksToDisplay = banks.length > 0 ? banks : fallbackBanks;

  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Your bank account must be verified to receive payments. We use
          Paystack for secure account verification.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="bank">Bank</Label>
          <Select
            value={bankCode}
            onValueChange={setBankCode}
            disabled={isLoadingBanks}
          >
            <SelectTrigger id="bank">
              <SelectValue
                placeholder={
                  isLoadingBanks ? "Loading banks..." : "Select your bank"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {banksToDisplay.map((bank: any, index) => (
                <SelectItem key={`${bank.code}-${index}`} value={bank.code}>
                  {bank.name}
                </SelectItem>
              ))}
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
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setAccountNumber(value);
                // Reset verification when user changes input
                if (verificationStatus !== "idle") {
                  setVerificationStatus("idle");
                  setAccountName("");
                }
              }}
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
          <p className="text-xs text-muted-foreground">
            Enter your 10-digit account number
          </p>
        </div>

        {accountName && verificationStatus === "success" && (
          <Alert className="border-success bg-success/10">
            <CheckCircle className="h-4 w-4 text-success" />
            <AlertDescription className="flex items-center justify-between">
              <div>
                <p className="font-medium">Account Verified!</p>
                <p className="text-sm text-muted-foreground">{accountName}</p>
              </div>
              <Badge className="bg-success text-success-foreground">
                Verified
              </Badge>
            </AlertDescription>
          </Alert>
        )}

        {verificationStatus === "error" && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
      </div>

      <div className="rounded-lg border bg-muted/30 p-4">
        <h4 className="text-sm font-medium mb-2">Why do we need this?</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Receive payments directly to your bank account</li>
          <li>• Fast and secure payouts via Paystack</li>
          <li>• Required for vendor verification</li>
        </ul>
      </div>

      <Button
        onClick={onComplete}
        disabled={!isVerified}
        className="w-full bg-success hover:bg-success/90 text-success-foreground disabled:opacity-50"
      >
        <CheckCircle className="mr-2 h-4 w-4" />
        {isVerified ? "Continue to Next Step" : "Verify Account First"}
      </Button>
    </div>
  );
}
