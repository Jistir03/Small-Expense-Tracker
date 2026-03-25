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

React 19 + Vite app split into four components:

- **`App.jsx`** — Root component. Owns the `transactions` array (the only shared state). Passes data and callbacks down to children.
- **`Summary.jsx`** — Receives `transactions`, computes `totalIncome`, `totalExpenses`, and `balance` internally, and displays the three summary cards.
- **`TransactionForm.jsx`** — Owns its own form state (`description`, `amount`, `type`, `category`). Calls `onAdd(transaction)` prop with a fully constructed transaction object on submit.
- **`TransactionList.jsx`** — Receives `transactions`, owns filter state (`filterType`, `filterCategory`) internally, and renders the filtered table.

**Transaction shape**: `{ id, description, amount (number), type ("income"|"expense"), category, date (YYYY-MM-DD) }`

**Categories**: hardcoded in both `TransactionForm` and `TransactionList` — `["food", "housing", "utilities", "transport", "entertainment", "salary", "other"]`.

**No persistence**: state resets on page reload; there is no backend or localStorage.
