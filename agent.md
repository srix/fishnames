# Indian Fish Name Guide - Agent Documentation

## Project Overview
This project is a web-based guide for Indian fish names, helping users translate fish names across various languages (English, Tamil, Malayalam, Telugu, Kannada, Hindi, Bengali, Marathi, Odia). It features both a Card View and a Table View for browsing fish data.

## Tech Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Data**: JSON (`data/fish.json`)
- **Testing**: Playwright (`tests/`)

## Key Files & Directories

### Root
- `index.html`: The main entry point of the application. Contains the DOM structure for Tab/Card views.
- `app.js`: Main application logic. Handles data fetching, rendering, search, filtering, and view switching.
- `style.css`: Global styles for the application, including responsive design and themes.
- `playwright.config.js`: Configuration for Playwright end-to-end tests.

### Data (`data/`)
- `fish.json`: The core dataset. An array of fish objects. Each object contains:
  - `name`: English name.
  - `scientific_name`: Scientific classification.
  - `image`: Path to the fish image.
  - Language keys (e.g., `tamil`, `malayalam`): Localized names.
  - `names`: An object with detailed localized names.

### Product (`product/`)
- `spec.md`: Product specification and requirements document.

### Tests (`tests/`)
- `card_view.test.js`: End-to-end tests specifically for the Card View functionality using Playwright.

## Development Workflow
1. **Server**: The app is served statically. Use a simple HTTP server (e.g., `python3 -m http.server`) to run locally.
2. **Testing**: Run tests using `npx playwright test`.

## Common Tasks
- **Adding new fish**: Update `data/fish.json`.
- **UI Updates**: Modify `index.html` for structure and `style.css` for appearance.
- **Logic Updates**: Modify `app.js`.

## Code Conventions
- Use semantic HTML.
- Keep CSS organizing by component/section.
- Use distinct function names in `app.js` for clarity (e.g., `renderCardView`, `populateTable`).
- **Tests Required**: After any implementation (feature or fix), write corresponding test cases in `tests/`.
