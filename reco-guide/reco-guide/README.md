# My Recommendations Guide

A personal, interactive guide to your favorite local spots — filterable by type and neighborhood, with list and map views.

---

## 🚀 Deploy to Vercel (Free — ~5 minutes)

### Step 1: Install Node.js
If you don't have it, download and install from: https://nodejs.org (choose the "LTS" version)

### Step 2: Install the Vercel CLI
Open Terminal (Mac) or Command Prompt (Windows) and run:
```
npm install -g vercel
```

### Step 3: Navigate to this project folder
```
cd path/to/reco-guide
```
(Replace `path/to/reco-guide` with where you unzipped this folder)

### Step 4: Deploy!
```
vercel
```
- It will ask you to log in or create a free Vercel account
- Answer the setup questions (just press Enter to accept defaults)
- In ~1 minute, it gives you a live URL like: `https://my-recommendations-guide.vercel.app`

### Step 5: Put the link in your Instagram bio
Go to your Instagram profile → Edit Profile → paste your Vercel URL in the Website field.

---

## 💻 Run Locally (to preview before deploying)

```
npm install
npm run dev
```
Then open http://localhost:5173 in your browser.

---

## ✏️ Customizing

- **Change the password**: Open `src/App.jsx` and find `const ADMIN_PASS = "reco123"` — change it to anything you like
- **Change the title**: Edit `index.html` and update `<title>` and the `<meta name="description">` tag
- **Add categories**: Find the `CATEGORIES` array in `src/App.jsx` and add new entries

After any changes, just run `vercel` again to redeploy — it updates your live site instantly.

---

## 🔒 How the admin/edit mode works

- Tap **"✎ Edit Mode"** on the site and enter your password
- Add, edit, or delete places
- Your data is saved in the browser's localStorage on whatever device you manage it from
- Friends who visit only see the guide — they can't edit anything

> **Note:** Because data is stored in localStorage, your recommendations are tied to the browser you use to manage the site. If you switch computers, you'd need to re-enter your places. For a more robust setup (data synced everywhere), a future upgrade would connect to a database like Supabase.
