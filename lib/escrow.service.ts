import { httpRequest } from "./httpRequest";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface Escrow {
  id: string;
  poolId: string;
  totalHeld: number;
  releasedAmount: number;
  withheldAmount: number;
  withheldReason?: string;
  computations: any;
  createdAt: string;
  updatedAt: string;
}

export interface EscrowDetails {
  escrow: Escrow;
  calculations: {
    commission: number;
    netForVendor: number;
    commissionRate: number;
  };
  pool: {
    id: string;
    vendorId: string;
    vendor: {
      id: string;
      name: string;
      email: string;
    };
    product?: {
      id: string;
      name: string;
    };
    subscriptions?: Array<{
      id: string;
      userId: string;
      slots: number;
      user: {
        id: string;
        name: string;
        email: string;
      };
    }>;
  };
}

export interface PaymentInit {
  method: 'STRIPE' | 'PAYSTACK';
  poolId: string;
  slots: number;
  waybillWithin: boolean;
  waybillOutside: boolean;
}

export interface PaymentResponse {
  method: 'STRIPE' | 'PAYSTACK';
  url: string;
  reference?: string;
  pendingId: string;
}

export interface Pool {
  id: string;
  productId: string;
  vendorId: string;
  pricePerSlot: number;
  slotsCount: number;
  slotsFilled: number;
  status: 'OPEN' | 'FILLED' | 'IN_DELIVERY' | 'COMPLETED' | 'CANCELLED';
  filledAt?: string;
  deliveryDeadlineUtc?: string;
  allowHomeDelivery: boolean;
  vendor?: {
    id: string;
    name: string;
    email: string;
  };
  product?: {
    id: string;
    name: string;
    description: string;
    images: string[];
    category: string;
  };
}

export interface Subscription {
  id: string;
  userId: string;
  poolId: string;
  slots: number;
  amountPaid: number;
  deliveryFee: number;
  paymentMethod: 'STRIPE' | 'PAYSTACK';
  paymentRef: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Transaction {
  id: string;
  userId: string;
  poolId: string;
  amount: number;
  fees: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  type: 'PAYMENT' | 'ESCROW_HOLD' | 'ESCROW_RELEASE' | 'REFUND';
  externalTxnId?: string;
  metadata?: any;
  createdAt: string;
}

export interface ReleaseEscrowDto {
  poolId: string;
  reason?: string;
}

export interface PartialReleaseDto {
  poolId: string;
  releaseMap: Record<string, number>;
}

export interface ManualReleaseDto {
  poolId: string;
  amount: number;
  reason: string;
}

export interface ManualRefundDto {
  transactionId: string;
  amount: number;
  reason: string;
}

export interface CreateDisputeDto {
  poolId: string;
  reason: string;
  files?: File[];
}

export interface Dispute {
  id: string;
  poolId: string;
  raisedByUserId: string;
  reason: string;
  status: 'open' | 'in_review' | 'resolved' | 'rejected';
  evidenceFiles: string[];
  complainantCount: number;
  resolutionNotes?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
  pool?: Pool;
  raisedBy?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ResolveDisputeDto {
  disputeId: string;
  action: 'refund' | 'release' | 'split';
  distribution?: Record<string, number>;
  resolutionNotes?: string;
}

// ============================================================================
// ESCROW SERVICE
// ============================================================================

class EscrowService {
  /**
   * Get escrow details for a pool
   */
  async getEscrowDetails(poolId: string): Promise<EscrowDetails> {
    try {
      const response = await httpRequest.get<EscrowDetails>(`/escrow/${poolId}`);
      return response;
    } catch (error: any) {
      console.error("Get escrow details failed:", error);
      throw new Error(error.response?.data?.message || "Failed to get escrow details");
    }
  }

  /**
   * Release escrow (automatic)
   */
  async releaseEscrow(data: ReleaseEscrowDto): Promise<{
    message: string;
    amountReleased: number;
    commission: number;
    transactionId: string;
  }> {
    try {
      const response = await httpRequest.post<{
        message: string;
        amountReleased: number;
        commission: number;
        transactionId: string;
      }>("/escrow/release", data);
      return response;
    } catch (error: any) {
      console.error("Release escrow failed:", error);
      throw new Error(error.response?.data?.message || "Failed to release escrow");
    }
  }

  /**
   * Partial release for disputes
   */
  async partialRelease(data: PartialReleaseDto): Promise<{
    message: string;
    amountReleased: number;
    commission: number;
  }> {
    try {
      const response = await httpRequest.post<{
        message: string;
        amountReleased: number;
        commission: number;
      }>("/escrow/partial-release", data);
      return response;
    } catch (error: any) {
      console.error("Partial release failed:", error);
      throw new Error(error.response?.data?.message || "Failed to perform partial release");
    }
  }

  /**
   * Manual escrow release (admin only)
   */
  async manualRelease(data: ManualReleaseDto): Promise<{
    message: string;
    amount: number;
    reason: string;
  }> {
    try {
      const response = await httpRequest.post<{
        message: string;
        amount: number;
        reason: string;
      }>("/admin/escrow/manual-release", data);
      return response;
    } catch (error: any) {
      console.error("Manual release failed:", error);
      throw new Error(error.response?.data?.message || "Failed to perform manual release");
    }
  }

  /**
   * Manual refund (admin only)
   */
  async manualRefund(data: ManualRefundDto): Promise<{
    message: string;
    amount: number;
    transactionId: string;
  }> {
    try {
      const response = await httpRequest.post<{
        message: string;
        amount: number;
        transactionId: string;
      }>("/admin/escrow/manual-refund", data);
      return response;
    } catch (error: any) {
      console.error("Manual refund failed:", error);
      throw new Error(error.response?.data?.message || "Failed to process manual refund");
    }
  }

  /**
   * Get user's subscriptions
   */
  async getUserSubscriptions(): Promise<Subscription[]> {
    try {
      const response = await httpRequest.get<Subscription[]>("/user/subscriptions");
      return response;
    } catch (error: any) {
      console.error("Get user subscriptions failed:", error);
      throw new Error(error.response?.data?.message || "Failed to get subscriptions");
    }
  }

  /**
   * Get user's transactions
   */
  async getUserTransactions(): Promise<Transaction[]> {
    try {
      const response = await httpRequest.get<Transaction[]>("/user/transactions");
      return response;
    } catch (error: any) {
      console.error("Get user transactions failed:", error);
      throw new Error(error.response?.data?.message || "Failed to get transactions");
    }
  }

  /**
   * Get available pools
   */
  async getAvailablePools(params?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    location?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    pools: Pool[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const response = await httpRequest.get<{
        pools: Pool[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      }>("/pools", { params });
      return response;
    } catch (error: any) {
      console.error("Get available pools failed:", error);
      throw new Error(error.response?.data?.message || "Failed to get available pools");
    }
  }

  /**
   * Get pool details
   */
  async getPoolDetails(poolId: string): Promise<Pool> {
    try {
      const response = await httpRequest.get<Pool>(`/pools/${poolId}`);
      return response;
    } catch (error: any) {
      console.error("Get pool details failed:", error);
      throw new Error(error.response?.data?.message || "Failed to get pool details");
    }
  }

  /**
   * Get user's active pools
   */
  async getUserPools(): Promise<Pool[]> {
    try {
      const response = await httpRequest.get<Pool[]>("/user/pools");
      return response;
    } catch (error: any) {
      console.error("Get user pools failed:", error);
      throw new Error(error.response?.data?.message || "Failed to get user pools");
    }
  }

  /**
   * Create a new pool (vendor only)
   */
  async createPool(data: {
    productId: string;
    pricePerSlot: number;
    slotsCount: number;
    allowHomeDelivery: boolean;
    deliveryDeadlineUtc: string;
  }): Promise<Pool> {
    try {
      const response = await httpRequest.post<Pool>("/pools", data);
      return response;
    } catch (error: any) {
      console.error("Create pool failed:", error);
      throw new Error(error.response?.data?.message || "Failed to create pool");
    }
  }

  /**
   * Update pool (vendor only)
   */
  async updatePool(poolId: string, data: Partial<Pool>): Promise<Pool> {
    try {
      const response = await httpRequest.patch<Pool>(`/pools/${poolId}`, data);
      return response;
    } catch (error: any) {
      console.error("Update pool failed:", error);
      throw new Error(error.response?.data?.message || "Failed to update pool");
    }
  }

  /**
   * Cancel pool (vendor only)
   */
  async cancelPool(poolId: string, reason: string): Promise<{ message: string }> {
    try {
      const response = await httpRequest.post<{ message: string }>(
        `/pools/${poolId}/cancel`,
        { reason }
      );
      return response;
    } catch (error: any) {
      console.error("Cancel pool failed:", error);
      throw new Error(error.response?.data?.message || "Failed to cancel pool");
    }
  }

  /**
   * Get user's escrow history
   */
  async getUserEscrowHistory(): Promise<EscrowDetails[]> {
    try {
      const response = await httpRequest.get<EscrowDetails[]>("/user/escrow-history");
      return response;
    } catch (error: any) {
      console.error("Get user escrow history failed:", error);
      throw new Error(error.response?.data?.message || "Failed to get escrow history");
    }
  }

  /**
   * Get pool escrow status
   */
  async getPoolEscrowStatus(poolId: string): Promise<{
    status: 'pending' | 'active' | 'released' | 'partial';
    totalHeld: number;
    releasedAmount: number;
    withheldAmount: number;
    canRelease: boolean;
    releaseDate?: string;
  }> {
    try {
      const response = await httpRequest.get<{
        status: 'pending' | 'active' | 'released' | 'partial';
        totalHeld: number;
        releasedAmount: number;
        withheldAmount: number;
        canRelease: boolean;
        releaseDate?: string;
      }>(`/escrow/${poolId}/status`);
      return response;
    } catch (error: any) {
      console.error("Get pool escrow status failed:", error);
      throw new Error(error.response?.data?.message || "Failed to get escrow status");
    }
  }
}

export const escrowService = new EscrowService();