"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  Search,
  Building2,
  CreditCard,
  ShieldCheck,
  ChevronDown,
  X,
} from "lucide-react";
import { verificationService, type Bank } from "@/lib/verification.service";

interface BankAccountStepProps {
  onComplete: () => void;
}

// Hardcoded banks as fallback (loaded immediately for fast UX)
const FALLBACK_BANKS: Bank[] = [
  {
    id: 1,
    code: "044",
    name: "Access Bank",
    slug: "access-bank",
    longcode: "044150149",
    gateway: "emandate",
    active: true,
  },
  {
    id: 2,
    code: "023",
    name: "Citibank Nigeria",
    slug: "citibank-nigeria",
    longcode: "",
    gateway: null,
    active: true,
  },
  {
    id: 3,
    code: "050",
    name: "Ecobank Nigeria",
    slug: "ecobank-nigeria",
    longcode: "050150010",
    gateway: "emandate",
    active: true,
  },
  {
    id: 4,
    code: "070",
    name: "Fidelity Bank",
    slug: "fidelity-bank",
    longcode: "070150003",
    gateway: "emandate",
    active: true,
  },
  {
    id: 5,
    code: "011",
    name: "First Bank of Nigeria",
    slug: "first-bank-of-nigeria",
    longcode: "011150929",
    gateway: "emandate",
    active: true,
  },
  {
    id: 6,
    code: "214",
    name: "First City Monument Bank",
    slug: "first-city-monument-bank",
    longcode: "214150018",
    gateway: "emandate",
    active: true,
  },
  {
    id: 7,
    code: "058",
    name: "Guaranty Trust Bank",
    slug: "guaranty-trust-bank",
    longcode: "058152052",
    gateway: "emandate",
    active: true,
  },
  {
    id: 8,
    code: "030",
    name: "Heritage Bank",
    slug: "heritage-bank",
    longcode: "030159992",
    gateway: "emandate",
    active: true,
  },
  {
    id: 9,
    code: "301",
    name: "Jaiz Bank",
    slug: "jaiz-bank",
    longcode: "",
    gateway: null,
    active: true,
  },
  {
    id: 10,
    code: "082",
    name: "Keystone Bank",
    slug: "keystone-bank",
    longcode: "082150017",
    gateway: "emandate",
    active: true,
  },
  {
    id: 11,
    code: "101",
    name: "Providus Bank",
    slug: "providus-bank",
    longcode: "",
    gateway: null,
    active: true,
  },
  {
    id: 12,
    code: "076",
    name: "Polaris Bank",
    slug: "polaris-bank",
    longcode: "",
    gateway: null,
    active: true,
  },
  {
    id: 13,
    code: "221",
    name: "Stanbic IBTC Bank",
    slug: "stanbic-ibtc-bank",
    longcode: "221150018",
    gateway: "emandate",
    active: true,
  },
  {
    id: 14,
    code: "068",
    name: "Standard Chartered Bank",
    slug: "standard-chartered-bank",
    longcode: "068150015",
    gateway: "emandate",
    active: true,
  },
  {
    id: 15,
    code: "232",
    name: "Sterling Bank",
    slug: "sterling-bank",
    longcode: "232150016",
    gateway: "emandate",
    active: true,
  },
  {
    id: 16,
    code: "100",
    name: "Suntrust Bank",
    slug: "suntrust-bank",
    longcode: "",
    gateway: null,
    active: true,
  },
  {
    id: 17,
    code: "032",
    name: "Union Bank of Nigeria",
    slug: "union-bank-of-nigeria",
    longcode: "032150006",
    gateway: "emandate",
    active: true,
  },
  {
    id: 18,
    code: "033",
    name: "United Bank For Africa",
    slug: "united-bank-for-africa",
    longcode: "033153513",
    gateway: "emandate",
    active: true,
  },
  {
    id: 19,
    code: "215",
    name: "Unity Bank",
    slug: "unity-bank",
    longcode: "215082334",
    gateway: "emandate",
    active: true,
  },
  {
    id: 20,
    code: "035",
    name: "Wema Bank",
    slug: "wema-bank",
    longcode: "035150103",
    gateway: "emandate",
    active: true,
  },
  {
    id: 21,
    code: "057",
    name: "Zenith Bank",
    slug: "zenith-bank",
    longcode: "057150013",
    gateway: "emandate",
    active: true,
  },
  {
    id: 22,
    code: "999992",
    name: "Opay",
    slug: "opay",
    longcode: "",
    gateway: null,
    active: true,
  },
  {
    id: 23,
    code: "999991",
    name: "PalmPay",
    slug: "palmpay",
    longcode: "",
    gateway: null,
    active: true,
  },
  {
    id: 24,
    code: "999993",
    name: "Moniepoint MFB",
    slug: "moniepoint",
    longcode: "",
    gateway: null,
    active: true,
  },
  {
    id: 25,
    code: "090267",
    name: "Kuda Bank",
    slug: "kuda-bank",
    longcode: "",
    gateway: null,
    active: true,
  },
];

export function BankAccountStep({ onComplete }: BankAccountStepProps) {
  const [banks, setBanks] = useState<Bank[]>(FALLBACK_BANKS);
  const [isLoadingBanks, setIsLoadingBanks] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch banks from Paystack in background (to get complete list)
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        setIsLoadingBanks(true);
        const banksData = await verificationService.getSupportedBanks();

        if (banksData && banksData.length > 0) {
          // Remove duplicates by bank code
          const uniqueBanks = banksData.reduce((acc: Bank[], current: Bank) => {
            const exists = acc.find((bank) => bank.code === current.code);
            if (!exists && current.active) {
              acc.push(current);
            }
            return acc;
          }, []);

          // Sort alphabetically
          uniqueBanks.sort((a, b) => a.name.localeCompare(b.name));
          setBanks(uniqueBanks);
        }
      } catch (error) {
        console.error("Failed to fetch banks:", error);
        // Keep using fallback banks
      } finally {
        setIsLoadingBanks(false);
      }
    };

    fetchBanks();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter banks based on search query
  const filteredBanks = useMemo(() => {
    if (!searchQuery.trim()) return banks;

    const query = searchQuery.toLowerCase();
    return banks.filter(
      (bank) =>
        bank.name.toLowerCase().includes(query) || bank.code.includes(query)
    );
  }, [banks, searchQuery]);

  const handleSelectBank = (bank: Bank) => {
    setSelectedBank(bank);
    setSearchQuery(bank.name);
    setIsDropdownOpen(false);
    // Reset verification when bank changes
    if (verificationStatus !== "idle") {
      setVerificationStatus("idle");
      setAccountName("");
    }
  };

  const handleClearSelection = () => {
    setSelectedBank(null);
    setSearchQuery("");
    setVerificationStatus("idle");
    setAccountName("");
    inputRef.current?.focus();
  };

  const handleVerifyAccount = async () => {
    if (!selectedBank || !accountNumber) return;

    setIsVerifying(true);
    setVerificationStatus("idle");
    setErrorMessage("");

    try {
      const result = await verificationService.verifyBankAccount(
        accountNumber,
        selectedBank.code
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

  return (
    <div className="space-y-6">
      {/* Bank Selection with Search */}
      <div className="space-y-2">
        <Label
          htmlFor="bank-search"
          className="flex items-center gap-2 text-base font-medium"
        >
          <Building2 className="h-4 w-4 text-primary" />
          Select Your Bank
        </Label>
        <div ref={dropdownRef} className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              id="bank-search"
              placeholder="Type to search for your bank..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsDropdownOpen(true);
                if (selectedBank && e.target.value !== selectedBank.name) {
                  setSelectedBank(null);
                }
              }}
              onFocus={() => setIsDropdownOpen(true)}
              className="pl-10 pr-10 h-12 text-base"
            />
            {selectedBank ? (
              <button
                onClick={handleClearSelection}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            ) : (
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            )}
          </div>

          {/* Dropdown */}
          {isDropdownOpen && (
            <Card className="absolute z-50 w-full mt-1 max-h-64 overflow-y-auto shadow-lg border">
              {isLoadingBanks && filteredBanks.length === 0 ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
                  <span className="text-sm text-muted-foreground">
                    Loading banks...
                  </span>
                </div>
              ) : filteredBanks.length === 0 ? (
                <div className="py-4 text-center text-sm text-muted-foreground">
                  No banks found matching &quot;{searchQuery}&quot;
                </div>
              ) : (
                <div className="py-1">
                  {filteredBanks.map((bank) => (
                    <button
                      key={bank.code}
                      onClick={() => handleSelectBank(bank)}
                      className={`w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors flex items-center gap-3 ${
                        selectedBank?.code === bank.code ? "bg-primary/10" : ""
                      }`}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        <Building2 className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{bank.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Code: {bank.code}
                        </p>
                      </div>
                      {selectedBank?.code === bank.code && (
                        <CheckCircle className="ml-auto h-4 w-4 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </Card>
          )}
        </div>
        {selectedBank && (
          <div className="flex items-center gap-2 text-sm text-primary">
            <CheckCircle className="h-4 w-4" />
            <span>Selected: {selectedBank.name}</span>
          </div>
        )}
      </div>

      {/* Account Number Input */}
      <div className="space-y-2">
        <Label
          htmlFor="account-number"
          className="flex items-center gap-2 text-base font-medium"
        >
          <CreditCard className="h-4 w-4 text-primary" />
          Account Number
        </Label>
        <div className="flex gap-3">
          <Input
            id="account-number"
            placeholder="Enter 10-digit account number"
            value={accountNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              setAccountNumber(value);
              if (verificationStatus !== "idle") {
                setVerificationStatus("idle");
                setAccountName("");
              }
            }}
            maxLength={10}
            className="h-12 text-base font-mono tracking-wider"
          />
          <Button
            onClick={handleVerifyAccount}
            disabled={
              !selectedBank || accountNumber.length !== 10 || isVerifying
            }
            className="h-12 px-6 bg-primary hover:bg-primary/90"
          >
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <ShieldCheck className="mr-2 h-4 w-4" />
                Verify
              </>
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Enter your 10-digit NUBAN account number
        </p>
      </div>

      {/* Verification Success */}
      {accountName && verificationStatus === "success" && (
        <Alert className="border-success bg-success/10">
          <CheckCircle className="h-5 w-5 text-success" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-success">Account Verified!</p>
                <p className="text-sm mt-1">{accountName}</p>
              </div>
              <Badge className="bg-success text-success-foreground">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Verification Error */}
      {verificationStatus === "error" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* Info Box */}
      <Card className="p-4 bg-muted/30 border-dashed">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="text-sm font-medium mb-1">Why do we need this?</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Receive payments directly to your bank account</li>
              <li>• Fast and secure payouts via Paystack</li>
              <li>• Required for vendor verification</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Continue Button */}
      <Button
        onClick={onComplete}
        disabled={!isVerified}
        className="w-full h-12 bg-success hover:bg-success/90 text-success-foreground disabled:opacity-50"
        size="lg"
      >
        <CheckCircle className="mr-2 h-5 w-5" />
        {isVerified ? "Continue to Next Step" : "Verify Account First"}
      </Button>
    </div>
  );
}
