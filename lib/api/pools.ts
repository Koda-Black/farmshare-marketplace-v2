import { httpRequest } from "../httpRequest";

export interface Pool {
  id: string;
  vendorId: string;
  productId: string;
  priceTotal: string;
  slotsCount: number;
  pricePerSlot: string;
  commissionRate: string;
  allowHomeDelivery: boolean;
  homeDeliveryCost: string;
  lockAfterFirstJoin: boolean;
  maxSlots?: number;
  minUnitsConstraint: number;
  timezone?: string;
  deliveryDeadlineUtc?: string;
  filledAt?: string;
  status:
    | "OPEN"
    | "FILLED"
    | "IN_DELIVERY"
    | "COMPLETED"
    | "DISPUTED"
    | "CANCELLED";
  createdAt: string;
  updatedAt: string;
  product: {
    id: string;
    name: string;
    sku: string;
    unit: string;
    allowedUnits?: string[];
    seasonalFlag: boolean;
    description: string;
    imageUrl: string;
    active: boolean;
    adminManaged: boolean;
  };
  vendor: {
    id: string;
    name: string;
    email: string;
  };
  subscriptions: any[];
  takenSlots: number;
  slotsLeft: number;
  fillPercentage: number;
}

export interface PoolsResponse {
  pools: Pool[];
  total: number;
  page: number;
  limit: number;
}

export class PoolsService {
  static async getPools(params?: {
    page?: number;
    limit?: number;
    category?: string;
    status?: string;
    search?: string;
  }): Promise<Pool[]> {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.category) searchParams.set("category", params.category);
    if (params?.status) searchParams.set("status", params.status);
    if (params?.search) searchParams.set("search", params.search);

    const url = `/pools${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;
    return httpRequest.get<Pool[]>(url);
  }

  static async getPoolById(id: string): Promise<Pool> {
    return httpRequest.get<Pool>(`/pools/${id}`);
  }

  static async getMySubscriptions(): Promise<any[]> {
    return httpRequest.get<any[]>("/pools/user/subscriptions");
  }
}
