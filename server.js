const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const CSV_FILE = path.join(__dirname, 'places.csv');
const ADMIN_PIN = process.env.ADMIN_PIN || '1234';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── CSV parser (handles quoted fields with commas inside) ──
function parseCSV(text) {
  const lines = text.trim().split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) return [];

  const headers = splitCSVLine(lines[0]);

  return lines.slice(1).map((line, i) => {
    const values = splitCSVLine(line);
    const obj = { id: i + 1 };
    headers.forEach((h, idx) => {
      const key = h.trim();
      const val = (values[idx] || '').trim();
      if (key === 'lat' || key === 'lng') {
        obj[key] = val ? parseFloat(val) : null;
      } else {
        obj[key] = (key === 'type' || key === 'neighborhood') ? val.split(',').map(s => s.trim()).filter(Boolean) : val;
      }
    });
    return obj;
  }).filter(p => p.name); // skip blank rows
}

function splitCSVLine(line) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; }
      else { inQuotes = !inQuotes; }
    } else if (ch === ',' && !inQuotes) {
      result.push(cur); cur = '';
    } else {
      cur += ch;
    }
  }
  result.push(cur);
  return result;
}

function readPlaces() {
  try {
    const text = fs.readFileSync(CSV_FILE, 'utf8');
    return parseCSV(text);
  } catch (e) {
    console.error('Could not read places.csv:', e.message);
    return [];
  }
}

function requirePin(req, res, next) {
  const pin = req.headers['x-admin-pin'];
  if (!pin || pin !== ADMIN_PIN) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

app.post('/api/places/verify-pin', requirePin, (req, res) => res.json({ ok: true }));

app.get('/api/places', (req, res) => res.json(readPlaces()));

// POST and DELETE are disabled in CSV mode — edits happen in the file directly
app.post('/api/places', requirePin, (req, res) => {
  res.status(400).json({ error: 'CSV mode: add spots by editing places.csv and redeploying.' });
});

app.delete('/api/places/:id', requirePin, (req, res) => {
  res.status(400).json({ error: 'CSV mode: remove spots by editing places.csv and redeploying.' });
});

app.listen(PORT, () => console.log(`Local Guide running on port ${PORT}`));
