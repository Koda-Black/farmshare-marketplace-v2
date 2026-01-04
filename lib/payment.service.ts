import { httpRequest } from "./httpRequest";

export type PaymentMethod = "STRIPE" | "PAYSTACK";

export interface InitPaymentDto {
  method: PaymentMethod;
  poolId: string;
  slots: number;
  waybillWithin: boolean;
  waybillOutside: boolean;
  idempotencyKey?: string;
}

// Actual backend response format
export interface PaymentInitResponse {
  method: "STRIPE" | "PAYSTACK";
  url: string;
  pendingId: string;
  alreadyProcessed?: boolean;
}

// Wrapper for consistent frontend interface
export interface PaymentResponse {
  success: boolean;
  message: string;
  data?: {
    paymentUrl?: string;
    reference?: string;
    sessionId?: string;
    pendingSubscriptionId?: string;
  };
}

export interface PaymentVerification {
  success: boolean;
  status: string;
  message: string;
  data?: {
    status?: string;
    reference?: string;
    amount?: number;
  };
}

export class PaymentService {
  /**
   * Initiate payment for pool subscription
   */
  async initiatePayment(data: InitPaymentDto): Promise<PaymentResponse> {
    try {
      // Generate idempotency key if not provided
      if (!data.idempotencyKey) {
        data.idempotencyKey = `pk_${Date.now()}_${Math.random()
          .toString(36)
          .substring(2, 10)}`;
      }

      const response = await httpRequest.post<PaymentInitResponse>(
        "/payments/pay",
        data
      );

      // Transform backend response to frontend expected format
      return {
        success: true,
        message: "Payment initiated successfully",
        data: {
          paymentUrl: response.url,
          pendingSubscriptionId: response.pendingId,
        },
      };
    } catch (error: any) {
      console.error("Failed to initiate payment:", error);
      throw new Error(
        error.response?.data?.message || "Failed to initiate payment"
      );
    }
  }

  /**
   * Verify Paystack payment status
   */
  async verifyPaystack(reference: string): Promise<PaymentVerification> {
    try {
      const response = await httpRequest.post<PaymentVerification>(
        `/payments/paystack/verify?reference=${reference}`
      );
      return response;
    } catch (error: any) {
      console.error("Failed to verify Paystack payment:", error);
      throw new Error(
        error.response?.data?.message || "Failed to verify payment"
      );
    }
  }

  /**
   * Calculate total cost for pool subscription
   */
  calculateTotalCost(
    pricePerSlot: number,
    slots: number,
    waybillWithin: boolean,
    waybillOutside: boolean,
    homeDeliveryCost?: number
  ): {
    subtotal: number;
    waybillCost: number;
    platformFee: number;
    total: number;
  } {
    const subtotal = pricePerSlot * slots;
    let waybillCost = 0;

    if (waybillWithin && waybillOutside) {
      waybillCost = 15000; // Combined waybill cost
    } else if (waybillWithin) {
      waybillCost = 5000; // Within state waybill
    } else if (waybillOutside) {
      waybillCost = 10000; // Outside state waybill
    }

    const platformFee = subtotal * 0.02; // 2% platform fee
    const total = subtotal + waybillCost + platformFee;

    return {
      subtotal,
      waybillCost,
      platformFee,
      total,
    };
  }
}

export const paymentService = new PaymentService();
