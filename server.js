const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const CSV_FILE = path.join(__dirname, 'places.csv');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

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
      } else if (key === 'type' || key === 'neighborhood' || key === 'city') {
        obj[key] = val.split(',').map(s => s.trim()).filter(Boolean);
      } else {
        obj[key] = val;
      }
    });
    return obj;
  }).filter(p => p.name);
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

app.get('/api/places', (req, res) => {
  try {
    const text = fs.readFileSync(CSV_FILE, 'utf8');
    res.json(parseCSV(text));
  } catch (e) {
    console.error('Could not read places.csv:', e.message);
    res.json([]);
  }
});

app.listen(PORT, () => console.log(`Local Guide running on port ${PORT}`));
