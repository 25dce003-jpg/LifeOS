# LIFEOS: Your Life, In Receipts

## Problem Statement
The challenge was to build an application for "Your Life, In Receipts" that doesn't just display a timeline of a dataset, but transforms RAW DATA into INSIGHTS, CONNECTIONS, and a cohesive STORY.

## Solution Concept
LIFEOS acts as a digital scrapbook and pattern-discovery engine. It processes raw financial and activity transactions directly in the browser and surfaces meaningful patterns. By analyzing dates, categories, and clustering, LIFEOS generates data-driven "Story Chapters" and maps connected moments together.

## Key Features
1. **Life Overview**: A dashboard showing total activity, primary categories, and a "Life Pulse" visualization of activity density.
2. **Story Chapters**: Automated clustering of transactions by month. It intelligently names chapters based on the primary activity of that period (e.g., "Festival Activity" or "High Travel Period").
3. **Connection Engine**: Maps out transactions that are objectively linked. 
4. **Receipt Explorer**: A powerful search and filter interface to view all raw data. It clearly separates "Original Category" from "Derived Context".

## How Relationships are Discovered
The **Connection Engine** strictly relies on objective metrics from the dataset:
- **High Activity Days**: Links 4 or more transactions that occurred on the exact same calendar day.
- **Repeated Activity**: Links 3 or more transactions of the exact same category on the same day.
Every connection comes with a transparent, auto-generated explanation (e.g., "4 receipts connected because they occurred on the same day").

## Technology Stack
- **React 18**
- **Vite** (Build tooling)
- **Tailwind CSS V4** (Styling & responsive layout)
- **Lucide React** (Iconography)
- **date-fns** (Date manipulation)
- **PapaParse** (Client-side CSV parsing)
- **Zero Backend Architecture**

## Dataset Usage
The application uses the `Daily Household Transactions.csv` file located in the `public/` directory as the absolute source of truth. The data is fetched and parsed entirely on the client side at runtime.

## How to Run Locally
1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the development server
4. Open the provided localhost link in your browser

## Deployment Information
This project is a static frontend application. To deploy:
1. Run `npm run build`
2. Deploy the `dist/` folder to any static hosting service (e.g., Vercel, Netlify, GitHub Pages). No server configuration is required.
