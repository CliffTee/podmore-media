# Portfolio Command

A portfolio-first stock investing app prototype built with React, Vite, and Convex.

## What is working now

- Search companies and tickers from the starter data set.
- Select a company to update the main chart and research panel.
- View portfolio metrics, watchlist rows, risk signals, and latest-news placeholders.
- Convex schema and save/list functions are scaffolded for saved portfolio companies, including status, shares, average cost, target allocation, conviction, notes, and tags.

## Run the app

```powershell
npm.cmd run dev
```

Open:

```text
http://127.0.0.1:5173
```

## Connect Convex

1. Create or sign in to a Convex account.
2. From this folder, run:

```powershell
npm.cmd run convex
```

3. Follow the Convex prompts to create/link a project.
4. Copy the generated Convex deployment URL into a new `.env.local` file:

```text
VITE_CONVEX_URL=https://your-deployment.convex.cloud
```

5. Restart the Vite dev server.

After that, the Save button will persist companies to Convex.

## Good next build steps

- Add an Alpha Vantage API key to enable live quote and daily chart data.
- Add real company detail pages.
- Add portfolio positions with shares, cost basis, notes, and target allocation.
- Add authentication so each user has their own saved portfolio.
- Pull real latest news into the news panel.

## Enable Market Data

The app fetches market snapshots from a Convex action so the API key stays off the client.

1. Get an Alpha Vantage API key.
2. In PowerShell, run:

```powershell
npm.cmd exec convex env set ALPHA_VANTAGE_API_KEY your_api_key_here
```

3. Keep `npm.cmd run convex` running so Convex syncs functions.
4. Refresh the app and click `Refresh` on a ticker.
