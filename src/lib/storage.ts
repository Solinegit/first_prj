import type { Coupon } from '../types'

const KEY = 'coupon-manager:v1'

export function loadCoupons(): Coupon[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as Coupon[]) : []
  } catch {
    return []
  }
}

export function saveCoupons(coupons: Coupon[]): void {
  localStorage.setItem(KEY, JSON.stringify(coupons))
}

export function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}
