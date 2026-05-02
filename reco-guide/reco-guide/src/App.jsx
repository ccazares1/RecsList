import { useState, useEffect, useRef } from "react";

// ─── Google Maps Loader ───────────────────────────────────────────────────────
const GMAPS_API_KEY = "AIzaSyD-placeholder"; // user would add their key

// ─── Category Config ──────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "all", label: "All", emoji: "✦" },
  { id: "restaurant", label: "Restaurants", emoji: "🍽" },
  { id: "coffee", label: "Coffee", emoji: "☕" },
  { id: "bar", label: "Bars & Drinks", emoji: "🍸" },
  { id: "bakery", label: "Bakeries", emoji: "🥐" },
  { id: "brunch", label: "Brunch", emoji: "🥚" },
];

const PRICE = { 1: "$", 2: "$$", 3: "$$$", 4: "$$$$" };

// ─── Sample Starter Data ──────────────────────────────────────────────────────
const STARTER_PLACES = [
  {
    id: "1",
    name: "Uchi",
    category: "restaurant",
    neighborhood: "Uptown",
    address: "2817 Maple Ave, Dallas, TX",
    price: 4,
    note: "Omakase sushi that will genuinely change you. Order the crispy rice with spicy tuna and thank me later.",
    tags: ["sushi", "date night", "special occasion"],
    lat: 32.8031,
    lng: -96.8058,
    mustOrder: "Crispy Rice with Spicy Tuna",
    rating: 5,
  },
  {
    id: "2",
    name: "Emporium Pies",
    category: "bakery",
    neighborhood: "Bishop Arts",
    address: "314 W 7th St, Dallas, TX",
    price: 1,
    note: "The Drunken Nut pie is life-changing. Go early — they sell out. The line moves fast.",
    tags: ["pie", "dessert", "casual"],
    lat: 32.7472,
    lng: -96.8317,
    mustOrder: "Drunken Nut Pie",
    rating: 5,
  },
  {
    id: "3",
    name: "Gold Bar",
    category: "bar",
    neighborhood: "Deep Ellum",
    address: "2416 Commerce St, Dallas, TX",
    price: 2,
    note: "Speakeasy vibes, phenomenal cocktails. Ask the bartender what they feel like making — never disappointed.",
    tags: ["cocktails", "intimate", "date night"],
    lat: 32.7848,
    lng: -96.7836,
    mustOrder: "Bartender's Choice",
    rating: 4,
  },
  {
    id: "4",
    name: "Houndstooth Coffee",
    category: "coffee",
    neighborhood: "Uptown",
    address: "1900 N Henderson Ave, Dallas, TX",
    price: 2,
    note: "Best flat white in Dallas. Great for working — grab a seat by the window.",
    tags: ["work-friendly", "specialty coffee", "reliable"],
    lat: 32.8123,
    lng: -96.7942,
    mustOrder: "Flat White",
    rating: 4,
  },
  {
    id: "5",
    name: "Meridian",
    category: "brunch",
    neighborhood: "Lower Greenville",
    address: "5531 Greenville Ave, Dallas, TX",
    price: 2,
    note: "The brunch spot. Crispy chicken biscuit is incredible. Get there when they open or expect a wait.",
    tags: ["brunch", "chicken", "weekend"],
    lat: 32.8351,
    lng: -96.7719,
    mustOrder: "Crispy Chicken Biscuit",
    rating: 5,
  },
];

// ─── Star Rating ──────────────────────────────────────────────────────────────
function Stars({ rating }) {
  return (
    <span style={{ color: "#e8b84b", letterSpacing: 1, fontSize: 13 }}>
      {"★".repeat(rating)}{"☆".repeat(5 - rating)}
    </span>
  );
}

// ─── Place Card ───────────────────────────────────────────────────────────────
function PlaceCard({ place, index, onEdit, onDelete, isAdmin }) {
  const cat = CATEGORIES.find(c => c.id === place.category);
  return (
    <div style={{
      background: "#fff",
      border: "1.5px solid #1a1a1a",
      borderRadius: 2,
      padding: "28px 28px 22px",
      position: "relative",
      transition: "transform 0.15s, box-shadow 0.15s",
      cursor: "default",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "6px 6px 0 #1a1a1a"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
    >
      {/* Number badge */}
      <div style={{
        position: "absolute", top: -14, left: 22,
        background: "#e8b84b", color: "#1a1a1a",
        fontFamily: "'Playfair Display', serif",
        fontWeight: 900, fontSize: 13,
        padding: "2px 10px", letterSpacing: 1,
        border: "1.5px solid #1a1a1a",
      }}>
        {String(index + 1).padStart(2, "0")}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
        <div>
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 22, fontWeight: 700,
            color: "#1a1a1a", margin: "0 0 2px",
            letterSpacing: "-0.3px",
          }}>{place.name}</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{
              background: "#1a1a1a", color: "#e8b84b",
              fontFamily: "'DM Mono', monospace",
              fontSize: 10, fontWeight: 500,
              padding: "2px 8px", letterSpacing: 1.5, textTransform: "uppercase",
            }}>{cat?.emoji} {cat?.label}</span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#888" }}>
              {place.neighborhood} · {PRICE[place.price]}
            </span>
            <Stars rating={place.rating} />
          </div>
        </div>
        {isAdmin && (
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => onEdit(place)} style={{
              background: "none", border: "1px solid #ccc",
              borderRadius: 2, padding: "3px 10px", fontSize: 11,
              cursor: "pointer", color: "#555", fontFamily: "'DM Mono', monospace",
            }}>Edit</button>
            <button onClick={() => onDelete(place.id)} style={{
              background: "none", border: "1px solid #ffaaaa",
              borderRadius: 2, padding: "3px 10px", fontSize: 11,
              cursor: "pointer", color: "#c0392b", fontFamily: "'DM Mono', monospace",
            }}>✕</button>
          </div>
        )}
      </div>

      <p style={{
        fontFamily: "'Lora', serif",
        fontSize: 15, lineHeight: 1.65,
        color: "#333", margin: "12px 0 14px",
      }}>{place.note}</p>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 8 }}>
        <div>
          {place.mustOrder && (
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 11, color: "#555",
            }}>
              <span style={{ color: "#e8b84b", fontWeight: 700 }}>★ Must order: </span>
              {place.mustOrder}
            </div>
          )}
          <div style={{ marginTop: 6, display: "flex", gap: 5, flexWrap: "wrap" }}>
            {place.tags?.map(t => (
              <span key={t} style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 10, color: "#888",
                border: "1px solid #ddd",
                borderRadius: 20, padding: "1px 8px",
              }}>{t}</span>
            ))}
          </div>
        </div>
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10, color: "#aaa",
        }}>{place.address}</span>
      </div>
    </div>
  );
}

// ─── Add / Edit Modal ─────────────────────────────────────────────────────────
function PlaceModal({ onSave, onClose, editing }) {
  const blank = { name: "", category: "restaurant", neighborhood: "", address: "", price: 2, note: "", mustOrder: "", tags: "", rating: 5, lat: null, lng: null };
  const [form, setForm] = useState(editing ? { ...editing, tags: editing.tags?.join(", ") || "" } : blank);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.name.trim() || !form.neighborhood.trim()) return alert("Name and neighborhood are required.");
    onSave({
      ...form,
      id: editing?.id || Date.now().toString(),
      price: Number(form.price),
      rating: Number(form.rating),
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      lat: form.lat ? Number(form.lat) : null,
      lng: form.lng ? Number(form.lng) : null,
    });
  };

  const inputStyle = {
    width: "100%", padding: "9px 12px",
    border: "1.5px solid #1a1a1a", borderRadius: 2,
    fontFamily: "'DM Mono', monospace", fontSize: 13,
    background: "#fafafa", color: "#1a1a1a",
    boxSizing: "border-box",
  };
  const labelStyle = {
    fontFamily: "'DM Mono', monospace",
    fontSize: 10, letterSpacing: 1.5,
    textTransform: "uppercase", color: "#888",
    display: "block", marginBottom: 4,
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
      zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#fff", border: "2px solid #1a1a1a",
        width: "min(92vw, 560px)", maxHeight: "88vh",
        overflowY: "auto", padding: "36px 32px",
        borderRadius: 2, position: "relative",
      }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, margin: "0 0 24px" }}>
          {editing ? "Edit Place" : "Add a Recommendation"}
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          <div style={{ gridColumn: "1/-1" }}>
            <label style={labelStyle}>Name *</label>
            <input style={inputStyle} value={form.name} onChange={e => set("name", e.target.value)} placeholder="Place name" />
          </div>
          <div>
            <label style={labelStyle}>Category</label>
            <select style={inputStyle} value={form.category} onChange={e => set("category", e.target.value)}>
              {CATEGORIES.filter(c => c.id !== "all").map(c => (
                <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Neighborhood *</label>
            <input style={inputStyle} value={form.neighborhood} onChange={e => set("neighborhood", e.target.value)} placeholder="e.g. Deep Ellum" />
          </div>
          <div style={{ gridColumn: "1/-1" }}>
            <label style={labelStyle}>Address</label>
            <input style={inputStyle} value={form.address} onChange={e => set("address", e.target.value)} placeholder="Full address" />
          </div>
          <div style={{ gridColumn: "1/-1" }}>
            <label style={labelStyle}>Your Note *</label>
            <textarea style={{ ...inputStyle, height: 90, resize: "vertical" }} value={form.note} onChange={e => set("note", e.target.value)} placeholder="What makes this place special? What should they know?" />
          </div>
          <div style={{ gridColumn: "1/-1" }}>
            <label style={labelStyle}>Must Order Item</label>
            <input style={inputStyle} value={form.mustOrder} onChange={e => set("mustOrder", e.target.value)} placeholder="e.g. Crispy Rice, Cold Brew" />
          </div>
          <div>
            <label style={labelStyle}>Price Range</label>
            <select style={inputStyle} value={form.price} onChange={e => set("price", e.target.value)}>
              {[1,2,3,4].map(p => <option key={p} value={p}>{PRICE[p]}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Your Rating</label>
            <select style={inputStyle} value={form.rating} onChange={e => set("rating", e.target.value)}>
              {[5,4,3,2,1].map(r => <option key={r} value={r}>{"★".repeat(r)} {r}/5</option>)}
            </select>
          </div>
          <div style={{ gridColumn: "1/-1" }}>
            <label style={labelStyle}>Tags (comma separated)</label>
            <input style={inputStyle} value={form.tags} onChange={e => set("tags", e.target.value)} placeholder="date night, outdoor seating, casual" />
          </div>
          <div>
            <label style={labelStyle}>Latitude (optional)</label>
            <input style={inputStyle} value={form.lat || ""} onChange={e => set("lat", e.target.value)} placeholder="32.7767" />
          </div>
          <div>
            <label style={labelStyle}>Longitude (optional)</label>
            <input style={inputStyle} value={form.lng || ""} onChange={e => set("lng", e.target.value)} placeholder="-96.7970" />
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{
            padding: "10px 22px", background: "none",
            border: "1.5px solid #ccc", borderRadius: 2,
            fontFamily: "'DM Mono', monospace", fontSize: 13,
            cursor: "pointer", color: "#555",
          }}>Cancel</button>
          <button onClick={handleSave} style={{
            padding: "10px 28px",
            background: "#1a1a1a", color: "#e8b84b",
            border: "none", borderRadius: 2,
            fontFamily: "'DM Mono', monospace", fontSize: 13,
            cursor: "pointer", fontWeight: 700,
            letterSpacing: 1,
          }}>
            {editing ? "Save Changes" : "Add Place ✦"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Map View (using OpenStreetMap iframe tiles + custom pins) ─────────────────
function MapView({ places }) {
  const validPlaces = places.filter(p => p.lat && p.lng);

  if (validPlaces.length === 0) {
    return (
      <div style={{
        textAlign: "center", padding: "80px 20px",
        fontFamily: "'DM Mono', monospace", color: "#888",
      }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🗺</div>
        <p>No coordinates available for current places.</p>
        <p style={{ fontSize: 12 }}>Add lat/lng when creating a place to see it on the map.</p>
      </div>
    );
  }

  // Compute center
  const avgLat = validPlaces.reduce((s, p) => s + p.lat, 0) / validPlaces.length;
  const avgLng = validPlaces.reduce((s, p) => s + p.lng, 0) / validPlaces.length;

  // Build markers param for a simple static approach using OpenStreetMap + Leaflet via iframe
  const markerData = JSON.stringify(validPlaces.map(p => ({ lat: p.lat, lng: p.lng, name: p.name, cat: p.category })));

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"/>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"></script>
  <style>
    body{margin:0;padding:0;}
    #map{height:100vh;width:100vw;}
    .custom-pin{
      background:#e8b84b;border:2.5px solid #1a1a1a;
      border-radius:50% 50% 50% 0;transform:rotate(-45deg);
      width:28px;height:28px;
      display:flex;align-items:center;justify-content:center;
      box-shadow:3px 3px 0 rgba(0,0,0,0.2);
    }
    .leaflet-popup-content-wrapper{
      border:2px solid #1a1a1a;border-radius:2px;
      font-family:monospace;font-size:13px;
    }
    .leaflet-popup-tip{background:#1a1a1a;}
  </style>
</head>
<body>
<div id="map"></div>
<script>
const places = ${markerData};
const map = L.map('map').setView([${avgLat}, ${avgLng}], 13);
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution:'&copy; OpenStreetMap &copy; CARTO',maxZoom:19
}).addTo(map);

const cats={'restaurant':'🍽','coffee':'☕','bar':'🍸','bakery':'🥐','brunch':'🥚'};
places.forEach(p => {
  const icon = L.divIcon({
    html: \`<div style="background:#e8b84b;border:2.5px solid #1a1a1a;width:32px;height:32px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;"><span style="transform:rotate(45deg);font-size:14px">\${cats[p.cat]||'📍'}</span></div>\`,
    className:'',iconSize:[32,32],iconAnchor:[16,32],popupAnchor:[0,-36]
  });
  L.marker([p.lat, p.lng], {icon}).addTo(map)
    .bindPopup('<strong>' + p.name + '</strong>');
});
</script>
</body>
</html>`;

  const src = `data:text/html;charset=utf-8,${encodeURIComponent(html)}`;

  return (
    <iframe
      src={src}
      style={{ width: "100%", height: "calc(100vh - 220px)", minHeight: 480, border: "1.5px solid #1a1a1a", borderRadius: 2 }}
      title="Map"
    />
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function RecoGuide() {
  const [places, setPlaces] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeNeighborhood, setActiveNeighborhood] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState("list"); // "list" | "map"
  const [showModal, setShowModal] = useState(false);
  const [editingPlace, setEditingPlace] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminPrompt, setShowAdminPrompt] = useState(false);
  const [adminInput, setAdminInput] = useState("");
  const ADMIN_PASS = "reco123"; // change this

  // Load from storage
  useEffect(() => {
    try {
      const res = JSON.parse(localStorage.getItem("reco-places") || "null");
      setPlaces(Array.isArray(res) ? res : STARTER_PLACES);
    } catch {
      setPlaces(STARTER_PLACES);
    }
    setLoaded(true);
  }, []);

  // Save to storage
  const save = (updated) => {
    setPlaces(updated);
    try { localStorage.setItem("reco-places", JSON.stringify(updated)); } catch {}
  };

  const handleSave = (place) => {
    const updated = editingPlace
      ? places.map(p => p.id === place.id ? place : p)
      : [...places, place];
    save(updated);
    setShowModal(false);
    setEditingPlace(null);
  };

  const handleDelete = (id) => {
    if (!confirm("Remove this recommendation?")) return;
    save(places.filter(p => p.id !== id));
  };

  const handleEdit = (place) => { setEditingPlace(place); setShowModal(true); };

  const neighborhoods = ["all", ...Array.from(new Set(places.map(p => p.neighborhood).filter(Boolean))).sort()];

  const filtered = places.filter(p => {
    const matchCat = activeCategory === "all" || p.category === activeCategory;
    const matchNeighborhood = activeNeighborhood === "all" || p.neighborhood === activeNeighborhood;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.neighborhood.toLowerCase().includes(q) || p.tags?.some(t => t.includes(q)) || p.note.toLowerCase().includes(q);
    return matchCat && matchNeighborhood && matchSearch;
  });

  const handleAdminLogin = () => {
    if (adminInput === ADMIN_PASS) { setIsAdmin(true); setShowAdminPrompt(false); setAdminInput(""); }
    else alert("Incorrect password.");
  };

  if (!loaded) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "'DM Mono', monospace", color: "#888" }}>
      Loading your guide...
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh",
      background: "#faf8f4",
      fontFamily: "'DM Mono', monospace",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Lora:ital@0;1&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Header */}
      <header style={{
        borderBottom: "2px solid #1a1a1a",
        background: "#1a1a1a",
        padding: "28px 40px",
        display: "flex", alignItems: "flex-end", justifyContent: "space-between",
        flexWrap: "wrap", gap: 16,
      }}>
        <div>
          <div style={{ color: "#e8b84b", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>
            A Personal Guide
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(28px, 5vw, 44px)",
            fontWeight: 900, color: "#faf8f4",
            margin: 0, letterSpacing: "-1px", lineHeight: 1,
          }}>
            My Recommendations
          </h1>
          <p style={{ color: "#888", fontSize: 11, margin: "8px 0 0", letterSpacing: 0.5 }}>
            {places.length} places · Curated with care
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {isAdmin ? (
            <>
              <button onClick={() => { setEditingPlace(null); setShowModal(true); }} style={{
                padding: "10px 20px",
                background: "#e8b84b", color: "#1a1a1a",
                border: "none", borderRadius: 2,
                fontFamily: "'DM Mono', monospace", fontSize: 12,
                cursor: "pointer", fontWeight: 700, letterSpacing: 1,
              }}>+ Add Place</button>
              <button onClick={() => setIsAdmin(false)} style={{
                padding: "10px 16px", background: "none",
                border: "1px solid #555", borderRadius: 2, color: "#888",
                fontFamily: "'DM Mono', monospace", fontSize: 11, cursor: "pointer",
              }}>Exit Admin</button>
            </>
          ) : (
            <button onClick={() => setShowAdminPrompt(true)} style={{
              padding: "10px 16px", background: "none",
              border: "1px solid #555", borderRadius: 2, color: "#888",
              fontFamily: "'DM Mono', monospace", fontSize: 11, cursor: "pointer",
            }}>✎ Edit Mode</button>
          )}
        </div>
      </header>

      {/* Controls */}
      <div style={{
        borderBottom: "1.5px solid #e0ddd7",
        background: "#faf8f4",
        position: "sticky", top: 0, zIndex: 10,
      }}>
        {/* Row 1: Type filters + right-side controls */}
        <div style={{
          padding: "16px 40px 12px",
          display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #ece9e3",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span style={{
              fontFamily: "'DM Mono', monospace", fontSize: 9,
              letterSpacing: 2, textTransform: "uppercase", color: "#aaa",
              minWidth: 60,
            }}>Type</span>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{
                  padding: "6px 13px",
                  background: activeCategory === cat.id ? "#1a1a1a" : "transparent",
                  color: activeCategory === cat.id ? "#e8b84b" : "#555",
                  border: "1.5px solid " + (activeCategory === cat.id ? "#1a1a1a" : "#d0cdc8"),
                  borderRadius: 2, cursor: "pointer",
                  fontFamily: "'DM Mono', monospace", fontSize: 11,
                  letterSpacing: 0.5, fontWeight: activeCategory === cat.id ? 700 : 400,
                  transition: "all 0.15s",
                }}>{cat.emoji} {cat.label}</button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {/* Search */}
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search places, tags..."
              style={{
                padding: "7px 13px", border: "1.5px solid #ccc",
                borderRadius: 2, fontFamily: "'DM Mono', monospace",
                fontSize: 12, background: "#fff", color: "#1a1a1a",
                width: 180,
              }}
            />
            {/* View toggle */}
            <div style={{ display: "flex", border: "1.5px solid #1a1a1a", borderRadius: 2, overflow: "hidden" }}>
              {["list", "map"].map(v => (
                <button key={v} onClick={() => setView(v)} style={{
                  padding: "7px 15px",
                  background: view === v ? "#1a1a1a" : "#fff",
                  color: view === v ? "#e8b84b" : "#555",
                  border: "none", cursor: "pointer",
                  fontFamily: "'DM Mono', monospace", fontSize: 11,
                  letterSpacing: 0.5,
                }}>{v === "list" ? "≡ List" : "◎ Map"}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Neighborhood filters */}
        <div style={{
          padding: "10px 40px 12px",
          display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap",
        }}>
          <span style={{
            fontFamily: "'DM Mono', monospace", fontSize: 9,
            letterSpacing: 2, textTransform: "uppercase", color: "#aaa",
            minWidth: 60,
          }}>Area</span>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {neighborhoods.map(n => (
              <button key={n} onClick={() => setActiveNeighborhood(n)} style={{
                padding: "4px 12px",
                background: activeNeighborhood === n ? "#e8b84b" : "transparent",
                color: activeNeighborhood === n ? "#1a1a1a" : "#666",
                border: "1.5px solid " + (activeNeighborhood === n ? "#e8b84b" : "#d0cdc8"),
                borderRadius: 20, cursor: "pointer",
                fontFamily: "'DM Mono', monospace", fontSize: 10,
                fontWeight: activeNeighborhood === n ? 700 : 400,
                transition: "all 0.15s",
                letterSpacing: 0.3,
              }}>{n === "all" ? "✦ All Areas" : n}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      <div style={{ padding: "14px 40px 0", color: "#aaa", fontSize: 11, letterSpacing: 0.5 }}>
        {filtered.length} {filtered.length === 1 ? "place" : "places"}
        {activeCategory !== "all" && ` · ${CATEGORIES.find(c => c.id === activeCategory)?.label}`}
        {activeNeighborhood !== "all" && ` · ${activeNeighborhood}`}
        {searchQuery && ` · matching "${searchQuery}"`}
      </div>

      {/* Main content */}
      <main style={{ padding: "20px 40px 60px" }}>
        {view === "list" ? (
          filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "#aaa" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>✦</div>
              <p>No places found. {isAdmin && "Add one above!"}</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 500px), 1fr))", gap: 28, marginTop: 8 }}>
              {filtered.map((place, i) => (
                <PlaceCard key={place.id} place={place} index={i} onEdit={handleEdit} onDelete={handleDelete} isAdmin={isAdmin} />
              ))}
            </div>
          )
        ) : (
          <MapView places={filtered} />
        )}
      </main>

      {/* Modals */}
      {showModal && (
        <PlaceModal
          editing={editingPlace}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditingPlace(null); }}
        />
      )}

      {showAdminPrompt && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
          zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center",
        }} onClick={() => setShowAdminPrompt(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "#fff", border: "2px solid #1a1a1a",
            padding: "36px 32px", borderRadius: 2, width: "min(90vw, 360px)",
          }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", margin: "0 0 20px" }}>Editor Access</h3>
            <input
              type="password"
              value={adminInput}
              onChange={e => setAdminInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAdminLogin()}
              placeholder="Password"
              style={{
                width: "100%", padding: "10px 12px",
                border: "1.5px solid #1a1a1a", borderRadius: 2,
                fontFamily: "'DM Mono', monospace", fontSize: 13,
                marginBottom: 14, boxSizing: "border-box",
              }}
              autoFocus
            />
            <p style={{ fontSize: 10, color: "#aaa", margin: "0 0 16px", fontFamily: "'DM Mono', monospace" }}>
              Default password: reco123 (change in code)
            </p>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => setShowAdminPrompt(false)} style={{
                padding: "9px 18px", background: "none", border: "1px solid #ccc",
                borderRadius: 2, cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 12,
              }}>Cancel</button>
              <button onClick={handleAdminLogin} style={{
                padding: "9px 22px", background: "#1a1a1a", color: "#e8b84b",
                border: "none", borderRadius: 2, cursor: "pointer",
                fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 700,
              }}>Enter</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
