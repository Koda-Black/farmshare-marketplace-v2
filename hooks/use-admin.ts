import { useEffect } from "react";
import Cookies from "js-cookie";
import { useStore } from "@/lib/store";
import { adminService } from "@/lib/admin.service";

/**
 * Hook for admin authentication
 */
export function useAdminAuth() {
  const { admin, isAdminAuthenticated, setAdmin, adminLogout } = useStore();

  // Initialize admin auth state from cookies on mount
  useEffect(() => {
    if (typeof window !== "undefined" && !isAdminAuthenticated && !admin) {
      try {
        const adminAuthCookie = Cookies.get("farmshare-admin-auth");
        if (adminAuthCookie) {
          const adminAuthData = JSON.parse(adminAuthCookie);
          if (adminAuthData.isAdminAuthenticated) {
            // Try to restore from Zustand persisted storage first
            const persistedState = localStorage.getItem('farmshare-storage');
            if (persistedState) {
              try {
                const parsedState = JSON.parse(persistedState);
                const persistedAdmin = parsedState.state?.admin;
                if (persistedAdmin && persistedAdmin.accessToken) {
                  // Restore full admin data from persisted storage
                  setAdmin(persistedAdmin);
                  return;
                }
              } catch (persistError) {
                console.warn("Failed to restore from persisted storage:", persistError);
              }
            }

            // Fallback: restore minimal admin state from cookie
            // This will allow the page to load, but API calls may fail
            // until the user re-authenticates
            setAdmin({
              id: "restored",
              email: "",
              name: "Admin",
              role: "admin",
              isAdmin: true,
              mfaEnabled: false,
              createdAt: new Date().toISOString(),
              isAuthenticated: true,
            });
          }
        }
      } catch (error) {
        console.error("Failed to restore admin auth from cookies:", error);
        // Clear invalid cookie
        Cookies.remove("farmshare-admin-auth", { path: "/" });
      }
    }
  }, [admin, isAdminAuthenticated, setAdmin]);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await adminService.adminLogin(credentials);

      // Only set admin state if login is successful (not MFA required)
      if (!response.requiresMfa && response.admin && response.accessToken) {
        const adminData = {
          ...response.admin,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          isAuthenticated: true,
        };
        setAdmin(adminData);

        // Set admin cookie for middleware
        Cookies.set("farmshare-admin-auth", JSON.stringify({
          isAdminAuthenticated: true,
          admin: { role: "admin" }
        }), {
          path: "/",
          expires: 7 // 7 days
        });
      }

      return response;
    } catch (error) {
      throw error;
    }
  };

  const verifyMfa = async (token: string) => {
    try {
      const response = await adminService.verifyMfaLogin({
        email: admin?.email || "",
        token,
      });

      if (response.admin && response.accessToken) {
        const adminData = {
          ...response.admin,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          isAuthenticated: true,
        };
        setAdmin(adminData);

        // Set admin cookie for middleware
        Cookies.set("farmshare-admin-auth", JSON.stringify({
          isAdminAuthenticated: true,
          admin: { role: "admin" }
        }), {
          path: "/",
          expires: 7 // 7 days
        });
      }

      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    // Clear admin cookie
    Cookies.remove("farmshare-admin-auth", { path: "/" });
    adminLogout();
    adminService.adminLogout();
  };

  return {
    admin,
    isAdminAuthenticated,
    login,
    verifyMfa,
    logout,
  };
}

/**
 * Hook for admin dashboard data
 */
export function useAdminDashboard() {
  const {
    adminDashboard,
    pendingVerifications,
    managedUsers,
    managedDisputes,
    disputeStats,
    isAdminAuthenticated,
    setAdminDashboard,
    setPendingVerifications,
    setManagedUsers,
    setManagedDisputes,
    setDisputeStats
  } = useStore();

  const loading = { dashboard: false, verifications: false, users: false, disputes: false };

  const loadDashboard = async () => {
    try {
      loading.dashboard = true;
      const data = await adminService.getDashboardStats();
      setAdminDashboard(data);
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    } finally {
      loading.dashboard = false;
    }
  };

  const loadPendingVerifications = async (params?: { page?: number; limit?: number; status?: string }) => {
    try {
      loading.verifications = true;
      const data = await adminService.getPendingVerifications(params);
      setPendingVerifications(data.verifications);
    } catch (error) {
      console.error("Failed to load pending verifications:", error);
    } finally {
      loading.verifications = false;
    }
  };

  const loadUsers = async (params?: { search?: string; role?: string; isVerified?: boolean; page?: number; limit?: number }) => {
    try {
      loading.users = true;
      const data = await adminService.searchUsers(params);
      setManagedUsers(data.users);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      loading.users = false;
    }
  };

  const loadDisputes = async (params?: { page?: number; limit?: number; status?: string }) => {
    try {
      loading.disputes = true;
      const data = await adminService.getDisputes(params);
      setManagedDisputes(data.disputes);
    } catch (error) {
      console.error("Failed to load disputes:", error);
    } finally {
      loading.disputes = false;
    }
  };

  const approveVerification = async (verificationId: string, notes?: string) => {
    try {
      await adminService.approveVerification({ verificationId, notes });
      // Refresh pending verifications
      await loadPendingVerifications();
    } catch (error) {
      console.error("Failed to approve verification:", error);
      throw error;
    }
  };

  const rejectVerification = async (verificationId: string, reason: string, feedback?: string) => {
    try {
      await adminService.rejectVerification({ verificationId, reason, feedback });
      // Refresh pending verifications
      await loadPendingVerifications();
    } catch (error) {
      console.error("Failed to reject verification:", error);
      throw error;
    }
  };

  const banUser = async (userId: string, reason: string) => {
    try {
      await adminService.banUser({ userId, reason });
      // Refresh users
      await loadUsers();
    } catch (error) {
      console.error("Failed to ban user:", error);
      throw error;
    }
  };

  const unbanUser = async (userId: string) => {
    try {
      await adminService.unbanUser({ userId });
      // Refresh users
      await loadUsers();
    } catch (error) {
      console.error("Failed to unban user:", error);
      throw error;
    }
  };

  const resolveDispute = async (data: { disputeId: string; action: 'refund' | 'release' | 'split'; distribution?: Record<string, number>; resolutionNotes?: string }) => {
    try {
      await adminService.resolveDispute(data);
      // Refresh disputes
      await loadDisputes();
    } catch (error) {
      console.error("Failed to resolve dispute:", error);
      throw error;
    }
  };

  // Auto-load dashboard data when admin is authenticated
  useEffect(() => {
    if (isAdminAuthenticated) {
      loadDashboard();
    }
  }, [isAdminAuthenticated]);

  return {
    adminDashboard,
    pendingVerifications,
    managedUsers,
    managedDisputes,
    disputeStats,
    loading,
    loadDashboard,
    loadPendingVerifications,
    loadUsers,
    loadDisputes,
    approveVerification,
    rejectVerification,
    banUser,
    unbanUser,
    resolveDispute,
  };
}

/**
 * Hook for admin MFA management
 */
export function useAdminMfa() {
  const { admin, setAdmin } = useStore();

  const enableMfa = async () => {
    try {
      const response = await adminService.enableMfa();
      return response;
    } catch (error) {
      console.error("Failed to enable MFA:", error);
      throw error;
    }
  };

  const confirmEnableMfa = async (token: string) => {
    try {
      await adminService.confirmEnableMfa(token);
      // Update admin state to reflect MFA enabled
      if (admin) {
        setAdmin({ ...admin, mfaEnabled: true });
      }
    } catch (error) {
      console.error("Failed to confirm MFA setup:", error);
      throw error;
    }
  };

  const disableMfa = async (token: string) => {
    try {
      await adminService.disableMfa(token);
      // Update admin state to reflect MFA disabled
      if (admin) {
        setAdmin({ ...admin, mfaEnabled: false });
      }
    } catch (error) {
      console.error("Failed to disable MFA:", error);
      throw error;
    }
  };

  return {
    enableMfa,
    confirmEnableMfa,
    disableMfa,
  };
}