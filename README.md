# ThreatLens Frontend

ThreatLens provides a simple web interface for exploring threat intelligence data. The app presents recent IOCs, tracks sources and lets analysts export information. It is built with React, TypeScript and Tailwind using the **Vite** build tool.

## Development setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
   The site will be available at `http://localhost:3000`.

## Scraping script

A small Node.js script (`scripts/scrape.ts`) gathers IOCs from the configured sources. It downloads each feed and outputs a JSON file consumed by the frontend on page load. Run it whenever you want to refresh the dataset:

```bash
npm run scrape
```

The generated file is placed under `public/data` and the pages load it using the entity helpers.

## Building and deployment

Create a production build with:

```bash
npm run build
```

This uses Vite to generate static assets in the `dist` directory. The `deploy` script pushes the contents of `dist` to GitHub Pages:

```bash
npm run deploy
```

GitHub Pages serves the site from the `gh-pages` branch with the base path configured in `vite.config.js`.
