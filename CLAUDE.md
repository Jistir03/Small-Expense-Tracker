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

This is a single-component React app (Vite + React 19). All logic lives in `src/App.jsx`:

- **State**: `transactions` array (id, description, amount, type, category, date), plus form fields (`description`, `amount`, `type`, `category`) and filter fields (`filterType`, `filterCategory`).
- **Derived values**: `totalIncome`, `totalExpenses`, and `balance` are computed directly from `transactions` on each render — no memoization.
- **Known bugs**: `amount` is stored as a string, so numeric operations (sum, balance) use string concatenation instead of addition, producing incorrect totals.
- **No persistence**: state resets on page reload; there is no backend or localStorage.
- **Categories**: hardcoded array — `["food", "housing", "utilities", "transport", "entertainment", "salary", "other"]`.
