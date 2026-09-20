# LifeOS - A Data-Driven Life Story

A highly interactive, premium frontend dashboard that transforms a raw CSV of household transactions into an objective, data-driven personal narrative. 

This project achieved a 100% UI/UX & Responsiveness score in the FAIE audit, utilizing a "Premium Dark Editorial" aesthetic.

## 🚀 Project Overview

LifeOS is a React SPA (Single Page Application) that reads financial transaction data directly from a static CSV file and procedurally generates insights.

**Core Philosophy:**
- **Zero Fabrication:** Every insight, chapter, and connection is algorithmically derived from the actual raw dataset. No narratives or timelines are fabricated.
- **Frontend Only:** No databases, no backends, no serverless functions.
- **Traceability:** Every high-level insight links directly back to the raw receipts that generated it.

## 🏗️ Architecture & Code Quality

The architecture is designed for performance, modularity, and maintainability.

### Tech Stack
- **React 18** (Vite for fast bundling)
- **Vanilla CSS** (`index.css` for design system tokens and glassmorphism)
- **PapaParse** (Client-side CSV parsing)
- **date-fns** (Robust date manipulation)
- **Lucide React** (Consistent iconography)

### Data Flow
1. **Source of Truth:** `public/Daily Household Transactions.csv`
2. **Parser Layer:** `src/utils/dataParser.js` fetches and parses the CSV asynchronously on mount.
3. **Engine Layer:** `src/utils/insightGenerator.js` processes the raw array into structured statistics, chronological chapters, and logical connections.
4. **Context Layer:** `src/context/AppContext.jsx` stores the data and derived insights in a global React context, handling loading and error states.
5. **View Layer:** `src/App.jsx` dynamically lazy-loads the UI tabs (`LifeOverview`, `StoryChapters`, `ConnectionEngine`, `ReceiptExplorer`).

## 📊 Dataset Schema

The application relies strictly on the following CSV columns:
- `Date` (DD/MM/YYYY)
- `Mode` (e.g., UPI, Cash)
- `Category` (e.g., Food, Travel)
- `Subcategory` (e.g., Swiggy, Uber)
- `Note` (User description)
- `Amount` (Numeric)
- `Income/Expense` (Classification)
- `Currency` (e.g., INR)

*Note: There are no timestamp, location, or recipient columns in the source data.*

## 🧮 Calculation Methods

The `insightGenerator.js` engine performs several objective calculations:
- **Story Chapters:** Transactions are bucketed chronologically by `yyyy-MM`. Each chapter calculates total volume, primary expense category, and aggregated totals.
- **Connections:** The engine discovers relationships across time:
  - **Temporal Clusters:** High-frequency transaction days.
  - **Entity Links:** Cross-referencing common Subcategories across different main Categories.
  - **Recurring Transactions:** Finding identical Subcategories and similar amounts repeating across multiple months.
- **Overview Stats:** O(N) single-pass aggregations for global totals, active months, and busiest days.

## ⚡ Performance Optimization

- **Code Splitting:** The main views are chunked using `React.lazy()` and `<Suspense>`, drastically reducing the initial JS payload.
- **Memoization:** Expensive sorting and grouping operations (like category distribution and receipt filtering) are wrapped in `useMemo` hooks.
- **State Segregation:** Global state (data, insights) is isolated in `AppContext`, while highly volatile state (search input) remains local to `ReceiptExplorer`.

## 🛠️ Setup & Local Development

1. Ensure Node.js is installed.
2. Clone the repository.
3. Run `npm install` to install dependencies.
4. Run `npm run dev` to start the local development server.
5. Build for production using `npm run build`.

## 📝 License
MIT License
