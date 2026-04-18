# FoodMaster

A self-hostable Progressive Web App to keep food organized in fridge, pantry and freezer.

## Features

- PWA support for Android and iOS (manifest + service worker)
- Light and dark mode toggle
- i18n with German (`de`) and English (`en`)
- Automatic language detection from browser settings
- Track:
  - Category (with icons): 🧊 fridge, 🥫 pantry, ❄️ freezer
  - Name
  - Quantity
  - Added date/time (auto-filled with current date/time)
  - Best-before date
- Local persistence in browser storage

## Demo via GitHub Pages

The workflow `.github/workflows/gh-pages-demo.yml` deploys the static app to GitHub Pages on pushes to `main` (or manually).

## Docker deployment

Build and run:

```bash
docker build -t foodmaster .
docker run --rm -p 8080:80 foodmaster
```

Then open `http://localhost:8080`.

## Release and deploy workflow

Use `.github/workflows/release-and-deploy.yml` with manual trigger input `version`.

It will:

1. Validate Conventional Commit message format in commits since last tag
2. Generate release notes from commit messages
3. Create a GitHub Release
4. Build and push Docker image to GHCR:
   - `ghcr.io/<owner>/foodmaster:vX.Y.Z`
   - `ghcr.io/<owner>/foodmaster:latest`
