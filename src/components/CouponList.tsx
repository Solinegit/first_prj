import type { Coupon } from '../types'
import { daysUntil, formatDateFR, isValidOn } from '../lib/dates'

interface Props {
  coupons: Coupon[]
  today: string
  onEdit: (coupon: Coupon) => void
  onDelete: (id: string) => void
}

type Status = 'expired' | 'expiring' | 'active'

function statusOf(coupon: Coupon, today: string): Status {
  if (coupon.validUntil < today) return 'expired'
  if (daysUntil(coupon.validUntil, today) <= 7) return 'expiring'
  return 'active'
}

const STATUS_LABEL: Record<Status, string> = {
  expired: 'Expiré',
  expiring: 'Expire bientôt',
  active: 'Valide',
}

export default function CouponList({ coupons, today, onEdit, onDelete }: Props) {
  const sorted = [...coupons].sort((a, b) => a.validUntil.localeCompare(b.validUntil))

  if (sorted.length === 0) {
    return (
      <p className="empty">
        Aucun coupon pour l’instant. Ajoutez-en un avec le formulaire ci-dessus.
      </p>
    )
  }

  return (
    <ul className="coupon-list">
      {sorted.map((coupon) => {
        const status = statusOf(coupon, today)
        return (
          <li key={coupon.id} className={`coupon-item status-${status}`}>
            <div className="coupon-main">
              <div className="coupon-title">
                <span className="coupon-name">{coupon.name}</span>
                <span className="badge discount">{coupon.discount}</span>
                <span className={`badge status-${status}`}>{STATUS_LABEL[status]}</span>
              </div>
              {coupon.appliesTo && (
                <p className="coupon-detail">Valable sur : {coupon.appliesTo}</p>
              )}
              {coupon.conditions && (
                <p className="coupon-detail">Conditions : {coupon.conditions}</p>
              )}
              <p className="coupon-detail">
                {coupon.validFrom ? `${formatDateFR(coupon.validFrom)} → ` : ''}
                jusqu’au {formatDateFR(coupon.validUntil)}
                {isValidOn(coupon, today) ? '' : ' (non valide aujourd’hui)'}
              </p>
            </div>
            <div className="coupon-actions">
              <button className="secondary" onClick={() => onEdit(coupon)}>
                Modifier
              </button>
              <button className="danger" onClick={() => onDelete(coupon.id)}>
                Supprimer
              </button>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
