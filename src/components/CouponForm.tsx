import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Coupon } from '../types'
import { newId } from '../lib/storage'

interface Props {
  initial: Coupon | null
  onSubmit: (coupon: Coupon) => void
  onCancel: () => void
}

export default function CouponForm({ initial, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? '')
  const [discount, setDiscount] = useState(initial?.discount ?? '')
  const [appliesTo, setAppliesTo] = useState(initial?.appliesTo ?? '')
  const [conditions, setConditions] = useState(initial?.conditions ?? '')
  const [validFrom, setValidFrom] = useState(initial?.validFrom ?? '')
  const [validUntil, setValidUntil] = useState(initial?.validUntil ?? '')
  const [error, setError] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Le nom est obligatoire.')
      return
    }
    if (!discount.trim()) {
      setError('La réduction est obligatoire.')
      return
    }
    if (!validUntil) {
      setError("La date d'expiration est obligatoire.")
      return
    }
    if (validFrom && validFrom > validUntil) {
      setError('La date de début doit précéder la date d’expiration.')
      return
    }
    onSubmit({
      id: initial?.id ?? newId(),
      name: name.trim(),
      discount: discount.trim(),
      appliesTo: appliesTo.trim(),
      conditions: conditions.trim(),
      validFrom: validFrom || null,
      validUntil,
      createdAt: initial?.createdAt ?? new Date().toISOString(),
    })
    if (!initial) {
      setName('')
      setDiscount('')
      setAppliesTo('')
      setConditions('')
      setValidFrom('')
      setValidUntil('')
    }
    setError('')
  }

  return (
    <form className="coupon-form" onSubmit={handleSubmit}>
      <h2>{initial ? 'Modifier le coupon' : 'Ajouter un coupon'}</h2>
      <div className="field">
        <label htmlFor="name">Nom *</label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex : Coupon Fnac"
        />
      </div>
      <div className="field">
        <label htmlFor="discount">Réduction *</label>
        <input
          id="discount"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          placeholder="Ex : -20 % ou 5 € offerts"
        />
      </div>
      <div className="field">
        <label htmlFor="appliesTo">Valable sur</label>
        <input
          id="appliesTo"
          value={appliesTo}
          onChange={(e) => setAppliesTo(e.target.value)}
          placeholder="Ex : tout le magasin, hors promos"
        />
      </div>
      <div className="field">
        <label htmlFor="conditions">Conditions</label>
        <textarea
          id="conditions"
          value={conditions}
          onChange={(e) => setConditions(e.target.value)}
          placeholder="Ex : minimum 30 € d’achat, non cumulable"
          rows={2}
        />
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor="validFrom">Valable à partir du</label>
          <input
            id="validFrom"
            type="date"
            value={validFrom}
            onChange={(e) => setValidFrom(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="validUntil">Expire le *</label>
          <input
            id="validUntil"
            type="date"
            value={validUntil}
            onChange={(e) => setValidUntil(e.target.value)}
          />
        </div>
      </div>
      {error && <p className="form-error">{error}</p>}
      <div className="form-actions">
        <button type="submit">{initial ? 'Enregistrer' : 'Ajouter'}</button>
        {initial && (
          <button type="button" className="secondary" onClick={onCancel}>
            Annuler
          </button>
        )}
      </div>
    </form>
  )
}
