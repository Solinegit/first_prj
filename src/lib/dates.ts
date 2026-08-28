const MONTHS_FR = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre',
]

export const WEEKDAYS_FR = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

export function toISODate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function todayISO(): string {
  return toISODate(new Date())
}

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function addDaysISO(iso: string, days: number): string {
  const d = parseISODate(iso)
  d.setDate(d.getDate() + days)
  return toISODate(d)
}

export function daysUntil(iso: string, fromISO: string): number {
  const ms = parseISODate(iso).getTime() - parseISODate(fromISO).getTime()
  return Math.round(ms / 86_400_000)
}

export function formatDateFR(iso: string): string {
  return parseISODate(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function monthLabel(year: number, month: number): string {
  const label = `${MONTHS_FR[month]} ${year}`
  return label.charAt(0).toUpperCase() + label.slice(1)
}

export function isValidOn(
  coupon: { validFrom: string | null; validUntil: string },
  iso: string,
): boolean {
  if (coupon.validFrom && iso < coupon.validFrom) return false
  return iso <= coupon.validUntil
}

export function getMonthGrid(year: number, month: number): string[] {
  const first = new Date(year, month, 1)
  const offset = (first.getDay() + 6) % 7
  const start = new Date(year, month, 1 - offset)
  const cells: string[] = []
  for (let i = 0; i < 42; i++) {
    const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)
    cells.push(toISODate(d))
  }
  return cells
}
