import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { escrowService } from "@/lib/escrow.service";

/**
 * Hook for user escrow management
 */
export function useUserEscrows() {
  const { user, userEscrows, setUserEscrows, addUserEscrow, updateUserEscrow } = useStore();

  const loading = false;

  const loadUserEscrows = async () => {
    if (!user) return;

    try {
      loading = true;
      const escrows = await escrowService.getUserEscrowHistory();
      setUserEscrows(escrows);
    } catch (error) {
      console.error("Failed to load user escrows:", error);
    } finally {
      loading = false;
    }
  };

  const getEscrowDetails = async (poolId: string) => {
    try {
      const details = await escrowService.getEscrowDetails(poolId);
      // Update the escrow in state if it exists
      updateUserEscrow(poolId, details);
      return details;
    } catch (error) {
      console.error("Failed to get escrow details:", error);
      throw error;
    }
  };

  const getEscrowStatus = async (poolId: string) => {
    try {
      const status = await escrowService.getPoolEscrowStatus(poolId);
      return status;
    } catch (error) {
      console.error("Failed to get escrow status:", error);
      throw error;
    }
  };

  // Auto-load escrows when user is authenticated
  useEffect(() => {
    if (user) {
      loadUserEscrows();
    }
  }, [user?.id]);

  return {
    userEscrows,
    loading,
    loadUserEscrows,
    getEscrowDetails,
    getEscrowStatus,
  };
}

/**
 * Hook for vendor escrow management
 */
export function useVendorEscrows() {
  const { user, vendorEscrows, setVendorEscrows, userEscrows, setUserEscrows } = useStore();

  const loading = false;

  const loadVendorEscrows = async () => {
    if (!user || user.role !== 'vendor') return;

    try {
      loading = true;
      // For vendors, we load their pool escrows through the escrow service
      // This would typically be pools created by this vendor
      const pools = await escrowService.getUserPools();
      const escrowDetails = await Promise.all(
        pools.map(async (pool) => {
          try {
            return await escrowService.getEscrowDetails(pool.id);
          } catch (error) {
            console.error(`Failed to load escrow for pool ${pool.id}:`, error);
            return null;
          }
        })
      );

      const validEscrows = escrowDetails.filter(Boolean);
      setVendorEscrows(validEscrows);
    } catch (error) {
      console.error("Failed to load vendor escrows:", error);
    } finally {
      loading = false;
    }
  };

  const releaseEscrow = async (poolId: string, reason?: string) => {
    try {
      const result = await escrowService.releaseEscrow({ poolId, reason });

      // Update the escrow in both vendor and user escrows
      const updatedDetails = await escrowService.getEscrowDetails(poolId);
      setVendorEscrows(prev =>
        prev.map(e => e.pool.id === poolId ? updatedDetails : e)
      );
      setUserEscrows(prev =>
        prev.map(e => e.pool.id === poolId ? updatedDetails : e)
      );

      return result;
    } catch (error) {
      console.error("Failed to release escrow:", error);
      throw error;
    }
  };

  const manualRelease = async (data: { poolId: string; amount: number; reason: string }) => {
    try {
      const result = await escrowService.manualRelease(data);

      // Refresh the escrow details
      const updatedDetails = await escrowService.getEscrowDetails(data.poolId);
      setVendorEscrows(prev =>
        prev.map(e => e.pool.id === data.poolId ? updatedDetails : e)
      );

      return result;
    } catch (error) {
      console.error("Failed to perform manual release:", error);
      throw error;
    }
  };

  // Auto-load vendor escrows when vendor is authenticated
  useEffect(() => {
    if (user && user.role === 'vendor') {
      loadVendorEscrows();
    }
  }, [user?.id]);

  return {
    vendorEscrows,
    loading,
    loadVendorEscrows,
    releaseEscrow,
    manualRelease,
  };
}

/**
 * Hook for pool and subscription management (integrated with escrow)
 */
export function usePoolManagement() {
  const { user, pools, setPools, addPool, updatePool } = useStore();

  const loading = { pools: false, creating: false, updating: false };

  const loadAvailablePools = async (params?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    location?: string;
    page?: number;
    limit?: number;
  }) => {
    try {
      loading.pools = true;
      const data = await escrowService.getAvailablePools(params);
      setPools(data.pools);
    } catch (error) {
      console.error("Failed to load pools:", error);
    } finally {
      loading.pools = false;
    }
  };

  const loadUserPools = async () => {
    if (!user) return;

    try {
      loading.pools = true;
      const userPools = await escrowService.getUserPools();
      setPools(userPools);
    } catch (error) {
      console.error("Failed to load user pools:", error);
    } finally {
      loading.pools = false;
    }
  };

  const getPoolDetails = async (poolId: string) => {
    try {
      const pool = await escrowService.getPoolDetails(poolId);
      // Update pool in state if it exists
      updatePool(poolId, pool);
      return pool;
    } catch (error) {
      console.error("Failed to get pool details:", error);
      throw error;
    }
  };

  const createPool = async (data: {
    productId: string;
    pricePerSlot: number;
    slotsCount: number;
    allowHomeDelivery: boolean;
    deliveryDeadlineUtc: string;
  }) => {
    if (!user || user.role !== 'vendor') {
      throw new Error("Only vendors can create pools");
    }

    try {
      loading.creating = true;
      const newPool = await escrowService.createPool(data);
      addPool(newPool);
      return newPool;
    } catch (error) {
      console.error("Failed to create pool:", error);
      throw error;
    } finally {
      loading.creating = false;
    }
  };

  const updatePool = async (poolId: string, data: Partial<any>) => {
    if (!user || user.role !== 'vendor') {
      throw new Error("Only vendors can update pools");
    }

    try {
      loading.updating = true;
      const updatedPool = await escrowService.updatePool(poolId, data);
      updatePool(poolId, updatedPool);
      return updatedPool;
    } catch (error) {
      console.error("Failed to update pool:", error);
      throw error;
    } finally {
      loading.updating = false;
    }
  };

  const cancelPool = async (poolId: string, reason: string) => {
    if (!user || user.role !== 'vendor') {
      throw new Error("Only vendors can cancel pools");
    }

    try {
      await escrowService.cancelPool(poolId, reason);
      // Update pool status in state
      updatePool(poolId, { status: 'CANCELLED' });
    } catch (error) {
      console.error("Failed to cancel pool:", error);
      throw error;
    }
  };

  // Auto-load pools when user is authenticated
  useEffect(() => {
    if (user) {
      if (user.role === 'vendor') {
        loadUserPools();
      } else {
        loadAvailablePools();
      }
    }
  }, [user?.id, user?.role]);

  return {
    pools,
    loading,
    loadAvailablePools,
    loadUserPools,
    getPoolDetails,
    createPool,
    updatePool,
    cancelPool,
  };
}

/**
 * Hook for subscription management
 */
export function useSubscriptions() {
  const { user } = useStore();

  const loading = false;

  const getUserSubscriptions = async () => {
    if (!user) return [];

    try {
      loading = true;
      const subscriptions = await escrowService.getUserSubscriptions();
      return subscriptions;
    } catch (error) {
      console.error("Failed to load user subscriptions:", error);
      return [];
    } finally {
      loading = false;
    }
  };

  const getSubscriptionDetails = async (subscriptionId: string) => {
    try {
      const subscription = await escrowService.getSubscriptionDetails(subscriptionId);
      return subscription;
    } catch (error) {
      console.error("Failed to get subscription details:", error);
      throw error;
    }
  };

  const cancelSubscription = async (subscriptionId: string, reason: string) => {
    try {
      const result = await escrowService.cancelSubscription(subscriptionId, reason);
      return result;
    } catch (error) {
      console.error("Failed to cancel subscription:", error);
      throw error;
    }
  };

  return {
    loading,
    getUserSubscriptions,
    getSubscriptionDetails,
    cancelSubscription,
  };
}