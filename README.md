# Smart Dairy AI Manufacturing Control Center

Real-time SCADA/MES-style dashboard for a dairy manufacturing plant, built with React, Tailwind CSS, and Recharts.

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

The production build outputs to `dist/`.

## Deploy

This is a static Vite app, so it deploys to any static host:

- **Vercel**: import the GitHub repo at vercel.com/new — it auto-detects Vite.
- **Netlify**: "Add new site" → "Import an existing project" → build command `npm run build`, publish directory `dist`.
- **GitHub Pages**: run `npm run build`, then deploy the `dist/` folder (e.g. via the `gh-pages` package or a GitHub Actions workflow).
