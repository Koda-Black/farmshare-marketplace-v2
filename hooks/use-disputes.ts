import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { disputesService, Dispute as ServiceDispute, DisputeMetrics } from "@/lib/disputes.service";
import { Dispute as StoreDispute, DisputeStatistics } from "@/lib/store";

/**
 * Type mapping function to convert service disputes to store disputes
 */
const mapServiceDisputeToStoreDispute = (serviceDispute: ServiceDispute): StoreDispute => {
  return {
    id: serviceDispute.id,
    poolId: serviceDispute.poolId,
    raisedByUserId: serviceDispute.raisedByUserId,
    reason: serviceDispute.reason,
    status: serviceDispute.status,
    evidenceFiles: serviceDispute.evidenceFiles,
    complainantCount: serviceDispute.complainantCount,
    resolutionNotes: serviceDispute.resolutionNotes,
    resolvedAt: serviceDispute.resolvedAt,
    createdAt: serviceDispute.createdAt,
    updatedAt: serviceDispute.updatedAt,
    pool: serviceDispute.pool ? {
      id: serviceDispute.pool.id,
      vendor_id: serviceDispute.pool.vendorId,
      product_name: serviceDispute.pool.product?.name || '',
      product_description: serviceDispute.pool.product?.description || '',
      slots_count: 0, // Not available in service interface
      slots_filled: 0, // Not available in service interface
      price_per_slot: serviceDispute.pool.priceTotal,
      target_amount: serviceDispute.pool.priceTotal,
      current_amount: 0, // Not available in service interface
      status: serviceDispute.pool.status as any,
      created_at: '', // Not available in service interface
      ends_at: '', // Not available in service interface
      vendor: serviceDispute.pool.vendor,
      product: serviceDispute.pool.product,
    } : undefined,
    raisedBy: serviceDispute.raisedBy,
  };
};

/**
 * Type mapping function to convert service metrics to store statistics
 */
const mapDisputeMetricsToStatistics = (metrics: DisputeMetrics): DisputeStatistics => {
  return {
    total: metrics.totalDisputes,
    open: metrics.openDisputes,
    inReview: 0, // Not available in service interface, calculate from total - resolved - rejected - open
    resolved: metrics.resolvedDisputes,
    rejected: metrics.rejectedDisputes,
    resolutionRate: metrics.resolutionRate,
  };
};

/**
 * Hook for user dispute management
 */
export function useUserDisputes() {
  const {
    user,
    userDisputes,
    setUserDisputes,
    addUserDispute,
    updateUserDispute,
    addNotification,
  } = useStore();

  const [loading, setLoading] = useState(false);

  const loadUserDisputes = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const disputes = await disputesService.getUserDisputes();
      setUserDisputes(disputes.map(mapServiceDisputeToStoreDispute));
    } catch (error) {
      console.error("Failed to load user disputes:", error);
    } finally {
      setLoading(false);
    }
  };

  const createDispute = async (data: {
    poolId: string;
    reason: string;
    files?: File[];
  }) => {
    if (!user)
      throw new Error("User must be authenticated to create a dispute");

    try {
      const result = await disputesService.createDispute(data);

      // Add notification for the new dispute
      addNotification({
        id: `dispute-${Date.now()}`,
        user_id: user.id,
        type: "dispute",
        title: "Dispute Created",
        message: `Your dispute for pool ${data.poolId} has been submitted for review.`,
        read: false,
        timestamp: new Date().toISOString(),
        created_at: new Date().toISOString(),
      });

      // Refresh disputes
      await loadUserDisputes();

      return result;
    } catch (error) {
      console.error("Failed to create dispute:", error);
      throw error;
    }
  };

  const getDisputeDetails = async (disputeId: string) => {
    try {
      const dispute = await disputesService.getDisputeById(disputeId);

      // Update dispute in state if it exists
      updateUserDispute(disputeId, mapServiceDisputeToStoreDispute(dispute));

      return dispute;
    } catch (error) {
      console.error("Failed to get dispute details:", error);
      throw error;
    }
  };

  const addEvidence = async (
    disputeId: string,
    data: {
      files: File[];
      notes?: string;
    }
  ) => {
    try {
      const result = await disputesService.addDisputeEvidence(disputeId, data);

      // Refresh dispute details
      await getDisputeDetails(disputeId);

      return result;
    } catch (error) {
      console.error("Failed to add evidence:", error);
      throw error;
    }
  };

  const escalateDispute = async (
    disputeId: string,
    escalationNotes: string
  ) => {
    try {
      const result = await disputesService.escalateDispute(
        disputeId,
        escalationNotes
      );

      // Update dispute status
      updateUserDispute(disputeId, { status: "in_review" });

      return result;
    } catch (error) {
      console.error("Failed to escalate dispute:", error);
      throw error;
    }
  };

  const canCreateDispute = async (poolId: string) => {
    try {
      const result = await disputesService.canCreateDispute(poolId);
      return result;
    } catch (error) {
      console.error("Failed to check dispute eligibility:", error);
      throw error;
    }
  };

  const getDisputeTimeline = async (disputeId: string) => {
    try {
      const timeline = await disputesService.getDisputeTimeline(disputeId);
      return timeline;
    } catch (error) {
      console.error("Failed to get dispute timeline:", error);
      throw error;
    }
  };

  const getUserDisputeHistory = async () => {
    if (!user) return null;

    try {
      const history = await disputesService.getUserDisputeHistory();
      return history;
    } catch (error) {
      console.error("Failed to get user dispute history:", error);
      return null;
    }
  };

  // Auto-load disputes when user is authenticated
  useEffect(() => {
    if (user) {
      loadUserDisputes();
    }
  }, [user?.id]);

  return {
    userDisputes,
    loading,
    loadUserDisputes,
    createDispute,
    getDisputeDetails,
    addEvidence,
    escalateDispute,
    canCreateDispute,
    getDisputeTimeline,
    getUserDisputeHistory,
  };
}

/**
 * Hook for admin dispute management
 */
export function useAdminDisputes() {
  const {
    admin,
    managedDisputes,
    disputeStats,
    setManagedDisputes,
    setDisputeStats,
    addNotification,
  } = useStore();

  const [loading, setLoading] = useState({ disputes: false, stats: false, resolving: false });

  const loadManagedDisputes = async (params?: {
    page?: number;
    limit?: number;
    status?: 'open' | 'in_review' | 'resolved' | 'rejected';
    userId?: string;
    poolId?: string;
    vendorId?: string;
  }) => {
    if (!admin) return;

    try {
      setLoading(prev => ({ ...prev, disputes: true }));
      const data = await disputesService.getDisputes(params);
      setManagedDisputes(data.disputes.map(mapServiceDisputeToStoreDispute));
    } catch (error) {
      console.error("Failed to load managed disputes:", error);
    } finally {
      setLoading(prev => ({ ...prev, disputes: false }));
    }
  };

  const loadDisputeStats = async (startDate?: Date, endDate?: Date) => {
    if (!admin) return;

    try {
      setLoading(prev => ({ ...prev, stats: true }));
      const stats = await disputesService.getDisputeMetrics(startDate, endDate);
      setDisputeStats(mapDisputeMetricsToStatistics(stats));
    } catch (error) {
      console.error("Failed to load dispute stats:", error);
    } finally {
      setLoading(prev => ({ ...prev, stats: false }));
    }
  };

  const getDisputeDetails = async (disputeId: string) => {
    try {
      const dispute = await disputesService.getDisputeById(disputeId);
      return dispute;
    } catch (error) {
      console.error("Failed to get dispute details:", error);
      throw error;
    }
  };

  const updateDisputeStatus = async (
    disputeId: string,
    status: string,
    notes?: string
  ) => {
    if (!admin) throw new Error("Admin authentication required");

    try {
      await disputesService.updateDisputeStatus(disputeId, status, notes);

      // Update dispute in state
      setManagedDisputes((prev: StoreDispute[]) =>
        prev.map((d: StoreDispute) => (d.id === disputeId ? { ...d, status } : d))
      );
    } catch (error) {
      console.error("Failed to update dispute status:", error);
      throw error;
    }
  };

  const resolveDispute = async (data: {
    disputeId: string;
    action: "refund" | "release" | "split";
    distribution?: Record<string, number>;
    resolutionNotes?: string;
  }) => {
    if (!admin) throw new Error("Admin authentication required");

    try {
      setLoading(prev => ({ ...prev, resolving: true }));
      const result = await disputesService.resolveDispute(data);

      // Update dispute in state
      setManagedDisputes((prev: StoreDispute[]) =>
        prev.map((d: StoreDispute) =>
          d.id === data.disputeId
            ? {
                ...d,
                status: "resolved",
                resolvedAt: new Date().toISOString(),
                resolutionNotes: data.resolutionNotes,
              }
            : d
        )
      );

      // Refresh stats
      await loadDisputeStats();

      return result;
    } catch (error) {
      console.error("Failed to resolve dispute:", error);
      throw error;
    } finally {
      setLoading(prev => ({ ...prev, resolving: false }));
    }
  };

  const rejectDispute = async (disputeId: string, rejectionReason: string) => {
    if (!admin) throw new Error("Admin authentication required");

    try {
      const result = await disputesService.rejectDispute(
        disputeId,
        rejectionReason
      );

      // Update dispute in state
      setManagedDisputes((prev: StoreDispute[]) =>
        prev.map((d: StoreDispute) =>
          d.id === disputeId
            ? {
                ...d,
                status: "rejected",
                resolvedAt: new Date().toISOString(),
                resolutionNotes: rejectionReason,
              }
            : d
        )
      );

      // Refresh stats
      await loadDisputeStats();

      return result;
    } catch (error) {
      console.error("Failed to reject dispute:", error);
      throw error;
    }
  };

  const getPendingDisputes = async () => {
    if (!admin) return [];

    try {
      const disputes = await disputesService.getPendingDisputes();
      return disputes;
    } catch (error) {
      console.error("Failed to get pending disputes:", error);
      return [];
    }
  };

  const getDisputesByPool = async (poolId: string) => {
    try {
      const disputes = await disputesService.getDisputesByPool(poolId);
      return disputes;
    } catch (error) {
      console.error("Failed to get pool disputes:", error);
      return [];
    }
  };

  const getDisputesByUser = async (userId: string) => {
    try {
      const disputes = await disputesService.getDisputesByUser(userId);
      return disputes;
    } catch (error) {
      console.error("Failed to get user disputes:", error);
      return [];
    }
  };

  const getDisputesByVendor = async (vendorId: string) => {
    try {
      const disputes = await disputesService.getDisputesByVendor(vendorId);
      return disputes;
    } catch (error) {
      console.error("Failed to get vendor disputes:", error);
      return [];
    }
  };

  const getResolutionOptions = async (disputeId: string) => {
    try {
      const options = await disputesService.getResolutionOptions(disputeId);
      return options;
    } catch (error) {
      console.error("Failed to get resolution options:", error);
      throw error;
    }
  };

  const bulkResolveDisputes = async (data: {
    disputeIds: string[];
    action: "refund" | "release" | "reject";
    notes: string;
  }) => {
    if (!admin) throw new Error("Admin authentication required");

    try {
      setLoading(prev => ({ ...prev, resolving: true }));
      const result = await disputesService.bulkResolveDisputes(data);

      // Refresh disputes and stats
      await loadManagedDisputes();
      await loadDisputeStats();

      return result;
    } catch (error) {
      console.error("Failed to bulk resolve disputes:", error);
      throw error;
    } finally {
      setLoading(prev => ({ ...prev, resolving: false }));
    }
  };

  const getDisputeStatistics = async (poolId?: string) => {
    try {
      const stats = await disputesService.getDisputeStatistics(poolId);
      return stats;
    } catch (error) {
      console.error("Failed to get dispute statistics:", error);
      throw error;
    }
  };

  // Auto-load disputes when admin is authenticated
  useEffect(() => {
    if (admin) {
      loadManagedDisputes();
      loadDisputeStats();
    }
  }, [admin?.id]);

  return {
    managedDisputes,
    disputeStats,
    loading,
    loadManagedDisputes,
    loadDisputeStats,
    getDisputeDetails,
    updateDisputeStatus,
    resolveDispute,
    rejectDispute,
    getPendingDisputes,
    getDisputesByPool,
    getDisputesByUser,
    getDisputesByVendor,
    getResolutionOptions,
    bulkResolveDisputes,
    getDisputeStatistics,
  };
}
