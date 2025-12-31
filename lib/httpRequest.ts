import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { useStore } from "@/lib/store";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8282";

class HttpRequest {
  private client: AxiosInstance;
  private isRefreshing = false;
  private refreshQueue: ((token: string) => void)[] = [];

  get baseURL() {
    return BASE_URL;
  }

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    // 🔹 Attach JWT token from Zustand - prioritize user token for payments
    this.client.interceptors.request.use((config) => {
      // For payment endpoints, always prioritize user token
      if (config.url?.includes('/payments/')) {
        let userToken = useStore.getState().user?.accessToken;

        // If no user token in state, try to restore from persisted storage
        if (!userToken && typeof window !== "undefined") {
          try {
            const persistedState = localStorage.getItem('farmshare-storage');
            if (persistedState) {
              const parsedState = JSON.parse(persistedState);
              const persistedUser = parsedState.state?.user;
              if (persistedUser && persistedUser.accessToken) {
                userToken = persistedUser.accessToken;
                // Restore the state in Zustand
                useStore.setState({ user: persistedUser });
              }
            }
          } catch (error) {
            console.warn("Failed to restore user token from persisted storage:", error);
          }
        }

        if (userToken) {
          config.headers.Authorization = `Bearer ${userToken}`;
          console.log('Using user token for payment request:', !!userToken);
        } else {
          console.warn('No user token available for payment request');
        }
        return config;
      }

      // For other endpoints, prioritize admin token
      let adminToken = useStore.getState().admin?.accessToken;

      // If no admin token in state, try to restore from persisted storage
      if (!adminToken && typeof window !== "undefined") {
        try {
          const persistedState = localStorage.getItem('farmshare-storage');
          if (persistedState) {
            const parsedState = JSON.parse(persistedState);
            const persistedAdmin = parsedState.state?.admin;
            if (persistedAdmin && persistedAdmin.accessToken) {
              adminToken = persistedAdmin.accessToken;
              // Optionally restore the state in Zustand
              useStore.getState().setAdmin(persistedAdmin);
            }
          }
        } catch (error) {
          console.warn("Failed to restore admin token from persisted storage:", error);
        }
      }

      if (adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`;
        return config;
      }

      const userToken = useStore.getState().user?.accessToken;
      if (userToken) {
        config.headers.Authorization = `Bearer ${userToken}`;
      }

      // No demo mode - production ready authentication

      return config;
    });

    // 🔹 Handle expired tokens automatically
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & {
          _retry?: boolean;
        };

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const newToken = await this.refreshToken();
            if (newToken) {
              // Retry failed request with new token
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.client(originalRequest);
            }
          } catch (err) {
            // If refresh fails, check if this was an admin request and logout accordingly
            const adminToken = useStore.getState().admin?.accessToken;
            if (adminToken) {
              useStore.getState().adminLogout();
            } else {
              useStore.getState().logout();
            }
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // 🔹 Refresh access token using stored refresh token
  private async refreshToken(): Promise<string | null> {
    if (this.isRefreshing) {
      return new Promise((resolve) => this.refreshQueue.push(resolve));
    }

    this.isRefreshing = true;

    // Check for admin refresh token first, then user token
    const adminRefreshToken = useStore.getState().admin?.refreshToken;
    const userRefreshToken = useStore.getState().user?.refreshToken;

    const refreshToken = adminRefreshToken || userRefreshToken;
    const isAdmin = !!adminRefreshToken;

    if (!refreshToken) {
      this.isRefreshing = false;
      return null;
    }

    try {
      const response = await this.client.post<{ accessToken: string }>(
        "/auth/refresh",
        { refreshToken }
      );
      const newAccessToken = response.data.accessToken;

      if (isAdmin) {
        const admin = useStore.getState().admin;
        if (admin) {
          useStore.setState({ admin: { ...admin, accessToken: newAccessToken } });
        }
      } else {
        const user = useStore.getState().user;
        if (user) {
          useStore.setState({ user: { ...user, accessToken: newAccessToken } });
        }
      }

      // Resolve queued requests
      this.refreshQueue.forEach((cb) => cb(newAccessToken));
      this.refreshQueue = [];

      return newAccessToken;
    } catch (error) {
      // Logout based on token type
      if (isAdmin) {
        useStore.getState().adminLogout();
      } else {
        useStore.getState().logout();
      }
      return null;
    } finally {
      this.isRefreshing = false;
    }
  }

  // 🔹 Method to set admin token for admin requests
  setAdminToken(token: string) {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // 🔹 Clear admin token
  clearAdminToken() {
    delete this.client.defaults.headers.common['Authorization'];
  }

  // 🔹 Generic CRUD methods
  async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(endpoint, config);
    return response.data;
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(
      endpoint,
      data,
      config
    );
    return response.data;
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(
      endpoint,
      data,
      config
    );
    return response.data;
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.client.patch(
      endpoint,
      data,
      config
    );
    return response.data;
  }

  async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(
      endpoint,
      config
    );
    return response.data;
  }

  // 🔹 Organized endpoints
  endpoints = {
    auth: {
      signupBuyer: "/auth/signup/buyer",
      signupVendor: "/auth/signup/vendor",
      login: "/auth/login",
      verifyOtp: "/auth/verify-otp",
      resendOtp: "/auth/resend-otp",
      forgotPassword: "/auth/forgot-password",
      resetPassword: "/auth/reset-password",
      google: "/auth/google",
      googleCallback: "/auth/google/callback",
      profile: "/auth/profile",
      refresh: "/auth/refresh",
    },
    pools: {
      list: "/pools",
      create: "/pools",
      single: (id: string) => `/pools/${id}`,
    },
    users: {
      me: "/users/me",
      update: (id: string) => `/users/${id}`,
    },
    notifications: {
      all: "/notifications",
      markAsRead: (id: string) => `/notifications/${id}/read`,
      delete: (id: string) => `/notifications/${id}`,
    },
    verification: {
      // Main verification flow
      start: "/verification/start",
      submit: "/verification/submit",
      status: "/verification/status",

      // Individual verification services
      bank: "/verification/bank",
      banks: "/verification/banks",
      face: "/verification/face",
      documentOcr: "/verification/document/ocr",
      cac: "/verification/cac",

      // Health check
      health: "/verification/health",

      // Admin endpoints
      adminOverride: "/verification/admin/override",
      adminPending: "/verification/admin/pending",
    },
  };
}

export const httpRequest = new HttpRequest();
