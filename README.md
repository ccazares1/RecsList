# The Local Edit — Personal Recommendations Guide

A personal, editorially-styled local guide you can add to and share with friends. Features dual filtering (by type + neighborhood), a card list view, and an interactive map view.

## Features
- 📋 **List view** with editorial card layout
- 🗺️ **Map view** powered by OpenStreetMap + Leaflet
- 🔍 **Filter** by place type and neighborhood
- ➕ **Add spots** via a clean form (with lat/lng for map pins)
- 🗑️ **Remove spots** by hovering a card and clicking ✕
- 💾 **Persistent** — data stored in a local JSON file on the server

---

## Local Development

```bash
npm install
npm start
# → Open http://localhost:3000
```

---

## Deploy to Render

1. **Push this folder to a GitHub repo** (public or private).

2. **Go to [render.com](https://render.com)** and sign in.

3. Click **"New +"** → **"Web Service"**.

4. Connect your GitHub repo.

5. Render will auto-detect the settings from `render.yaml`:
   - **Build command:** `npm install`
   - **Start command:** `npm start`

6. Click **"Create Web Service"** — you're live!

> **Note on data persistence:** Render's free tier uses ephemeral storage, meaning the `data/places.json` file resets on deploys/restarts. To keep data permanently:
> - **Option A (easy):** Upgrade to a Render paid plan with a persistent disk
> - **Option B (free):** Replace the JSON file storage with a free database like [Railway Postgres](https://railway.app) or [Supabase](https://supabase.com)
> - **Option C (simplest):** Edit the default places directly in `server.js` inside `defaultPlaces()` — these always load on restart

---

## Customizing Your Guide

### Change the title & intro
Edit `public/index.html` and update:
- The `.wordmark` text in the header
- The `<h1>` and `<p>` in the hero section
- The `.hero-kicker` subtitle

### Edit default places
In `server.js`, find the `defaultPlaces()` function and update the array with your own spots. These load whenever the data file is missing.

### Adding a map pin
When adding a spot, you need lat/lng coordinates:
1. Go to [maps.google.com](https://maps.google.com)
2. Right-click any location
3. Click the coordinates that appear — they'll copy to your clipboard
4. Paste them into the Latitude/Longitude fields

---

## File Structure

```
local-guide/
├── server.js          # Express server + REST API
├── package.json
├── render.yaml        # Render deployment config
├── data/
│   └── places.json    # Your saved places (auto-created)
└── public/
    └── index.html     # The entire frontend
```
