import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { paymentsService } from "@/lib/payments.service";

/**
 * Hook for payment processing
 */
export function usePayments() {
  const { user, addNotification } = useStore();

  const [loading, setLoading] = useState(false);

  const initiatePayment = async (data: {
    method: 'STRIPE' | 'PAYSTACK';
    poolId: string;
    slots: number;
    waybillWithin: boolean;
    waybillOutside: boolean;
  }) => {
    if (!user) throw new Error("User must be authenticated to make payments");

    try {
      setLoading(true);
      const response = await paymentsService.initiatePayment(data);

      // Add notification for payment initiation
      addNotification({
        id: `payment-${Date.now()}`,
        user_id: user.id,
        type: "payment",
        title: "Payment Initiated",
        message: `Your payment for ${data.slots} slots in pool ${data.poolId} has been initiated.`,
        read: false,
        timestamp: new Date().toISOString(),
        created_at: new Date().toISOString(),
      });

      return response;
    } catch (error) {
      console.error("Failed to initiate payment:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyPaystackPayment = async (reference: string) => {
    try {
      setLoading(true);
      const result = await paymentsService.verifyPaystackPayment(reference);

      if (result.success) {
        addNotification({
          id: `payment-verified-${Date.now()}`,
          user_id: user!.id,
          type: "payment",
          title: "Payment Successful",
          message: "Your payment has been verified and processed successfully.",
          read: false,
          timestamp: new Date().toISOString(),
          created_at: new Date().toISOString(),
        });
      }

      return result;
    } catch (error) {
      console.error("Failed to verify payment:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const isPaymentPending = async (pendingId: string) => {
    try {
      const result = await paymentsService.isPaymentPending(pendingId);
      return result;
    } catch (error) {
      console.error("Failed to check payment status:", error);
      throw error;
    }
  };

  const calculateTotalAmount = (pool: any, slots: number, waybillWithin: boolean, waybillOutside: boolean) => {
    return paymentsService.calculateTotalAmount(pool, slots, waybillWithin, waybillOutside);
  };

  const calculateDeliveryFee = (waybillWithin: boolean, waybillOutside: boolean, pool: any) => {
    return paymentsService.calculateDeliveryFee(waybillWithin, waybillOutside, pool);
  };

  const getGatewayStatus = async () => {
    try {
      const status = await paymentsService.getGatewayStatus();
      return status;
    } catch (error) {
      console.error("Failed to get gateway status:", error);
      throw error;
    }
  };

  return {
    loading,
    initiatePayment,
    verifyPaystackPayment,
    isPaymentPending,
    calculateTotalAmount,
    calculateDeliveryFee,
    getGatewayStatus,
  };
}

/**
 * Hook for user payment methods management
 */
export function usePaymentMethods() {
  const {
    user,
    userPaymentMethods,
    setUserPaymentMethods,
    addNotification
  } = useStore();

  const loading = false;

  const loadPaymentMethods = async () => {
    if (!user) return;

    try {
      loading = true;
      const methods = await paymentsService.getUserPaymentMethods();
      setUserPaymentMethods(methods);
    } catch (error) {
      console.error("Failed to load payment methods:", error);
    } finally {
      loading = false;
    }
  };

  const setDefaultPaymentMethod = async (methodId: string) => {
    if (!user) throw new Error("User must be authenticated");

    try {
      await paymentsService.setDefaultPaymentMethod(methodId);

      // Update payment methods in state
      if (userPaymentMethods) {
        const updatedMethods = {
          ...userPaymentMethods,
          defaultMethod: methodId,
        };
        setUserPaymentMethods(updatedMethods);
      }

      addNotification({
        id: `payment-method-updated-${Date.now()}`,
        user_id: user.id,
        type: "payment",
        title: "Payment Method Updated",
        message: "Your default payment method has been updated successfully.",
        read: false,
        timestamp: new Date().toISOString(),
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Failed to set default payment method:", error);
      throw error;
    }
  };

  const deletePaymentMethod = async (methodId: string) => {
    if (!user) throw new Error("User must be authenticated");

    try {
      await paymentsService.deletePaymentMethod(methodId);

      // Update payment methods in state
      if (userPaymentMethods) {
        const updatedMethods = { ...userPaymentMethods };

        // Remove from stripe or paystack arrays
        updatedMethods.stripe = updatedMethods.stripe.filter(m => m.id !== methodId);
        updatedMethods.paystack = updatedMethods.paystack.filter(m => m.id !== methodId);

        // Clear default if it was the deleted method
        if (updatedMethods.defaultMethod === methodId) {
          updatedMethods.defaultMethod = undefined;
        }

        setUserPaymentMethods(updatedMethods);
      }

      addNotification({
        id: `payment-method-deleted-${Date.now()}`,
        user_id: user.id,
        type: "payment",
        title: "Payment Method Removed",
        message: "Your payment method has been removed successfully.",
        read: false,
        timestamp: new Date().toISOString(),
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Failed to delete payment method:", error);
      throw error;
    }
  };

  // Auto-load payment methods when user is authenticated
  useEffect(() => {
    if (user) {
      loadPaymentMethods();
    }
  }, [user?.id]);

  return {
    userPaymentMethods,
    loading,
    loadPaymentMethods,
    setDefaultPaymentMethod,
    deletePaymentMethod,
  };
}

/**
 * Hook for user transactions and payment history
 */
export function useTransactions() {
  const {
    user,
    userTransactions,
    setUserTransactions,
    addUserTransaction,
    paymentStats,
    setPaymentStats
  } = useStore();

  const loading = { transactions: false, stats: false, receipt: false };

  const loadUserTransactions = async () => {
    if (!user) return;

    try {
      loading.transactions = true;
      const transactions = await paymentsService.getUserTransactions();
      setUserTransactions(transactions);
    } catch (error) {
      console.error("Failed to load user transactions:", error);
    } finally {
      loading.transactions = false;
    }
  };

  const getUserSubscriptions = async () => {
    if (!user) return [];

    try {
      const subscriptions = await paymentsService.getUserSubscriptions();
      return subscriptions;
    } catch (error) {
      console.error("Failed to load user subscriptions:", error);
      return [];
    }
  };

  const getSubscriptionDetails = async (subscriptionId: string) => {
    try {
      const subscription = await paymentsService.getSubscriptionDetails(subscriptionId);
      return subscription;
    } catch (error) {
      console.error("Failed to get subscription details:", error);
      throw error;
    }
  };

  const cancelSubscription = async (subscriptionId: string, reason: string) => {
    if (!user) throw new Error("User must be authenticated");

    try {
      const result = await paymentsService.cancelSubscription(subscriptionId, reason);
      return result;
    } catch (error) {
      console.error("Failed to cancel subscription:", error);
      throw error;
    }
  };

  const getPaymentHistory = async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    method?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    if (!user) return { transactions: [], total: 0, page: 1, limit: 10, totalPages: 0 };

    try {
      const history = await paymentsService.getPaymentHistory(params);
      return history;
    } catch (error) {
      console.error("Failed to get payment history:", error);
      return { transactions: [], total: 0, page: 1, limit: 10, totalPages: 0 };
    }
  };

  const getPaymentStats = async () => {
    if (!user) return;

    try {
      loading.stats = true;
      const stats = await paymentsService.getPaymentStats();
      setPaymentStats(stats);
    } catch (error) {
      console.error("Failed to get payment stats:", error);
    } finally {
      loading.stats = false;
    }
  };

  const downloadReceipt = async (transactionId: string) => {
    try {
      loading.receipt = true;
      const receipt = await paymentsService.downloadReceipt(transactionId);
      return receipt;
    } catch (error) {
      console.error("Failed to download receipt:", error);
      throw error;
    } finally {
      loading.receipt = false;
    }
  };

  // Auto-load transactions when user is authenticated
  useEffect(() => {
    if (user) {
      loadUserTransactions();
      getPaymentStats();
    }
  }, [user?.id]);

  return {
    userTransactions,
    paymentStats,
    loading,
    loadUserTransactions,
    getUserSubscriptions,
    getSubscriptionDetails,
    cancelSubscription,
    getPaymentHistory,
    getPaymentStats,
    downloadReceipt,
  };
}

/**
 * Hook for vendor earnings and payouts
 */
export function useVendorEarnings() {
  const {
    user,
    vendorEarnings,
    setVendorEarnings,
    addNotification
  } = useStore();

  const loading = { earnings: false, payout: false, history: false };

  const getVendorEarnings = async (params?: {
    startDate?: string;
    endDate?: string;
    status?: string;
  }) => {
    if (!user || user.role !== 'vendor') return;

    try {
      loading.earnings = true;
      const earnings = await paymentsService.getVendorEarnings(params);
      setVendorEarnings(earnings);
    } catch (error) {
      console.error("Failed to get vendor earnings:", error);
    } finally {
      loading.earnings = false;
    }
  };

  const requestPayout = async (amount: number, bankDetails: {
    accountNumber: string;
    bankCode: string;
    accountName: string;
  }) => {
    if (!user || user.role !== 'vendor') {
      throw new Error("Only vendors can request payouts");
    }

    try {
      loading.payout = true;
      const result = await paymentsService.requestPayout(amount, bankDetails);

      addNotification({
        id: `payout-requested-${Date.now()}`,
        user_id: user.id,
        type: "payment",
        title: "Payout Requested",
        message: `Your payout request of ₦${amount.toLocaleString()} has been submitted.`,
        read: false,
        timestamp: new Date().toISOString(),
        created_at: new Date().toISOString(),
      });

      // Refresh earnings
      await getVendorEarnings();

      return result;
    } catch (error) {
      console.error("Failed to request payout:", error);
      throw error;
    } finally {
      loading.payout = false;
    }
  };

  const getPayoutHistory = async () => {
    if (!user || user.role !== 'vendor') return { payouts: [], total: 0 };

    try {
      loading.history = true;
      const history = await paymentsService.getPayoutHistory();
      return history;
    } catch (error) {
      console.error("Failed to get payout history:", error);
      return { payouts: [], total: 0 };
    } finally {
      loading.history = false;
    }
  };

  // Auto-load earnings when vendor is authenticated
  useEffect(() => {
    if (user && user.role === 'vendor') {
      getVendorEarnings();
    }
  }, [user?.id, user?.role]);

  return {
    vendorEarnings,
    loading,
    getVendorEarnings,
    requestPayout,
    getPayoutHistory,
  };
}