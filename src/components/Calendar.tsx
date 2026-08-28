import { useMemo, useState } from 'react'
import type { Coupon } from '../types'
import {
  WEEKDAYS_FR,
  formatDateFR,
  getMonthGrid,
  isValidOn,
  monthLabel,
} from '../lib/dates'

interface Props {
  coupons: Coupon[]
  today: string
}

export default function Calendar({ coupons, today }: Props) {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [selectedDay, setSelectedDay] = useState<string | null>(today)

  const cells = useMemo(() => getMonthGrid(year, month), [year, month])

  const byDay = useMemo(() => {
    const map = new Map<string, Coupon[]>()
    for (const cell of cells) {
      const list = coupons.filter((c) => isValidOn(c, cell))
      if (list.length > 0) map.set(cell, list)
    }
    return map
  }, [cells, coupons])

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11)
      setYear((y) => y - 1)
    } else {
      setMonth((m) => m - 1)
    }
  }

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0)
      setYear((y) => y + 1)
    } else {
      setMonth((m) => m + 1)
    }
  }

  const goToday = () => {
    setYear(now.getFullYear())
    setMonth(now.getMonth())
    setSelectedDay(today)
  }

  const selectedCoupons = selectedDay ? (byDay.get(selectedDay) ?? []) : []

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button className="secondary" onClick={prevMonth} aria-label="Mois précédent">
          ‹
        </button>
        <h2>{monthLabel(year, month)}</h2>
        <button className="secondary" onClick={nextMonth} aria-label="Mois suivant">
          ›
        </button>
      </div>
      <button className="link" onClick={goToday}>
        Aujourd’hui
      </button>
      <div className="calendar-grid">
        {WEEKDAYS_FR.map((d) => (
          <div key={d} className="weekday">
            {d}
          </div>
        ))}
        {cells.map((cell) => {
          const list = byDay.get(cell) ?? []
          const isToday = cell === today
          const isSelected = cell === selectedDay
          return (
            <button
              key={cell}
              className={`day${isToday ? ' today' : ''}${isSelected ? ' selected' : ''}`}
              onClick={() => setSelectedDay(cell)}
            >
              <span className="day-number">{Number(cell.slice(8))}</span>
              {list.length > 0 && (
                <span className="dots">
                  {list.slice(0, 3).map((c) => (
                    <span
                      key={c.id}
                      className="dot"
                      title={`${c.name} (${c.discount})`}
                    />
                  ))}
                  {list.length > 3 && <span className="more">+{list.length - 3}</span>}
                </span>
              )}
            </button>
          )
        })}
      </div>
      <div className="day-detail">
        <h3>
          {selectedDay
            ? `Coupons valids le ${formatDateFR(selectedDay)}`
            : 'Sélectionnez un jour'}
        </h3>
        {selectedCoupons.length === 0 ? (
          <p className="empty">Aucun coupon valide ce jour-là.</p>
        ) : (
          <ul>
            {selectedCoupons.map((c) => (
              <li key={c.id}>
                <strong>{c.name}</strong> — {c.discount}
                {c.appliesTo && <span className="muted"> · {c.appliesTo}</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
