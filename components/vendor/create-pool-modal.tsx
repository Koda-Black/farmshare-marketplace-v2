"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Info, Calculator } from "lucide-react"
import { useStore } from "@/lib/store"

interface CreatePoolModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreatePoolModal({ open, onOpenChange }: CreatePoolModalProps) {
  const addPool = useStore((state) => state.addPool)
  const user = useStore((state) => state.user)

  const [formData, setFormData] = useState({
    product: "",
    description: "",
    slots_count: 10,
    price_total: 0,
    allow_home_delivery: false,
    home_delivery_cost: 0,
    delivery_days: 7,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const pricePerSlot = formData.price_total / formData.slots_count || 0
  const platformFee = formData.price_total * 0.05
  const paystackFee = formData.price_total * 0.015 + 100
  const netPayout = formData.price_total - platformFee - paystackFee

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const newPool = {
        id: `pool_${Date.now()}`,
        vendor_id: user?.id || "",
        product_name: formData.product,
        product_description: formData.description,
        slots_count: formData.slots_count,
        slots_filled: 0,
        price_total: formData.price_total,
        price_per_slot: pricePerSlot,
        allow_home_delivery: formData.allow_home_delivery,
        home_delivery_cost: formData.home_delivery_cost,
        delivery_deadline: new Date(Date.now() + formData.delivery_days * 24 * 60 * 60 * 1000).toISOString(),
        status: "active" as const,
        created_at: new Date().toISOString(),
      }

      addPool(newPool)
      onOpenChange(false)

      // Reset form
      setFormData({
        product: "",
        description: "",
        slots_count: 10,
        price_total: 0,
        allow_home_delivery: false,
        home_delivery_cost: 0,
        delivery_days: 7,
      })
    } catch (error) {
      console.error("Failed to create pool:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Pool</DialogTitle>
          <DialogDescription>Set up a new buying pool for your agricultural products</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Product Selection */}
            <div className="space-y-2">
              <Label htmlFor="product">Product</Label>
              <Select value={formData.product} onValueChange={(value) => setFormData({ ...formData, product: value })}>
                <SelectTrigger id="product">
                  <SelectValue placeholder="Select product from catalog" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Premium Rice">Premium Rice - 50kg bags</SelectItem>
                  <SelectItem value="Organic Tomatoes">Organic Tomatoes - 25kg crates</SelectItem>
                  <SelectItem value="Yellow Maize">Yellow Maize - 100kg bags</SelectItem>
                  <SelectItem value="White Beans">White Beans - 50kg bags</SelectItem>
                  <SelectItem value="Palm Oil">Palm Oil - 25L containers</SelectItem>
                  <SelectItem value="Cassava Flour">Cassava Flour - 50kg bags</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Product Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the product quality, origin, and any special features..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                required
              />
            </div>

            {/* Slots and Pricing */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="slots">Number of Slots</Label>
                <Input
                  id="slots"
                  type="number"
                  min="2"
                  max="100"
                  value={formData.slots_count}
                  onChange={(e) => setFormData({ ...formData, slots_count: Number.parseInt(e.target.value) || 0 })}
                  required
                />
                <p className="text-xs text-muted-foreground">How many buyers can join this pool</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Total Price (₦)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="100"
                  value={formData.price_total}
                  onChange={(e) => setFormData({ ...formData, price_total: Number.parseFloat(e.target.value) || 0 })}
                  required
                />
                <p className="text-xs text-muted-foreground">Total value of the pool</p>
              </div>
            </div>

            {/* Price Breakdown */}
            {formData.price_total > 0 && (
              <Alert>
                <Calculator className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between font-medium">
                      <span>Price per slot:</span>
                      <span className="text-primary">₦{pricePerSlot.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Platform fee (5%):</span>
                      <span>-₦{platformFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Payment processing (~1.5%):</span>
                      <span>-₦{paystackFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-semibold pt-2 border-t">
                      <span>Your payout:</span>
                      <span className="text-success">₦{netPayout.toLocaleString()}</span>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Delivery Options */}
            <div className="space-y-4 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="home-delivery">Allow Home Delivery</Label>
                  <p className="text-xs text-muted-foreground">Buyers can choose to have products delivered</p>
                </div>
                <Switch
                  id="home-delivery"
                  checked={formData.allow_home_delivery}
                  onCheckedChange={(checked) => setFormData({ ...formData, allow_home_delivery: checked })}
                />
              </div>

              {formData.allow_home_delivery && (
                <div className="space-y-2">
                  <Label htmlFor="delivery-cost">Delivery Cost per Slot (₦)</Label>
                  <Input
                    id="delivery-cost"
                    type="number"
                    min="0"
                    step="100"
                    value={formData.home_delivery_cost}
                    onChange={(e) =>
                      setFormData({ ...formData, home_delivery_cost: Number.parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
              )}
            </div>

            {/* Delivery Deadline */}
            <div className="space-y-2">
              <Label htmlFor="delivery-days">Delivery Timeline</Label>
              <Select
                value={formData.delivery_days.toString()}
                onValueChange={(value) => setFormData({ ...formData, delivery_days: Number.parseInt(value) })}
              >
                <SelectTrigger id="delivery-days">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 days</SelectItem>
                  <SelectItem value="5">5 days</SelectItem>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="10">10 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Proposed delivery timeline after pool fills (can be adjusted at fulfillment)
              </p>
            </div>

            {/* Info Alert */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="text-xs">
                <strong>Note:</strong> You must be verified and have a verified bank account to create pools. Products
                must be from the approved catalog. Pools cannot be deleted once buyers have joined.
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.product || !formData.description || formData.price_total <= 0}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Pool"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
