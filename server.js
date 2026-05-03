const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'places.json');

// Set your admin PIN here, or via ADMIN_PIN environment variable on Render
const ADMIN_PIN = process.env.ADMIN_PIN || 'admin_2424';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(defaultPlaces(), null, 2));
}

function defaultPlaces() {
  return [
    { id: 1, name: "Café du Monde", type: "Coffee & Café", neighborhood: "French Quarter", address: "800 Decatur St", description: "An absolute institution. Get the beignets and a café au lait, sit outside, and watch the city move. Go early or late — never at noon.", mustOrder: "Beignets + Café au Lait", priceRange: "$", lat: 29.9572, lng: -90.0615, emoji: "☕" },
    { id: 2, name: "Dooky Chase's", type: "Restaurant", neighborhood: "Treme", address: "2301 Orleans Ave", description: "Leah Chase's legendary Creole restaurant. The fried chicken alone is worth making a trip. A piece of New Orleans history on every plate.", mustOrder: "Fried Chicken, Red Beans & Rice", priceRange: "$$", lat: 29.9641, lng: -90.0779, emoji: "🍽️" },
    { id: 3, name: "Compère Lapin", type: "Brunch", neighborhood: "Warehouse District", address: "535 Tchoupitoulas St", description: "Nina Compton's Caribbean-meets-New Orleans kitchen is one of the most exciting in the city. Brunch here is a special occasion every time.", mustOrder: "Goat Curry, Sweet Potato Gnocchi", priceRange: "$$$", lat: 29.9453, lng: -90.0668, emoji: "🌿" },
    { id: 4, name: "Cure", type: "Bar", neighborhood: "Freret", address: "4905 Freret St", description: "The cocktail bar that kicked off New Orleans' craft cocktail renaissance. Impeccably made drinks in a beautifully restored space. Order something off-menu and describe your mood.", mustOrder: "Ask the bartender", priceRange: "$$", lat: 29.9321, lng: -90.1031, emoji: "🍸" },
    { id: 5, name: "Levee Baking Co.", type: "Bakery", neighborhood: "Uptown", address: "1030 Harmony St", description: "Tiny neighborhood bakery with big ambitions. Their croissants are flaky in all the right ways, and the rotating seasonal pastries are never a miss.", mustOrder: "Croissant, Kouign-Amann", priceRange: "$", lat: 29.9263, lng: -90.1094, emoji: "🥐" },
    { id: 6, name: "Turkey & the Wolf", type: "Lunch", neighborhood: "Garden District", address: "739 Jackson Ave", description: "The most fun sandwich shop in America, probably. The collard green melt will rearrange your understanding of what a sandwich can be. Cash only, tiny space, absolutely worth it.", mustOrder: "Collard Green Melt", priceRange: "$", lat: 29.9345, lng: -90.0889, emoji: "🥪" }
  ];
}

function requirePin(req, res, next) {
  const pin = req.headers['x-admin-pin'];
  if (!pin || pin !== ADMIN_PIN) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

// Verify PIN (used by frontend to validate before opening form)
app.post('/api/places/verify-pin', requirePin, (req, res) => {
  res.json({ ok: true });
});

app.get('/api/places', (req, res) => {
  try { res.json(JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))); }
  catch (e) { res.json([]); }
});

app.post('/api/places', requirePin, (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    const newPlace = { id: Date.now(), ...req.body };
    data.push(newPlace);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json(newPlace);
  } catch (e) { res.status(500).json({ error: 'Failed to save' }); }
});

app.delete('/api/places/:id', requirePin, (req, res) => {
  try {
    let data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    data = data.filter(p => p.id !== parseInt(req.params.id));
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: 'Failed to delete' }); }
});

app.listen(PORT, () => console.log(`Local Guide running on port ${PORT}`));
