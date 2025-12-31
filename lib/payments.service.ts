import { httpRequest } from "./httpRequest";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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
  product?: {
    id: string;
    name: string;
    description: string;
    images: string[];
    category: string;
    price: number;
    unit: string;
    quantity: number;
  };
  vendor?: {
    id: string;
    name: string;
    email: string;
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
  pool?: Pool;
}

export interface PaymentMethod {
  id: string;
  userId: string;
  method: 'STRIPE' | 'PAYSTACK';
  stripeSessionId?: string;
  paystackRef?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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

export interface PendingSubscription {
  id: string;
  userId: string;
  poolId: string;
  slots: number;
  deliveryFee: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  gateway: 'STRIPE' | 'PAYSTACK';
  stripeSessionId?: string;
  paystackRef?: string;
  createdAt: string;
  expiresAt?: string;
}

export interface UserPaymentMethods {
  stripe: PaymentMethod[];
  paystack: PaymentMethod[];
  defaultMethod?: string;
}

export interface ReceiptDetails {
  amount: number;
  poolName: string;
  transactionId: string;
  subscriptionId: string;
  email: string;
  slots: number;
  deliveryFee: number;
  type: 'subscription' | 'refund' | 'payout';
  date: string;
}

export interface PaymentStats {
  totalRevenue: number;
  totalTransactions: number;
  successRate: number;
  averageTransactionValue: number;
  revenueByMethod: {
    stripe: number;
    paystack: number;
  };
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
    transactions: number;
  }>;
}

// ============================================================================
// PAYMENTS SERVICE
// ============================================================================

class PaymentsService {
  /**
   * Initiate payment
   */
  async initiatePayment(data: PaymentInit): Promise<PaymentResponse> {
    try {
      const response = await httpRequest.post<PaymentResponse>("/payments/pay", data);
      return response;
    } catch (error: any) {
      console.error("Initiate payment failed:", error);
      throw new Error(error.response?.data?.message || "Failed to initiate payment");
    }
  }

  /**
   * Verify Paystack payment
   */
  async verifyPaystackPayment(reference: string): Promise<{
    success: boolean;
    subscriptionId: string;
  }> {
    try {
      const response = await httpRequest.post<{
        success: boolean;
        subscriptionId: string;
      }>(`/payments/paystack/verify?reference=${reference}`);
      return response;
    } catch (error: any) {
      console.error("Verify Paystack payment failed:", error);
      throw new Error(error.response?.data?.message || "Failed to verify payment");
    }
  }

  /**
   * Get user's payment methods
   */
  async getUserPaymentMethods(): Promise<UserPaymentMethods> {
    try {
      const response = await httpRequest.get<UserPaymentMethods>("/user/payment-methods");
      return response;
    } catch (error: any) {
      console.error("Get user payment methods failed:", error);
      throw new Error(error.response?.data?.message || "Failed to get payment methods");
    }
  }

  /**
   * Set default payment method
   */
  async setDefaultPaymentMethod(methodId: string): Promise<{
    message: string;
  }> {
    try {
      const response = await httpRequest.post<{ message: string }>(
        "/user/payment-methods/default",
        { methodId }
      );
      return response;
    } catch (error: any) {
      console.error("Set default payment method failed:", error);
      throw new Error(error.response?.data?.message || "Failed to set default payment method");
    }
  }

  /**
   * Delete payment method
   */
  async deletePaymentMethod(methodId: string): Promise<{
    message: string;
  }> {
    try {
      const response = await httpRequest.delete<{ message: string }>(
        `/user/payment-methods/${methodId}`
      );
      return response;
    } catch (error: any) {
      console.error("Delete payment method failed:", error);
      throw new Error(error.response?.data?.message || "Failed to delete payment method");
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
   * Get subscription details
   */
  async getSubscriptionDetails(subscriptionId: string): Promise<Subscription> {
    try {
      const response = await httpRequest.get<Subscription>(
        `/user/subscriptions/${subscriptionId}`
      );
      return response;
    } catch (error: any) {
      console.error("Get subscription details failed:", error);
      throw new Error(error.response?.data?.message || "Failed to get subscription details");
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(
    subscriptionId: string,
    reason: string
  ): Promise<{
    message: string;
    refundAmount?: number;
  }> {
    try {
      const response = await httpRequest.post<{
        message: string;
        refundAmount?: number;
      }>(`/user/subscriptions/${subscriptionId}/cancel`, { reason });
      return response;
    } catch (error: any) {
      console.error("Cancel subscription failed:", error);
      throw new Error(error.response?.data?.message || "Failed to cancel subscription");
    }
  }

  /**
   * Get user's payment history
   */
  async getPaymentHistory(params?: {
    page?: number;
    limit?: number;
    status?: string;
    method?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{
    transactions: Transaction[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const response = await httpRequest.get<{
        transactions: Transaction[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      }>("/user/payment-history", { params });
      return response;
    } catch (error: any) {
      console.error("Get payment history failed:", error);
      throw new Error(error.response?.data?.message || "Failed to get payment history");
    }
  }

  /**
   * Download receipt
   */
  async downloadReceipt(transactionId: string): Promise<Blob> {
    try {
      const response = await httpRequest.get<Blob>(
        `/user/receipts/${transactionId}/download`,
        {
          responseType: 'blob',
        }
      );
      return response;
    } catch (error: any) {
      console.error("Download receipt failed:", error);
      throw new Error(error.response?.data?.message || "Failed to download receipt");
    }
  }

  /**
   * Get user's payment statistics
   */
  async getPaymentStats(): Promise<PaymentStats> {
    try {
      const response = await httpRequest.get<PaymentStats>("/user/payment-stats");
      return response;
      } catch (error: any) {
      console.error("Get payment stats failed:", error);
      throw new Error(error.response?.data?.message || "Failed to get payment statistics");
    }
  }

  /**
   * Get vendor's earnings
   */
  async getVendorEarnings(params?: {
    startDate?: string;
    endDate?: string;
    status?: string;
  }): Promise<{
    totalEarnings: number;
    pendingEarnings: number;
    releasedEarnings: number;
    commissions: number;
    earningsByMonth: Array<{
      month: string;
      earnings: number;
      commissions: number;
      subscriptions: number;
    }>;
    recentPayouts: Array<{
      id: string;
      amount: number;
      status: string;
      date: string;
    }>;
  }> {
    try {
      const response = await httpRequest.get<{
        totalEarnings: number;
        pendingEarnings: number;
        releasedEarnings: number;
        commissions: number;
        earningsByMonth: Array<{
          month: string;
          earnings: number;
          commissions: number;
          subscriptions: number;
        }>;
        recentPayouts: Array<{
          id: string;
          amount: number;
          status: string;
          date: string;
        }>;
      }>("/vendor/earnings", { params });
      return response;
    } catch (error: any) {
      console.error("Get vendor earnings failed:", error);
      throw new Error(error.response?.data?.message || "Failed to get vendor earnings");
    }
  }

  /**
   * Request payout (vendor only)
   */
  async requestPayout(amount: number, bankDetails: {
    accountNumber: string;
    bankCode: string;
    accountName: string;
  }): Promise<{
    message: string;
    payoutId: string;
    estimatedDate: string;
  }> {
    try {
      const response = await httpRequest.post<{
        message: string;
        payoutId: string;
        estimatedDate: string;
      }>("/vendor/payouts/request", { amount, bankDetails });
      return response;
    } catch (error: any) {
      console.error("Request payout failed:", error);
      throw new Error(error.response?.data?.message || "Failed to request payout");
    }
  }

  /**
   * Get vendor's payout history
   */
  async getPayoutHistory(): Promise<{
    payouts: Array<{
      id: string;
      amount: number;
      status: 'pending' | 'processing' | 'completed' | 'failed';
      date: string;
      estimatedDate?: string;
      completedDate?: string;
      bankDetails: {
        accountNumber: string;
        bankCode: string;
        accountName: string;
      };
    }>;
    total: number;
  }> {
    try {
      const response = await httpRequest.get<{
        payouts: Array<{
          id: string;
          amount: number;
          status: 'pending' | 'processing' | 'completed' | 'failed';
          date: string;
          estimatedDate?: string;
          completedDate?: string;
          bankDetails: {
            accountNumber: string;
            bankCode: string;
            accountName: string;
          };
        }>;
        total: number;
      }>("/vendor/payouts/history");
      return response;
    } catch (error: any) {
      console.error("Get payout history failed:", error);
      throw new Error(error.response?.data?.message || "Failed to get payout history");
    }
  }

  /**
   * Calculate delivery fee
   */
  calculateDeliveryFee(
    waybillWithin: boolean,
    waybillOutside: boolean,
    pool: Pool
  ): number {
    const baseDeliveryFee = waybillWithin ? 5000 : waybillOutside ? 10000 : 0;
    return baseDeliveryFee;
  }

  /**
   * Calculate total payment amount
   */
  calculateTotalAmount(
    pool: Pool,
    slots: number,
    waybillWithin: boolean,
    waybillOutside: boolean
  ): {
    itemCost: number;
    deliveryFee: number;
    total: number;
  } {
    const itemCost = Number(pool.pricePerSlot) * slots;
    const deliveryFee = this.calculateDeliveryFee(
      waybillWithin,
      waybillOutside,
      pool
    );
    const total = itemCost + deliveryFee;

    return { itemCost, deliveryFee, total };
  }

  /**
   * Check if payment is still pending
   */
  async isPaymentPending(pendingId: string): Promise<{
    isPending: boolean;
    status?: string;
    subscriptionId?: string;
  }> {
    try {
      const response = await httpRequest.get<{
        isPending: boolean;
        status?: string;
        subscriptionId?: string;
      }>(`/payments/pending/${pendingId}`);
      return response;
    } catch (error: any) {
      console.error("Check payment status failed:", error);
      throw new Error(error.response?.data?.message || "Failed to check payment status");
    }
  }

  /**
   * Get payment gateway status
   */
  async getGatewayStatus(): Promise<{
    stripe: { status: string; lastCheck: string };
    paystack: { status: string; lastCheck: string };
  }> {
    try {
      const response = await httpRequest.get<{
        stripe: { status: string; lastCheck: string };
        paystack: { status: string; lastCheck: string };
      }>("/payments/gateways/status");
      return response;
    } catch (error: any) {
      console.error("Get gateway status failed:", error);
      throw new Error(error.response?.data?.message || "Failed to get gateway status");
    }
  }
}

export const paymentsService = new PaymentsService();