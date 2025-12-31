import { httpRequest } from "./httpRequest";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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
  pool?: {
    id: string;
    vendorId: string;
    productId: string;
    priceTotal: number;
    status: string;
    vendor: {
      id: string;
      name: string;
      email: string;
    };
    product?: {
      id: string;
      name: string;
      description: string;
      images: string[];
    };
  };
  raisedBy?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateDisputeDto {
  poolId: string;
  reason: string;
  files?: File[];
}

export interface ResolveDisputeDto {
  disputeId: string;
  action: 'refund' | 'release' | 'split';
  distribution?: Record<string, number>;
  resolutionNotes?: string;
}

export interface AddEvidenceDto {
  files: File[];
  notes?: string;
}

export interface DisputeTimeline {
  event: string;
  timestamp: Date;
  actor: string | null;
  details: {
    reason?: string;
    evidenceCount?: number;
    status?: string;
    notes?: string;
  };
}

export interface DisputeStatistics {
  total: number;
  open: number;
  inReview: number;
  resolved: number;
  rejected: number;
  resolutionRate: number;
}

export interface DisputeMetrics {
  period: {
    start?: Date;
    end?: Date;
  };
  totalDisputes: number;
  resolvedDisputes: number;
  rejectedDisputes: number;
  openDisputes: number;
  resolutionRate: number;
  averageResolutionTimeHours: number;
}

export interface BulkResolveDisputesDto {
  disputeIds: string[];
  action: 'refund' | 'release' | 'reject';
  notes: string;
}

export interface BulkResolveResult {
  total: number;
  successful: number;
  failed: number;
  results: Array<{
    disputeId: string;
    success: boolean;
    error?: string;
  }>;
}

// ============================================================================
// DISPUTES SERVICE
// ============================================================================

class DisputesService {
  /**
   * Create a new dispute
   */
  async createDispute(data: CreateDisputeDto): Promise<{
    message: string;
    dispute: {
      id: string;
      status: string;
      reason: string;
    };
  }> {
    try {
      const formData = new FormData();
      formData.append('poolId', data.poolId);
      formData.append('reason', data.reason);

      if (data.files && data.files.length > 0) {
        data.files.forEach((file) => {
          formData.append('files', file);
        });
      }

      const response = await httpRequest.post<{
        message: string;
        dispute: {
          id: string;
          status: string;
          reason: string;
        };
      }>("/disputes/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response;
    } catch (error: any) {
      console.error("Create dispute failed:", error);
      throw new Error(error.response?.data?.message || "Failed to create dispute");
    }
  }

  /**
   * Get dispute details
   */
  async getDisputeById(disputeId: string): Promise<Dispute> {
    try {
      const response = await httpRequest.get<Dispute>(`/disputes/${disputeId}`);
      return response;
    } catch (error: any) {
      console.error("Get dispute failed:", error);
      throw new Error(error.response?.data?.message || "Failed to get dispute");
    }
  }

  /**
   * Get disputes for a specific pool
   */
  async getDisputesByPool(poolId: string): Promise<Dispute[]> {
    try {
      const response = await httpRequest.get<Dispute[]>(`/disputes/pool/${poolId}`);
      return response;
    } catch (error: any) {
      console.error("Get pool disputes failed:", error);
      throw new Error(error.response?.data?.message || "Failed to get pool disputes");
    }
  }

  /**
   * Get user's disputes
   */
  async getDisputesByUser(userId: string): Promise<Dispute[]> {
    try {
      const response = await httpRequest.get<Dispute[]>(`/disputes/user/${userId}`);
      return response;
    } catch (error: any) {
      console.error("Get user disputes failed:", error);
      throw new Error(error.response?.data?.message || "Failed to get user disputes");
    }
  }

  /**
   * Get disputes for vendor
   */
  async getDisputesByVendor(vendorId: string): Promise<Dispute[]> {
    try {
      const response = await httpRequest.get<Dispute[]>(`/disputes/vendor/${vendorId}`);
      return response;
    } catch (error: any) {
      console.error("Get vendor disputes failed:", error);
      throw new Error(error.response?.data?.message || "Failed to get vendor disputes");
    }
  }

  /**
   * Get user's disputes (authenticated user)
   */
  async getUserDisputes(): Promise<Dispute[]> {
    try {
      const response = await httpRequest.get<Dispute[]>("/user/disputes");
      return response;
    } catch (error: any) {
      console.error("Get user disputes failed:", error);
      throw new Error(error.response?.data?.message || "Failed to get user disputes");
    }
  }

  /**
   * Get pending disputes (admin only)
   */
  async getPendingDisputes(): Promise<Dispute[]> {
    try {
      const response = await httpRequest.get<Dispute[]>("/admin/disputes/pending");
      return response;
    } catch (error: any) {
      console.error("Get pending disputes failed:", error);
      throw new Error(error.response?.data?.message || "Failed to get pending disputes");
    }
  }

  /**
   * Get disputes with pagination
   */
  async getDisputes(params: {
    page?: number;
    limit?: number;
    status?: 'open' | 'in_review' | 'resolved' | 'rejected';
    userId?: string;
    poolId?: string;
    vendorId?: string;
  }): Promise<{
    disputes: Dispute[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const response = await httpRequest.get<{
        disputes: Dispute[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      }>("/disputes", { params });
      return response;
    } catch (error: any) {
      console.error("Get disputes failed:", error);
      throw new Error(error.response?.data?.message || "Failed to get disputes");
    }
  }

  /**
   * Resolve dispute (admin only)
   */
  async resolveDispute(data: ResolveDisputeDto): Promise<{
    message: string;
    action: string;
    disputeId: string;
  }> {
    try {
      const response = await httpRequest.post<{
        message: string;
        action: string;
        disputeId: string;
      }>("/admin/disputes/resolve", data);
      return response;
    } catch (error: any) {
      console.error("Resolve dispute failed:", error);
      throw new Error(error.response?.data?.message || "Failed to resolve dispute");
    }
  }

  /**
   * Update dispute status (admin only)
   */
  async updateDisputeStatus(
    disputeId: string,
    status: 'open' | 'in_review' | 'resolved' | 'rejected',
    notes?: string
  ): Promise<{ message: string; status: string }> {
    try {
      const response = await httpRequest.patch<{
        message: string;
        status: string;
      }>(`/admin/disputes/${disputeId}/status`, { status, notes });
      return response;
    } catch (error: any) {
      console.error("Update dispute status failed:", error);
      throw new Error(error.response?.data?.message || "Failed to update dispute status");
    }
  }

  /**
   * Add evidence to dispute
   */
  async addDisputeEvidence(
    disputeId: string,
    data: AddEvidenceDto
  ): Promise<{
    message: string;
    evidenceCount: number;
  }> {
    try {
      const formData = new FormData();

      if (data.files && data.files.length > 0) {
        data.files.forEach((file) => {
          formData.append('files', file);
        });
      }

      if (data.notes) {
        formData.append('notes', data.notes);
      }

      const response = await httpRequest.post<{
        message: string;
        evidenceCount: number;
      }>(`/disputes/${disputeId}/evidence`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response;
    } catch (error: any) {
      console.error("Add dispute evidence failed:", error);
      throw new Error(error.response?.data?.message || "Failed to add evidence");
    }
  }

  /**
   * Get dispute statistics
   */
  async getDisputeStatistics(poolId?: string): Promise<DisputeStatistics> {
    try {
      const response = await httpRequest.get<DisputeStatistics>(
        poolId ? `/disputes/${poolId}/statistics` : "/disputes/statistics"
      );
      return response;
    } catch (error: any) {
      console.error("Get dispute statistics failed:", error);
      throw new Error(error.response?.data?.message || "Failed to get dispute statistics");
    }
  }

  /**
   * Get dispute metrics
   */
  async getDisputeMetrics(startDate?: Date, endDate?: Date): Promise<DisputeMetrics> {
    try {
      const params: any = {};
      if (startDate) params.startDate = startDate.toISOString();
      if (endDate) params.endDate = endDate.toISOString();

      const response = await httpRequest.get<DisputeMetrics>("/disputes/metrics", {
        params,
      });
      return response;
    } catch (error: any) {
      console.error("Get dispute metrics failed:", error);
      throw new Error(error.response?.data?.message || "Failed to get dispute metrics");
    }
  }

  /**
   * Get dispute timeline
   */
  async getDisputeTimeline(disputeId: string): Promise<{
    disputeId: string;
    currentStatus: string;
    timeline: DisputeTimeline[];
  }> {
    try {
      const response = await httpRequest.get<{
        disputeId: string;
        currentStatus: string;
        timeline: DisputeTimeline[];
      }>(`/disputes/${disputeId}/timeline`);
      return response;
    } catch (error: any) {
      console.error("Get dispute timeline failed:", error);
      throw new Error(error.response?.data?.message || "Failed to get dispute timeline");
    }
  }

  /**
   * Escalate dispute
   */
  async escalateDispute(disputeId: string, escalationNotes: string): Promise<{
    message: string;
    disputeId: string;
  }> {
    try {
      const response = await httpRequest.post<{
        message: string;
        disputeId: string;
      }>(`/disputes/${disputeId}/escalate`, { escalationNotes });
      return response;
    } catch (error: any) {
      console.error("Escalate dispute failed:", error);
      throw new Error(error.response?.data?.message || "Failed to escalate dispute");
    }
  }

  /**
   * Reject dispute (admin only)
   */
  async rejectDispute(
    disputeId: string,
    rejectionReason: string
  ): Promise<{
    message: string;
    disputeId: string;
  }> {
    try {
      const response = await httpRequest.post<{
        message: string;
        disputeId: string;
      }>(`/admin/disputes/${disputeId}/reject`, { rejectionReason });
      return response;
    } catch (error: any) {
      console.error("Reject dispute failed:", error);
      throw new Error(error.response?.data?.message || "Failed to reject dispute");
    }
  }

  /**
   * Bulk resolve disputes (admin only)
   */
  async bulkResolveDisputes(data: BulkResolveDisputesDto): Promise<BulkResolveResult> {
    try {
      const response = await httpRequest.post<BulkResolveResult>(
        "/admin/disputes/bulk-resolve",
        data
      );
      return response;
    } catch (error: any) {
      console.error("Bulk resolve disputes failed:", error);
      throw new Error(error.response?.data?.message || "Failed to bulk resolve disputes");
    }
  }

  /**
   * Get user's dispute history
   */
  async getUserDisputeHistory(): Promise<{
    total: number;
    resolved: number;
    open: number;
    recent: Dispute[];
  }> {
    try {
      const response = await httpRequest.get<{
        total: number;
        resolved: number;
        open: number;
        recent: Dispute[];
      }>("/user/disputes/history");
      return response;
    } catch (error: any) {
      console.error("Get user dispute history failed:", error);
      throw new Error(error.response?.data?.message || "Failed to get dispute history");
    }
  }

  /**
   * Check if user can create dispute for a pool
   */
  async canCreateDispute(poolId: string): Promise<{
    canCreate: boolean;
    reason?: string;
    existingDispute?: Dispute;
  }> {
    try {
      const response = await httpRequest.get<{
        canCreate: boolean;
        reason?: string;
        existingDispute?: Dispute;
      }>(`/disputes/can-create/${poolId}`);
      return response;
    } catch (error: any) {
      console.error("Check dispute eligibility failed:", error);
      throw new Error(error.response?.data?.message || "Failed to check dispute eligibility");
    }
  }

  /**
   * Get dispute resolution options
   */
  async getResolutionOptions(disputeId: string): Promise<{
    canRefund: boolean;
    canRelease: boolean;
    canSplit: boolean;
    suggestedAction: 'refund' | 'release' | 'split';
    maxRefundAmount?: number;
    poolDetails?: any;
  }> {
    try {
      const response = await httpRequest.get<{
        canRefund: boolean;
        canRelease: boolean;
        canSplit: boolean;
        suggestedAction: 'refund' | 'release' | 'split';
        maxRefundAmount?: number;
        poolDetails?: any;
      }>(`/disputes/${disputeId}/resolution-options`);
      return response;
    } catch (error: any) {
      console.error("Get resolution options failed:", error);
      throw new Error(error.response?.data?.message || "Failed to get resolution options");
    }
  }
}

export const disputesService = new DisputesService();