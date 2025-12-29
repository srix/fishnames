# AGENTS.md  
Indian Fish Name Guide – Agent Instructions

This repository is used with coding agents (Codex Cloud / GitHub agents).
Follow this guide strictly to ensure high-quality, reviewable changes.

---

## Project Overview
This project is a static, web-based guide for Indian fish names.
It helps users translate fish names across multiple Indian languages:
English, Tamil, Malayalam, Telugu, Kannada, Hindi, Bengali, Marathi, and Odia.

The app supports:
- **Card View** for visual browsing
- **Table View** for structured comparison
- Search and filtering across languages

---

## Tech Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Data**: JSON (`data/fish.json`)
- **Testing**: Playwright (end-to-end)

No backend, build step, or framework is involved.

---

## Repository Structure

### Root
- `index.html`  
  Main entry point. Contains DOM structure for tabs, card view, and table view.

- `app.js`  
  Core application logic:
  - Data loading
  - Rendering (card + table)
  - Search and filtering
  - View switching

- `style.css`  
  Global and responsive styles.

- `playwright.config.js`  
  Playwright configuration.

### Data (`data/`)
- `fish.json`  
  Core dataset. Array of fish objects with:
  - `name` (English)
  - `scientific_name`
  - `image`
  - Language keys (e.g. `tamil`, `malayalam`)
  - `names` object with localized names

### Product (`product/`)
- `spec.md`  
  Product requirements and scope reference.

### Tests (`tests/`)
- `card_view.test.js`  
  End-to-end Playwright tests for Card View behavior.

---

## Development Setup

### Run locally
The app is statically served.

Use one of:
```bash
python3 -m http.server 8080
