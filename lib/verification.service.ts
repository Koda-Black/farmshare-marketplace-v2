import { httpRequest } from "./httpRequest";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface Bank {
  id: number;
  name: string;
  slug: string;
  code: string;
  longcode: string;
  gateway: string;
  active: boolean;
}

export interface BankVerificationResult {
  success: boolean;
  accountName?: string;
  accountNumber?: string;
  bankCode?: string;
  message?: string;
  error?: string;
}

export interface FaceVerificationResult {
  success: boolean;
  confidence?: number;
  facesDetected?: number;
  message?: string;
  error?: string;
}

export interface DocumentOcrResult {
  success: boolean;
  fullName?: string;
  documentNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  issuedDate?: string;
  expiryDate?: string;
  documentType?:
    | "NIN"
    | "PASSPORT"
    | "DRIVERS_LICENSE"
    | "VOTER_CARD"
    | "UNKNOWN";
  rawText?: string;
  confidence?: number;
  message?: string;
  error?: string;
}

export interface CacVerificationResult {
  success: boolean;
  companyName?: string;
  registrationNumber?: string;
  registrationDate?: string;
  businessType?: string;
  status?: string;
  address?: string;
  city?: string;
  state?: string;
  message?: string;
  error?: string;
}

export interface VerificationStatus {
  overallStatus: "NONE" | "PENDING" | "VERIFIED" | "REJECTED" | "EXPIRED";
  ninVerified: boolean;
  bankVerified: boolean;
  verifications: Array<{
    id: string;
    step: string;
    status: string;
    createdAt: string;
    expiresAt?: string;
  }>;
}

// ============================================================================
// VERIFICATION SERVICE
// ============================================================================

class VerificationService {
  /**
   * Get list of supported Nigerian banks from Paystack
   */
  async getSupportedBanks(): Promise<Bank[]> {
    try {
      const response = await httpRequest.get<Bank[]>(
        httpRequest.endpoints.verification.banks
      );
      return response;
    } catch (error: any) {
      console.error("Failed to fetch banks:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch banks");
    }
  }

  /**
   * Verify Nigerian bank account
   */
  async verifyBankAccount(
    accountNumber: string,
    bankCode: string
  ): Promise<BankVerificationResult> {
    try {
      const response = await httpRequest.post<BankVerificationResult>(
        httpRequest.endpoints.verification.bank,
        { accountNumber, bankCode }
      );
      return response;
    } catch (error: any) {
      console.error("Bank verification failed:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Bank verification failed",
        message: "Could not verify bank account. Please check your details.",
      };
    }
  }

  /**
   * Verify face match between selfie and ID document
   */
  async verifyFace(
    selfieImage: string,
    idCardImage: string,
    confidenceThreshold: number = 70
  ): Promise<FaceVerificationResult> {
    try {
      const response = await httpRequest.post<FaceVerificationResult>(
        httpRequest.endpoints.verification.face,
        { selfieImage, idCardImage, confidenceThreshold }
      );
      return response;
    } catch (error: any) {
      console.error("Face verification failed:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Face verification failed",
        message: "Could not verify face match. Please try again.",
      };
    }
  }

  /**
   * Extract data from government ID document using OCR
   */
  async extractDocumentData(file: File): Promise<DocumentOcrResult> {
    try {
      const formData = new FormData();
      formData.append("document", file);

      const response = await httpRequest.post<DocumentOcrResult>(
        httpRequest.endpoints.verification.documentOcr,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response;
    } catch (error: any) {
      console.error("Document OCR failed:", error);
      return {
        success: false,
        error: error.response?.data?.message || "OCR extraction failed",
        message: "Could not read document. Please upload a clearer image.",
      };
    }
  }

  /**
   * Verify Nigerian business registration (CAC)
   */
  async verifyBusinessRegistration(
    registrationNumber: string,
    companyName?: string
  ): Promise<CacVerificationResult> {
    try {
      const response = await httpRequest.post<CacVerificationResult>(
        httpRequest.endpoints.verification.cac,
        { registrationNumber, companyName }
      );
      return response;
    } catch (error: any) {
      console.error("CAC verification failed:", error);
      return {
        success: false,
        error: error.response?.data?.message || "CAC verification failed",
        message: "Could not verify business registration.",
      };
    }
  }

  /**
   * Get current user's verification status
   */
  async getVerificationStatus(): Promise<VerificationStatus> {
    try {
      const response = await httpRequest.get<VerificationStatus>(
        httpRequest.endpoints.verification.status
      );
      return response;
    } catch (error: any) {
      console.error("Failed to get verification status:", error);
      throw new Error(
        error.response?.data?.message || "Failed to get verification status"
      );
    }
  }

  /**
   * Start verification process
   */
  async startVerification(steps: string[]): Promise<any> {
    try {
      const response = await httpRequest.post(
        httpRequest.endpoints.verification.start,
        { steps }
      );
      return response;
    } catch (error: any) {
      console.error("Failed to start verification:", error);
      throw new Error(
        error.response?.data?.message || "Failed to start verification"
      );
    }
  }

  /**
   * Submit verification documents
   */
  async submitVerification(
    verificationId: string,
    files: File[],
    metadata: Record<string, any>
  ): Promise<any> {
    try {
      const formData = new FormData();
      formData.append("verificationId", verificationId);
      formData.append("metadata", JSON.stringify(metadata));
      files.forEach((file) => formData.append("files", file));

      const response = await httpRequest.post(
        httpRequest.endpoints.verification.submit,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response;
    } catch (error: any) {
      console.error("Failed to submit verification:", error);
      throw new Error(
        error.response?.data?.message || "Failed to submit verification"
      );
    }
  }

  /**
   * Health check for all verification services
   */
  async healthCheck(): Promise<{
    success: boolean;
    services: Record<string, { status: string }>;
  }> {
    try {
      const response = await httpRequest.get(
        httpRequest.endpoints.verification.health
      );
      return response;
    } catch (error: any) {
      console.error("Health check failed:", error);
      return {
        success: false,
        services: {
          paystack: { status: "unavailable" },
          faceVerification: { status: "unavailable" },
          cacVerification: { status: "unavailable" },
          documentOcr: { status: "unavailable" },
        },
      };
    }
  }
}

export const verificationService = new VerificationService();
