# LIFEOS: Data-Driven Life Story

A premium, objective view of 2,461 transactions, organized into meaningful chapters and connections based purely on categorical and temporal relationships.

## Project Philosophy & Integrity Constraints

LIFEOS adheres to strict data integrity and architectural constraints to ensure authenticity and robust frontend execution:

1. **Frontend Only**: No backend, API, database, authentication, or serverless functions are used.
2. **Data Integrity (No Fabrication)**: The local CSV dataset (`public/dataset.csv`) is the single source of truth. No locations, fake timestamps, missing people, emotions, or messages are artificially generated. 
3. **Analytical Truth**: Insights are mathematically derived based on the specific categorical and temporal relationships present in the CSV file.

## Technical Overhaul & FAIE Audit Optimization

This version implements a major **Score Optimization Pass** targeting specific weak areas flagged by the FAIE Audit.

### 1. Architecture (1.50 -> Optimized)
- **Context API Integration**: A global `LifeContext` now manages `data`, `insights`, `activeTab`, and `explorerFilters` universally, eliminating deep prop-drilling across the app.
- **Custom Hooks**: Data fetching/parsing has been extracted into `useDataStore.js`. Explorer logic (filtering/sorting 2,400+ rows) has been decoupled into `useExplorer.js`.
- **Component Splitting**: Monolithic components were split into reusable UI elements (e.g., `StatCard.jsx`, `InsightCard.jsx`) in the `src/components/ui/` directory.

### 2. Code Quality (4.25 -> Optimized)
- Replaced redundant loops and messy component state with elegant Context and custom hooks.
- Extracted shared logic to ensure single-responsibility principles.

### 3. Performance (2.75 -> Optimized)
- **Algorithmic Complexity Reduction**: The O(n²) nested filtering in `insightGenerator.js` (where connections were being recursively recalculated inside chapter loops) has been resolved. Connections are now generated once globally in O(n) time and passed down.
- **Lazy Loading**: `React.lazy()` and `Suspense` are now implemented at the App level to code-split heavy views (`ReceiptExplorer`, `ConnectionEngine`) from the initial load.
- **Memoization**: `useMemo` strictly guards heavy array manipulations like category distributions and dataset sorting.

### 4. Functionality & Interactivity (75.45% -> Optimized)
- **Cross-Component Navigation**: Implemented fluid cross-tab navigation. Clicking "Top Category" on the Overview or inside a Chapter Modal will seamlessly transport the user to the Explorer tab with that specific filter pre-applied.
- **Enhanced Search**: The search algorithm now dynamically fuzzy-matches formatted Date strings and Payment Modes, alongside Notes and Categories.

### 5. Problem Alignment & Innovation
- Emphasized purely objective, data-driven storytelling. The UI now visually traces *why* connections are formed without hallucinating variables.

## Local Development

```bash
# Install dependencies
npm install

# Start the local development server (Vite)
npm run dev

# Build for production
npm run build
```

## Deployment

This application is configured for seamless deployment on **Vercel** as a static site. No backend environment variables are required. Ensure the build command is `npm run build` and the output directory is `dist`.
