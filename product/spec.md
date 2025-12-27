
---

# **Fish Name Lookup – Specification (spec.md)**

## **1. Overview**

A lightweight static website that helps users instantly identify a fish by photo and see what it is called across different South Indian languages.
The site is designed for **mobile-first usage** (e.g., while ordering at restaurants) and is also accessible to the general public on the web.

---

## **2. Goals**

### **Primary**

* Provide a **visual reference** of common fishes served in restaurants.
* Show **names across multiple languages** (English, Tamil, Malayalam, Kannada).
* Make it simple for users to **search** and quickly identify fish names.

### **Secondary**

* Provide notes on **confusions and alternate names**.
* Offer two viewing modes: **Card View** and **Table View**.
* Enable easy maintenance by storing all fish info in **one JSON data file**.

---

## **3. Supported Platforms**

* **Mobile browsers (primary)**
* Web browsers (desktop & tablet)
* Optional: Add-to-home-screen (PWA-lite) for faster access

---

## **4. Architecture**

The site is a **fully static HTML + JS** application.

```
/index.html
/style.css
/app.js
/data/fish.json
/img/*.jpg or .webp
```

No build system required.
Deployment: GitHub Pages, Cloudflare Pages, or Netlify.

---

## **5. Data Model**

All fish information lives inside `/data/fish.json`.

### **5.1 JSON Schema**

Each fish entry follows:

```json
{
  "id": "seer-fish",
  "photo": "img/seer.jpg",
  "category": ["sea", "fry", "popular"],
  "scientificName": "Scomberomorus commerson",
  "names": {
    "english": ["Seer fish", "King fish"],
    "tamil": ["வஞ்சரம்", "Vanjaram"],
    "malayalam": ["നെയ്‌മീൻ", "Neymeen"],
    "kannada": ["ಅಂಜಲ್", "Anjal"]
  },
  "notes": "Often sold as King fish. Sometimes confused with Surmai in some regions."
}
```

### **5.2 Required fields**

* `id` — unique slug
* `photo` — local image path
* `names` — dict with arrays for each language

### **5.3 Optional fields**

* `scientificName`
* `category` (tags)
* `notes` (confusions, prep style, restaurant usage insights)

---

## **6. Features**

### **6.1 Card View (default)**

* Mobile-first vertical list.
* Each card includes:

  * Image (top)
  * English name (bold, large)
  * Names for other languages: local script + romanized version
  * Notes expandable on tap (“Show more”)

### **6.2 Table View**

* Horizontal scrollable grid.
* Rows = fish
* Columns = languages
* First column has thumbnail + English name.
* Sticky header row for language labels.
* Toggle to switch between **Cards** and **Table**.

### **6.3 Search**

* Single search bar in header.
* Searches across:

  * All name variants
  * English transliteration
  * Notes
* Results instantly filter both Card and Table views.

### **6.4 Responsive Design**

* Optimized for mobile (primary).
* Table view gracefully scrolls on small screens.
* Desktop/tablet gets wider grid layout.

---

## **7. UI Layout**

### **7.1 Header**

* Title: “South Indian Fish Name Guide”
* Search bar (full width)
* Toggle:

  * `Card View`
  * `Table View`

### **7.2 Body**

Contains two main containers:

```
<div id="card-view"></div>
<div id="table-view" hidden></div>
```

Only one visible at a time.

---

## **8. Behavior**

### **8.1 Data Loading**

On page load:

* Fetch `/data/fish.json`
* Store in global array
* Render card view + table view

### **8.2 Filtering**

On each keystroke:

* Normalize search term
* Filter fishData:

  * names[language][]
  * transliterations
  * English
  * notes
* Re-render both views

### **8.3 View Switching**

* Clicking toggle hides one container and shows the other.
* State restored on refresh using `localStorage` (optional).

---

## **9. Image Guidelines**

* Use `.webp` or `.jpg` under `300 KB`.
* Prefer whole-fish photos for recognition.
* Include attribution inside a separate metadata JSON if required.
* Filenames follow `id`:

  * `img/seer-fish.jpg`

---

## **10. Accessibility**

* Alt text for all images: `"Photo of Seer fish (Vanjaram / Neymeen / Anjal)"`
* High contrast text on cards.
* Minimum 14–16px fonts for mobile readability.

---

## **11. Future Enhancements (v2)**

Not needed for MVP, but possible later:

* Telugu / Hindi / Bengali columns
* Filters: sea vs freshwater
* Dish suggestions (best for fry, curry, grill)
* Add-to-home-screen manifest
* Offline access (service worker)
* “Buyers guide” (how to identify fresh fish)
* “Avoid confusion” chart (Neymeen ≠ Surmai etc.)

---

## **12. Milestones**

### **M1 – Core (Day 1)**

* Setup folder structure
* Create sample `fish.json` (10 fishes)
* Build card view
* Add search

### **M2 – Table + Polish (Day 2)**

* Table view
* Toggle + animations
* Expandable notes
* Responsive styles

### **M3 – Deploy (30 min)**

* Push to GitHub
* Deploy to Cloudflare Pages
* Share link

---
