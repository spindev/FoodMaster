# FoodMaster

A self-hostable Progressive Web App built with React + Vite to keep food organized in fridge, pantry and freezer.

## Features

- React + Vite app with manifest + service worker for Android/iOS install support
- Light and dark mode toggle
- i18n with German (`de`) and English (`en`)
- Automatic language detection from browser settings
- Track:
  - Category with icons: 🧊 fridge, 🥫 pantry, ❄️ freezer
  - Name
  - Quantity
  - Added date/time (auto-filled)
  - Best-before date
- Local persistence in browser storage

## Local development

```bash
npm ci
npm run dev
```

## Demo via GitHub Pages

`.github/workflows/gh-pages-demo.yml` builds the Vite app and deploys `dist/` to GitHub Pages.

## Docker deployment (Node runtime)

```bash
docker build -t foodmaster .
docker run --rm -p 4173:4173 foodmaster
```

Then open `http://localhost:4173`.

## Release and deploy workflow

Use `.github/workflows/release-and-deploy.yml` with manual input `version`.

It will:

1. Create a GitHub Release for the provided version tag (with generated release notes)
2. Build and push Docker images to GHCR:
   - `ghcr.io/<owner>/foodmaster:vX.Y.Z`
   - `ghcr.io/<owner>/foodmaster:latest`

Commit messages should follow conventional commits.
