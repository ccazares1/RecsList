# The Local Edit — Personal Recommendations Guide

A personal, editorially-styled local guide you can share with friends. Features dual filtering (by type + neighborhood), card list view, and an interactive map view.

---

## How to add or remove spots

All your places live in **`places.csv`** in the root of this project. Open it in Excel, Numbers, or any spreadsheet app — it's just a table.

### Columns

| Column | Required | Description |
|--------|----------|-------------|
| `name` | ✅ | Name of the place |
| `type` | ✅ | Category — e.g. Bar, Bakery, Restaurant, Brunch, Coffee & Café |
| `neighborhood` | ✅ | Neighborhood name |
| `address` | | Street address |
| `description` | ✅ | Your personal take — write like you're texting a friend |
| `mustOrder` | | Dish or drink to get |
| `priceRange` | | `$`, `$$`, `$$$`, or `$$$$` |
| `emoji` | | One emoji for the card and map pin |
| `lat` | | Latitude for map pin |
| `lng` | | Longitude for map pin |

### Getting lat/lng coordinates
1. Go to [maps.google.com](https://maps.google.com)
2. Right-click the exact location
3. Click the coordinates that appear — they copy to your clipboard
4. Paste the two numbers into the `lat` and `lng` columns

### Tips for editing in Excel/Numbers
- If your description contains commas, wrap the whole cell in quotes (most apps do this automatically when you save as CSV)
- Save as **CSV UTF-8** format (not Excel .xlsx)
- Don't add or remove columns — the order matters

---

## Deploying updates

1. Edit `places.csv` and save
2. Commit and push to GitHub:
   ```bash
   git add places.csv
   git commit -m "Add new spots"
   git push
   ```
3. Render auto-deploys in ~60 seconds — done.

---

## Local development

```bash
npm install
npm start
# Open http://localhost:3000
```

---

## Deploy to Render

1. Push this folder to a GitHub repo
2. Go to [render.com](https://render.com) → New → Web Service → connect repo
3. Render detects settings from `render.yaml` automatically
4. Click **Create Web Service**

No environment variables required. The app reads `places.csv` on every startup.

---

## File structure

```
local-guide/
├── places.csv         ← Edit this to manage your spots
├── server.js          ← Express server
├── package.json
├── render.yaml        ← Render deployment config
└── public/
    └── index.html     ← The frontend
```
