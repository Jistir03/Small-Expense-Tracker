# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (Vite, typically http://localhost:5173)
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

No test suite is configured.

## Architecture

React 19 + Vite app with Tailwind CSS v4 and shadcn/ui components.

### Component tree

- **`App.jsx`** — Root component. Owns `transactions` array, `activeTab` ("dashboard" | "add"), `dashView` ("table" | "charts"), and `isDark` state. Renders `Navbar` and conditionally renders dashboard or form view.
- **`components/Navbar.jsx`** — Sticky top navbar with Dashboard / Add Transaction tab buttons and a dark mode toggle (Sun/Moon icon).
- **`Summary.jsx`** — Receives `transactions`, computes `totalIncome`, `totalExpenses`, and `balance`, displays three shadcn `Card` components.
- **`TransactionForm.jsx`** — Owns its own form state. Uses shadcn `Input`, `Select`, and `Button`. Calls `onAdd(transaction)` on submit and fires a Sonner success toast.
- **`TransactionList.jsx`** — Receives `transactions`, owns filter state, renders a shadcn `Table` with `Badge` category labels. Delete uses shadcn `AlertDialog` (no `window.confirm`) and fires a Sonner toast on confirm.
- **`Charts.jsx`** — Receives `transactions`, renders two recharts charts wrapped in shadcn `ChartContainer`: a donut (expense by category) and a grouped bar chart (income vs expenses by category).

### UI / Styling

- **Tailwind CSS v4** via `@tailwindcss/vite` — no `tailwind.config.js`; theme tokens live in `src/index.css`.
- **shadcn/ui components** in `src/components/ui/`: `button`, `card`, `input`, `select`, `table`, `badge`, `alert-dialog`, `sonner`, `chart`.
- **`src/lib/utils.js`** — exports `cn()` helper (clsx + tailwind-merge).
- **Teal primary color** — `--primary: oklch(0.52 0.13 185)` light / `oklch(0.67 0.13 185)` dark.
- **Dark mode** — `.dark` class on `<html>`, toggled in `App.jsx` via `useEffect`, persisted to `localStorage`. An inline script in `index.html` prevents flash of wrong theme on load.

### Layout

- Navbar and main content are constrained to `max-w-7xl` for the dashboard (full-width feel).
- Add Transaction form is wrapped in `max-w-xl` to stay readable.

### Transaction shape

```js
{ id, description, amount (number), type ("income"|"expense"), category, date (YYYY-MM-DD) }
```

**Categories**: hardcoded in `TransactionForm` and `TransactionList` —
`["food", "housing", "utilities", "transport", "entertainment", "salary", "other"]`

**No persistence**: state resets on page reload; there is no backend or localStorage (theme preference is the only thing stored in localStorage).
