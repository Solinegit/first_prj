# AGENTS.md

## Stack
- Vite + React 19 + TypeScript, frontend seul (pas de backend).
- Persistance : `localStorage` (clé `coupon-manager:v1`, voir `src/lib/storage.ts`).
- CSS vanilla dans `src/index.css` (pas de framework CSS).
- Pas de suite de tests pour l'instant.

## Commandes
- Node n'est pas dans le PATH par défaut : `export PATH="$HOME/.local/node/bin:$PATH"` avant toute commande npm.
- `npm install` — installer les dépendances
- `npm run dev` — serveur de dev (http://localhost:5173)
- `npm run lint` — ESLint
- `npm run typecheck` — `tsc --noEmit`
- `npm run build` — typecheck + build de prod (dans `dist/`)
- Ordre recommandé avant commit : `npm run lint && npm run typecheck && npm run build`

## Architecture
- `src/App.tsx` — état global (liste des coupons), persistance via `useEffect`
- `src/types.ts` — modèle `Coupon`
- `src/lib/dates.ts` — helpers dates ; les dates sont des chaînes ISO `yyyy-mm-dd` (comparables en lexique, jamais de `Date.toISOString()` qui est en UTC)
- `src/lib/storage.ts` — lecture/écriture `localStorage`
- `src/components/` — `CouponForm`, `CouponList`, `Calendar`
- Le calendrier est fait maison (grille de mois, semaine commençant le lundi), pas de lib externe.

## Conventions
- Documentation et interface en français.
- Un coupon est valide sur `[validFrom ?? -∞, validUntil]` inclus (voir `isValidOn` dans `src/lib/dates.ts`).
