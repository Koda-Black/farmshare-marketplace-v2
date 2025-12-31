import { loadStripe } from '@stripe/stripe-js'
import { v4 as uuidv4 } from 'uuid'
import { httpRequest } from './httpRequest'

export type PaymentMethod = 'STRIPE' | 'PAYSTACK'

export interface InitPaymentDto {
  method: PaymentMethod
  poolId: string
  slots: number
  waybillWithin: boolean
  waybillOutside: boolean
}

export interface PaymentResponse {
  success: boolean
  message: string
  data?: {
    paymentUrl?: string
    reference?: string
    sessionId?: string
    pendingId?: string
    clientSecret?: string
  }
}

export interface PaymentVerification {
  success: boolean
  status: string
  message: string
  data?: {
    status?: string
    reference?: string
    amount?: number
  }
}

// Real pool data from database for Okoro Nnamchi's pools
const mockPools: Record<string, any> = {
  '1': {
    id: '353122fe-f929-479b-a029-44160bfa443a',
    price_per_slot: 45000,
    allow_home_delivery: true,
    home_delivery_cost: 3000,
    vendor_name: 'Okoro Nnamchi',
    product_name: 'Yam Tubers'
  },
  '2': {
    id: 'fe9f9171-f1a2-4aae-a023-c363e5a2ef83',
    price_per_slot: 120000,
    allow_home_delivery: true,
    home_delivery_cost: 5000,
    vendor_name: 'Okoro Nnamchi',
    product_name: 'Healthy Cattle'
  },
  '3': {
    id: 'df76e1c5-0b3a-4a0f-9064-5187c64eceef',
    price_per_slot: 25000,
    allow_home_delivery: true,
    home_delivery_cost: 2000,
    vendor_name: 'Okoro Nnamchi',
    product_name: 'Honey Beans'
  },
  '4': {
    id: 'eb1b655f-292a-4029-82f3-f6b12348047e',
    price_per_slot: 35000,
    allow_home_delivery: true,
    home_delivery_cost: 2500,
    vendor_name: 'Okoro Nnamchi',
    product_name: 'Fresh Crayfish'
  },
  '5': {
    id: '0466a75e-50e3-4611-ad7c-7dbb328e8614',
    price_per_slot: 18000,
    allow_home_delivery: true,
    home_delivery_cost: 1500,
    vendor_name: 'Okoro Nnamchi',
    product_name: 'Fresh Cow Milk'
  }
}

export class EnhancedPaymentService {
  private stripePromise: Promise<any> | null = null

  constructor() {
    // Stripe will be initialized lazily when needed
  }

  private getStripePromise() {
    if (!this.stripePromise) {
      const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      if (stripeKey && stripeKey !== 'pk_test_...' && stripeKey !== 'pk_test_your_stripe_test_public_key_here') {
        this.stripePromise = loadStripe(stripeKey)
      } else {
        console.warn('Stripe publishable key not configured or using placeholder')
        this.stripePromise = Promise.resolve(null)
      }
    }
    return this.stripePromise
  }

  /**
   * Get mock pool data - replace this with actual API call
   */
  private getPoolData(poolId: string) {
    // In production, this would be an API call to fetch real pool data
    return mockPools[poolId] || mockPools['1']
  }

  /**
   * Generate a UUID for pool if not provided
   */
  private ensureUUID(poolId: string): string {
    // Check if it's already a UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (uuidRegex.test(poolId)) {
      return poolId
    }

    // If it's a simple number or string, return a mock UUID
    // In production, you would get the real UUID from your API
    return mockPools[poolId]?.id || uuidv4()
  }

  /**
   * Initiate payment with enhanced flow
   */
  async initiatePayment(data: InitPaymentDto): Promise<PaymentResponse> {
    try {
      // Ensure poolId is a valid UUID
      const validPoolId = this.ensureUUID(data.poolId)

      const paymentData: InitPaymentDto = {
        ...data,
        poolId: validPoolId
      }

      const response = await httpRequest.post<PaymentResponse>('/payments/pay', paymentData)
      return response
    } catch (error: any) {
      console.error('Failed to initiate payment:', error)
      throw new Error(error.response?.data?.message || 'Failed to initiate payment')
    }
  }

  /**
   * Handle Stripe payment with checkout
   */
  async handleStripePayment(sessionId: string): Promise<PaymentVerification> {
    try {
      const stripe = await this.getStripePromise()
      if (!stripe) {
        throw new Error('Stripe not loaded')
      }

      const { error } = await stripe.redirectToCheckout({ sessionId })

      if (error) {
        throw new Error(error.message)
      }

      // This will only execute if redirect fails (which shouldn't happen)
      return {
        success: true,
        status: 'processing',
        message: 'Redirecting to Stripe checkout...'
      }
    } catch (error: any) {
      console.error('Stripe payment failed:', error)
      return {
        success: false,
        status: 'failed',
        message: error.message || 'Stripe payment failed'
      }
    }
  }

  /**
   * Handle Paystack payment with checkout
   */
  async handlePaystackPayment(reference: string): Promise<PaymentVerification> {
    try {
      // For Paystack, we typically redirect to their payment page
      // The backend provides the authorization_url
      const response = await httpRequest.post<PaymentResponse>(`/payments/paystack/verify?reference=${reference}`)

      return {
        success: response.success,
        status: 'processing',
        message: response.message || 'Processing payment...'
      }
    } catch (error: any) {
      console.error('Paystack payment failed:', error)
      return {
        success: false,
        status: 'failed',
        message: error.response?.data?.message || error.message || 'Paystack payment failed'
      }
    }
  }

  /**
   * Create Stripe checkout session on client side (alternative method)
   */
  async createStripeCheckoutSession(paymentData: {
    amount: number
    currency?: string
    customerEmail?: string
    productName: string
    successUrl: string
    cancelUrl: string
  }) {
    try {
      const stripe = await this.getStripePromise()
      if (!stripe) {
        throw new Error('Stripe not loaded')
      }

      // This would typically be handled by your backend
      // For now, we'll use the backend endpoint
      const response = await httpRequest.post('/payments/create-checkout-session', paymentData)
      return response
    } catch (error: any) {
      console.error('Failed to create Stripe session:', error)
      throw new Error(error.response?.data?.message || 'Failed to create checkout session')
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
    subtotal: number
    waybillCost: number
    platformFee: number
    total: number
  } {
    const subtotal = pricePerSlot * slots
    let waybillCost = 0

    if (waybillWithin && waybillOutside) {
      waybillCost = 15000 // Combined waybill cost
    } else if (waybillWithin) {
      waybillCost = 5000 // Within state waybill
    } else if (waybillOutside) {
      waybillCost = 10000 // Outside state waybill
    }

    const platformFee = subtotal * 0.02 // 2% platform fee
    const total = subtotal + waybillCost + platformFee

    return {
      subtotal,
      waybillCost,
      platformFee,
      total,
    }
  }

  /**
   * Format amount for Stripe (in cents)
   */
  formatForStripe(amount: number): number {
    return Math.round(amount * 100)
  }

  /**
   * Format amount for Paystack (in kobo)
   */
  formatForPaystack(amount: number): number {
    return Math.round(amount * 100)
  }
}

export const enhancedPaymentService = new EnhancedPaymentService()