# Wireframr Development Guide

Consult `SPEC.md` for product requirements and feature specifications.

## Tech Stack & Architecture
- **Vanilla Web**: Pure HTML5, CSS3, modern ES Modules (native browser `import`/`export`).
- **Structure**:
  - `index.html`: Entry document.
  - `src/css/`: Modular stylesheets (`main.css`, `toolbar.css`, `shapes.css`, `settings.css`).
  - `src/js/`: Modular JavaScript (`main.js`, `canvas.js`, `shapes.js`, `events.js`, `settings.js`).
  - `src/img/`: Brand logo assets (`logo.svg`, `logo.png`).

## Commands & Local Dev
- Start local dev server: `python3 -m http.server 8000` (or `npx serve .`)
- Open in browser: `http://localhost:8000`
- Validate JS syntax: `node -c src/js/*.js`

## Coding Standards & Safety
- Keep modules focused with clean single responsibilities.
- Avoid external runtime dependencies unless explicitly planned.
- Route coordinate/dimension snapping through `snapToGrid()` in `src/js/settings.js`.
