import { httpRequest } from "./httpRequest";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface AdminLoginResponse {
  requiresMfa: boolean;
  accessToken?: string;
  refreshToken?: string;
  admin?: Admin;
  message?: string;
}

export interface Admin {
  id: string;
  email: string;
  name: string;
  role: string;
  isAdmin: boolean;
  mfaEnabled: boolean;
  createdAt: string;
}

export interface AdminSignupDto {
  email: string;
  name: string;
  password: string;
  adminSecretKey: string;
}

export interface AdminLoginDto {
  email: string;
  password: string;
}

export interface AdminMfaDto {
  email: string;
  token: string;
}

export interface SearchUsersDto {
  search?: string;
  role?: "buyer" | "vendor" | "admin";
  isVerified?: boolean;
  page?: number;
  limit?: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  isVerified: boolean;
  verificationStatus: string;
  isAdmin: boolean;
  createdAt: string;
  lastActive?: string;
}

export interface PaginatedUsers {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BanUserDto {
  userId: string;
  reason: string;
}

export interface UnbanUserDto {
  userId: string;
}

export interface VerificationStep {
  id: string;
  step: string;
  status: string;
  details: any;
  externalReference?: string;
  createdAt: string;
  expiresAt?: string;
}

export interface VerificationDocuments {
  govtId: {
    type: string | null;
    number: string | null;
    files: string[];
  };
  business: {
    registrationNumber: string | null;
  };
  tax: {
    taxId: string | null;
  };
  bank: {
    accountId: string | null;
    bankCode: string | null;
    bankName: string | null;
    accountName: string | null;
    verified: boolean;
  };
}

export interface Verification {
  id: string;
  userId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  steps: VerificationStep[];
  documents: VerificationDocuments;
  user: {
    id: string;
    email: string;
    name: string;
    phone?: string;
    role: string;
    verificationStatus: string;
    avatarUrl?: string;
  };
}

export interface PaginatedVerifications {
  verifications: Verification[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApproveVerificationDto {
  verificationId: string;
  notes?: string;
}

export interface RejectVerificationDto {
  verificationId: string;
  reason: string;
  feedback?: string;
}

export interface Dispute {
  id: string;
  poolId: string;
  reason: string;
  status: "open" | "in_review" | "resolved" | "rejected";
  evidenceFiles: string[];
  complainantCount: number;
  resolutionNotes?: string;
  resolvedAt?: string;
  createdAt: string;
  pool: {
    id: string;
    vendorId: string;
    productId: string;
    priceTotal: number;
    status: string;
    vendor: {
      id: string;
      email: string;
      name: string;
    };
    product?: any;
  };
  raisedBy: {
    id: string;
    email: string;
    name: string;
  };
}

export interface PaginatedDisputes {
  disputes: Dispute[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ResolveDisputeDto {
  disputeId: string;
  action: "refund" | "release" | "split";
  distribution?: Record<string, number>;
  resolutionNotes?: string;
}

export interface EscrowDetails {
  escrow: {
    id: string;
    poolId: string;
    totalHeld: number;
    releasedAmount: number;
    withheldAmount: number;
    withheldReason?: string;
    computations: any;
  };
  calculations: {
    commission: number;
    netForVendor: number;
    commissionRate: number;
  };
  pool: {
    id: string;
    vendor: {
      id: string;
      name: string;
      email: string;
    };
  };
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

export interface AdminAuditLog {
  id: string;
  adminId: string;
  action: string;
  targetType: string;
  targetId: string;
  details: any;
  createdAt: string;
}

export interface AdminDashboard {
  users: {
    total: number;
    vendors: number;
    buyers: number;
    banned: number;
    probation: number;
    newThisWeek: number;
  };
  verifications: {
    pending: number;
    completed: number;
    newThisWeek: number;
  };
  disputes: {
    active: number;
    newThisWeek: number;
  };
  pools: {
    total: number;
    active: number;
    completed: number;
    completedThisWeek: number;
  };
  escrow: {
    totalHeld: number;
    totalReleased: number;
  };
  metrics: {
    verificationCompletionRate: number;
    disputeRate: number;
    userGrowthRate: number;
  };
  recentActivity?: AdminAuditLog[];
}

// ============================================================================
// ADMIN SERVICE
// ============================================================================

class AdminService {
  /**
   * Admin signup with secret key
   */
  async adminSignup(
    data: AdminSignupDto
  ): Promise<{ message: string; admin: Admin }> {
    try {
      const response = await httpRequest.post<{
        message: string;
        admin: Admin;
      }>("/admin/signup", data);
      return response;
    } catch (error: any) {
      console.error("Admin signup failed:", error);
      throw new Error(error.response?.data?.message || "Admin signup failed");
    }
  }

  /**
   * Admin login
   */
  async adminLogin(data: AdminLoginDto): Promise<AdminLoginResponse> {
    try {
      const response = await httpRequest.post<AdminLoginResponse>(
        "/admin/login",
        data
      );
      return response;
    } catch (error: any) {
      console.error("Admin login failed:", error);
      throw new Error(error.response?.data?.message || "Admin login failed");
    }
  }

  /**
   * Verify MFA during login
   */
  async verifyMfaLogin(data: AdminMfaDto): Promise<AdminLoginResponse> {
    try {
      const response = await httpRequest.post<AdminLoginResponse>(
        "/admin/login/mfa",
        data
      );
      return response;
    } catch (error: any) {
      console.error("MFA verification failed:", error);
      throw new Error(
        error.response?.data?.message || "MFA verification failed"
      );
    }
  }

  /**
   * Enable MFA for admin account
   */
  async enableMfa(): Promise<{
    secret: string;
    qrCode: string;
    message: string;
  }> {
    try {
      const response = await httpRequest.post("/admin/mfa/enable");
      return response;
    } catch (error: any) {
      console.error("Enable MFA failed:", error);
      throw new Error(error.response?.data?.message || "Failed to enable MFA");
    }
  }

  /**
   * Confirm MFA setup
   */
  async confirmEnableMfa(token: string): Promise<{ message: string }> {
    try {
      const response = await httpRequest.post("/admin/mfa/confirm", { token });
      return response;
    } catch (error: any) {
      console.error("Confirm MFA failed:", error);
      throw new Error(error.response?.data?.message || "Failed to confirm MFA");
    }
  }

  /**
   * Disable MFA
   */
  async disableMfa(token: string): Promise<{ message: string }> {
    try {
      const response = await httpRequest.post("/admin/mfa/disable", { token });
      return response;
    } catch (error: any) {
      console.error("Disable MFA failed:", error);
      throw new Error(error.response?.data?.message || "Failed to disable MFA");
    }
  }

  /**
   * Admin logout - clear admin token
   */
  adminLogout(): void {
    httpRequest.clearAdminToken();
  }

  // ==================== USER MANAGEMENT ====================

  /**
   * Search and list users
   */
  async searchUsers(params: SearchUsersDto): Promise<PaginatedUsers> {
    try {
      const response = await httpRequest.get<PaginatedUsers>("/admin/users", {
        params,
      });
      return response;
    } catch (error: any) {
      console.error("Search users failed:", error);
      throw new Error(
        error.response?.data?.message || "Failed to search users"
      );
    }
  }

  /**
   * Get user details
   */
  async getUserDetails(userId: string): Promise<User> {
    try {
      const response = await httpRequest.get<User>(`/admin/users/${userId}`);
      return response;
    } catch (error: any) {
      console.error("Get user details failed:", error);
      throw new Error(
        error.response?.data?.message || "Failed to get user details"
      );
    }
  }

  /**
   * Update user information
   */
  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    try {
      const response = await httpRequest.patch<User>(
        `/admin/users/${userId}`,
        updates
      );
      return response;
    } catch (error: any) {
      console.error("Update user failed:", error);
      throw new Error(error.response?.data?.message || "Failed to update user");
    }
  }

  /**
   * Ban a user
   */
  async banUser(data: BanUserDto): Promise<{ message: string }> {
    try {
      const response = await httpRequest.post<{ message: string }>(
        "/admin/users/ban",
        data
      );
      return response;
    } catch (error: any) {
      console.error("Ban user failed:", error);
      throw new Error(error.response?.data?.message || "Failed to ban user");
    }
  }

  /**
   * Unban a user
   */
  async unbanUser(data: UnbanUserDto): Promise<{ message: string }> {
    try {
      const response = await httpRequest.post<{ message: string }>(
        "/admin/users/unban",
        data
      );
      return response;
    } catch (error: any) {
      console.error("Unban user failed:", error);
      throw new Error(error.response?.data?.message || "Failed to unban user");
    }
  }

  // ==================== VERIFICATION REVIEW ====================

  /**
   * Get pending verifications
   */
  async getPendingVerifications(params: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedVerifications> {
    try {
      const response = await httpRequest.get<PaginatedVerifications>(
        "/admin/verifications/pending",
        { params }
      );
      return response;
    } catch (error: any) {
      console.error("Get pending verifications failed:", error);
      throw new Error(
        error.response?.data?.message || "Failed to get pending verifications"
      );
    }
  }

  /**
   * Get verification details for a user
   */
  async getVerificationDetails(userId: string): Promise<{
    user: User;
    verifications: Verification[];
  }> {
    try {
      const response = await httpRequest.get<{
        user: User;
        verifications: Verification[];
      }>(`/admin/verifications/user/${userId}`);
      return response;
    } catch (error: any) {
      console.error("Get verification details failed:", error);
      throw new Error(
        error.response?.data?.message || "Failed to get verification details"
      );
    }
  }

  /**
   * Approve a verification
   */
  async approveVerification(
    data: ApproveVerificationDto
  ): Promise<{ message: string }> {
    try {
      const response = await httpRequest.post<{ message: string }>(
        "/admin/verifications/approve",
        data
      );
      return response;
    } catch (error: any) {
      console.error("Approve verification failed:", error);
      throw new Error(
        error.response?.data?.message || "Failed to approve verification"
      );
    }
  }

  /**
   * Reject a verification
   */
  async rejectVerification(
    data: RejectVerificationDto
  ): Promise<{ message: string }> {
    try {
      const response = await httpRequest.post<{ message: string }>(
        "/admin/verifications/reject",
        data
      );
      return response;
    } catch (error: any) {
      console.error("Reject verification failed:", error);
      throw new Error(
        error.response?.data?.message || "Failed to reject verification"
      );
    }
  }

  // ==================== DISPUTE MANAGEMENT ====================

  /**
   * Get disputes for admin review
   */
  async getDisputes(params: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedDisputes> {
    try {
      const response = await httpRequest.get<PaginatedDisputes>(
        "/admin/disputes",
        {
          params,
        }
      );
      return response;
    } catch (error: any) {
      console.error("Get disputes failed:", error);
      throw new Error(
        error.response?.data?.message || "Failed to get disputes"
      );
    }
  }

  /**
   * Get dispute details
   */
  async getDisputeDetails(disputeId: string): Promise<Dispute> {
    try {
      const response = await httpRequest.get<Dispute>(
        `/admin/disputes/${disputeId}`
      );
      return response;
    } catch (error: any) {
      console.error("Get dispute details failed:", error);
      throw new Error(
        error.response?.data?.message || "Failed to get dispute details"
      );
    }
  }

  /**
   * Update dispute status
   */
  async updateDisputeStatus(
    disputeId: string,
    status: string,
    notes?: string
  ): Promise<{ message: string }> {
    try {
      const response = await httpRequest.patch<{ message: string }>(
        `/admin/disputes/${disputeId}/status`,
        { status, notes }
      );
      return response;
    } catch (error: any) {
      console.error("Update dispute status failed:", error);
      throw new Error(
        error.response?.data?.message || "Failed to update dispute status"
      );
    }
  }

  /**
   * Resolve dispute with escrow distribution
   */
  async resolveDispute(data: ResolveDisputeDto): Promise<{ message: string }> {
    try {
      const response = await httpRequest.post<{ message: string }>(
        `/admin/disputes/${data.disputeId}/resolve`,
        data
      );
      return response;
    } catch (error: any) {
      console.error("Resolve dispute failed:", error);
      throw new Error(
        error.response?.data?.message || "Failed to resolve dispute"
      );
    }
  }

  // ==================== ESCROW MANAGEMENT ====================

  /**
   * Get escrow details for a pool
   */
  async getEscrowDetails(poolId: string): Promise<EscrowDetails> {
    try {
      const response = await httpRequest.get<EscrowDetails>(
        `/admin/escrow/${poolId}`
      );
      return response;
    } catch (error: any) {
      console.error("Get escrow details failed:", error);
      throw new Error(
        error.response?.data?.message || "Failed to get escrow details"
      );
    }
  }

  /**
   * Manual escrow release
   */
  async manualRelease(data: ManualReleaseDto): Promise<{ message: string }> {
    try {
      const response = await httpRequest.post<{ message: string }>(
        "/admin/escrow/manual-release",
        data
      );
      return response;
    } catch (error: any) {
      console.error("Manual release failed:", error);
      throw new Error(
        error.response?.data?.message || "Failed to release escrow"
      );
    }
  }

  /**
   * Manual refund
   */
  async manualRefund(data: ManualRefundDto): Promise<{ message: string }> {
    try {
      const response = await httpRequest.post<{ message: string }>(
        "/admin/escrow/manual-refund",
        data
      );
      return response;
    } catch (error: any) {
      console.error("Manual refund failed:", error);
      throw new Error(
        error.response?.data?.message || "Failed to process refund"
      );
    }
  }

  // ==================== METRICS ====================

  /**
   * Get revenue metrics for charts
   */
  async getRevenueMetrics(
    period: string = "week"
  ): Promise<Array<{ name: string; date: string; revenue: number }>> {
    try {
      const response = await httpRequest.get<
        Array<{ name: string; date: string; revenue: number }>
      >(`/admin/metrics/revenue?period=${period}`);
      return response;
    } catch (error: any) {
      console.error("Get revenue metrics failed:", error);
      throw new Error(
        error.response?.data?.message || "Failed to get revenue metrics"
      );
    }
  }

  /**
   * Get user growth metrics for charts
   */
  async getUserGrowthMetrics(period: string = "month"): Promise<
    Array<{
      name: string;
      month: string;
      users: number;
      vendors: number;
      buyers: number;
    }>
  > {
    try {
      const response = await httpRequest.get<
        Array<{
          name: string;
          month: string;
          users: number;
          vendors: number;
          buyers: number;
        }>
      >(`/admin/metrics/user-growth?period=${period}`);
      return response;
    } catch (error: any) {
      console.error("Get user growth metrics failed:", error);
      throw new Error(
        error.response?.data?.message || "Failed to get user growth metrics"
      );
    }
  }

  /**
   * Get pool distribution metrics for charts
   */
  async getPoolDistributionMetrics(): Promise<
    Array<{ name: string; value: number; color: string }>
  > {
    try {
      const response = await httpRequest.get<
        Array<{ name: string; value: number; color: string }>
      >("/admin/metrics/pool-distribution");
      return response;
    } catch (error: any) {
      console.error("Get pool distribution metrics failed:", error);
      throw new Error(
        error.response?.data?.message ||
          "Failed to get pool distribution metrics"
      );
    }
  }

  // ==================== DASHBOARD ====================

  /**
   * Get admin dashboard statistics
   */
  async getDashboardStats(): Promise<AdminDashboard> {
    try {
      const response = await httpRequest.get<AdminDashboard>(
        "/admin/dashboard"
      );
      return response;
    } catch (error: any) {
      console.error("Get dashboard stats failed:", error);
      throw new Error(
        error.response?.data?.message || "Failed to get dashboard stats"
      );
    }
  }

  /**
   * Get admin dashboard statistics with recent activity
   */
  async getDashboardWithActivity(): Promise<
    AdminDashboard & { recentActivity: AdminAuditLog[] }
  > {
    try {
      const [dashboard, auditLogs] = await Promise.all([
        this.getDashboardStats(),
        this.getAuditLogs({ page: 1, limit: 10 }),
      ]);

      return {
        ...dashboard,
        recentActivity: auditLogs.logs,
      };
    } catch (error: any) {
      console.error("Get dashboard with activity failed:", error);
      throw new Error(
        error.response?.data?.message || "Failed to get dashboard with activity"
      );
    }
  }

  /**
   * Get admin audit logs
   */
  async getAuditLogs(params: {
    page?: number;
    limit?: number;
    action?: string;
    targetType?: string;
  }): Promise<{
    logs: AdminAuditLog[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const response = await httpRequest.get<{
        logs: AdminAuditLog[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      }>("/admin/audit-logs", { params });
      return response;
    } catch (error: any) {
      console.error("Get audit logs failed:", error);
      throw new Error(
        error.response?.data?.message || "Failed to get audit logs"
      );
    }
  }

  /**
   * Get system health status
   */
  async getSystemHealth(): Promise<{
    status: "healthy" | "degraded" | "unhealthy";
    services: Record<string, { status: string; lastCheck: string }>;
    uptime: number;
  }> {
    try {
      const response = await httpRequest.get<{
        status: "healthy" | "degraded" | "unhealthy";
        services: Record<string, { status: string; lastCheck: string }>;
        uptime: number;
      }>("/admin/health");
      return response;
    } catch (error: any) {
      console.error("Get system health failed:", error);
      throw new Error(
        error.response?.data?.message || "Failed to get system health"
      );
    }
  }

  // ==================== PAYOUT MANAGEMENT ====================

  /**
   * Get all payouts with filtering
   */
  async getPayouts(params?: {
    page?: number;
    limit?: number;
    status?: string;
    vendorId?: string;
  }): Promise<{
    payouts: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const response = await httpRequest.get<{
        payouts: any[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      }>("/admin/payouts", { params });
      return response;
    } catch (error: any) {
      console.error("Get payouts failed:", error);
      throw new Error(error.response?.data?.message || "Failed to get payouts");
    }
  }

  /**
   * Get vendor payout statistics
   */
  async getVendorPayoutStats(params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<{
    summary: {
      totalVendorsPaid: number;
      totalPayoutCount: number;
      totalAmountPaidOut: number;
      totalPlatformFeesCollected: number;
      platformFeeRate: string;
    };
    pending: {
      count: number;
      amount: number;
      estimatedFees: number;
    };
    vendorBreakdown: any[];
    period: {
      startDate: string;
      endDate: string;
    };
  }> {
    try {
      const response = await httpRequest.get<any>("/admin/payouts/stats", {
        params,
      });
      return response;
    } catch (error: any) {
      console.error("Get vendor payout stats failed:", error);
      throw new Error(
        error.response?.data?.message || "Failed to get vendor payout stats"
      );
    }
  }

  /**
   * Simulate payout calculation for a pool
   */
  async simulatePayout(poolId: string): Promise<{
    pool: any;
    vendor: any;
    escrow: {
      totalHeld: number;
      withheldAmount: number;
      alreadyReleased: number;
      availableForPayout: number;
    };
    calculation: {
      platformFeeRate: string;
      platformFee: number;
      netPayoutToVendor: number;
    };
    buyerBreakdown: any[];
    canPayout: boolean;
    vendorBankConfigured: boolean;
  }> {
    try {
      const response = await httpRequest.post<any>("/admin/payouts/simulate", {
        poolId,
      });
      return response;
    } catch (error: any) {
      console.error("Simulate payout failed:", error);
      throw new Error(
        error.response?.data?.message || "Failed to simulate payout"
      );
    }
  }

  /**
   * Initiate payout to vendor
   */
  async initiatePayout(
    poolId: string,
    notes?: string
  ): Promise<{
    message: string;
    payout: {
      transferReference: string;
      amount: number;
      platformFee: number;
      vendor: string;
      status: string;
    };
  }> {
    try {
      const response = await httpRequest.post<any>("/admin/payouts/initiate", {
        poolId,
        notes,
      });
      return response;
    } catch (error: any) {
      console.error("Initiate payout failed:", error);
      throw new Error(
        error.response?.data?.message || "Failed to initiate payout"
      );
    }
  }

  // ============================================================================
  // NEWSLETTER METHODS
  // ============================================================================

  /**
   * Get newsletter statistics
   */
  async getNewsletterStats(): Promise<{
    totalActive: number;
    totalInactive: number;
    total: number;
    recentSubscribers: number;
    growthRate: string | number;
  }> {
    try {
      const response = await httpRequest.get<any>("/newsletter/stats");
      return response;
    } catch (error: any) {
      console.error("Get newsletter stats failed:", error);
      throw new Error(
        error.response?.data?.message || "Failed to get newsletter stats"
      );
    }
  }

  /**
   * Get newsletter subscribers
   */
  async getNewsletterSubscribers(params?: {
    page?: number;
    limit?: number;
    activeOnly?: boolean;
  }): Promise<{
    subscribers: Array<{
      id: string;
      email: string;
      name?: string;
      source: string;
      tags: string[];
      isActive: boolean;
      subscribedAt: string;
      unsubscribedAt?: string;
    }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasMore: boolean;
    };
  }> {
    try {
      const response = await httpRequest.get<any>("/newsletter/subscribers", {
        params,
      });
      return response;
    } catch (error: any) {
      console.error("Get newsletter subscribers failed:", error);
      throw new Error(
        error.response?.data?.message || "Failed to get newsletter subscribers"
      );
    }
  }

  /**
   * Send newsletter email
   */
  async sendNewsletter(dto: {
    subject: string;
    htmlContent: string;
    textContent?: string;
    targetTags?: string[];
    testMode?: boolean;
  }): Promise<{
    message: string;
    subject: string;
    sentCount?: number;
    failedCount?: number;
    totalRecipients?: number;
    recipientCount?: number;
    testRecipients?: string[];
    htmlPreview?: string;
  }> {
    try {
      const response = await httpRequest.post<any>("/newsletter/send", dto);
      return response;
    } catch (error: any) {
      console.error("Send newsletter failed:", error);
      throw new Error(
        error.response?.data?.message || "Failed to send newsletter"
      );
    }
  }
}

export const adminService = new AdminService();
