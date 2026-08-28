export interface Coupon {
  id: string
  name: string
  discount: string
  appliesTo: string
  conditions: string
  validFrom: string | null
  validUntil: string
  createdAt: string
}
