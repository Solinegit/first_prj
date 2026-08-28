import { useEffect, useMemo, useState } from 'react'
import type { Coupon } from './types'
import { loadCoupons, saveCoupons } from './lib/storage'
import { addDaysISO, isValidOn, todayISO } from './lib/dates'
import CouponForm from './components/CouponForm'
import CouponList from './components/CouponList'
import Calendar from './components/Calendar'

export default function App() {
  const [coupons, setCoupons] = useState<Coupon[]>(() => loadCoupons())
  const [editing, setEditing] = useState<Coupon | null>(null)

  useEffect(() => {
    saveCoupons(coupons)
  }, [coupons])

  const today = todayISO()

  const addOrUpdate = (coupon: Coupon) => {
    setCoupons((prev) => {
      const exists = prev.some((c) => c.id === coupon.id)
      return exists
        ? prev.map((c) => (c.id === coupon.id ? coupon : c))
        : [...prev, coupon]
    })
    setEditing(null)
  }

  const remove = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id))
    if (editing?.id === id) setEditing(null)
  }

  const stats = useMemo(() => {
    const active = coupons.filter((c) => isValidOn(c, today))
    const expiring = coupons.filter(
      (c) => c.validUntil >= today && c.validUntil <= addDaysISO(today, 7),
    )
    const expired = coupons.filter((c) => c.validUntil < today)
    return { active: active.length, expiring: expiring.length, expired: expired.length }
  }, [coupons, today])

  return (
    <div className="app">
      <header className="app-header">
        <h1>Mes coupons</h1>
        <p className="subtitle">
          {coupons.length} coupon{coupons.length > 1 ? 's' : ''} · {stats.active} actif
          {stats.active > 1 ? 's' : ''} · {stats.expiring} expire
          {stats.expiring > 1 ? 'nt' : ''} bientôt · {stats.expired} expiré
          {stats.expired > 1 ? 's' : ''}
        </p>
      </header>
      <main className="layout">
        <section className="panel">
          <CouponForm
            key={editing?.id ?? 'new'}
            initial={editing}
            onSubmit={addOrUpdate}
            onCancel={() => setEditing(null)}
          />
          <CouponList
            coupons={coupons}
            today={today}
            onEdit={setEditing}
            onDelete={remove}
          />
        </section>
        <section className="panel">
          <Calendar coupons={coupons} today={today} />
        </section>
      </main>
    </div>
  )
}
