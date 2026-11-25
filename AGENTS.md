# Wireframr Development Guide

Consult `SPEC.md` for product requirements and feature specifications.

## Tech Stack & Architecture
- **Vanilla Web**: Pure HTML5, CSS3, modern ES Modules (native browser `import`/`export`).
- **Structure**:
  - `index.html`: Entry document.
  - `src/css/`: Modular stylesheets (`main.css`, `toolbar.css`, `shapes.css`, `settings.css`).
  - `src/js/`: Modular JavaScript (`main.js`, `canvas.js`, `shapes.js`, `events.js`, `settings.js`).

## Commands & Local Dev
- Start local dev server: `python3 -m http.server 8000` (or `npx serve .`)
- Open in browser: `http://localhost:8000`

## Coding Standards & Safety
- Keep modules focused with clean single responsibilities.
- Avoid external runtime dependencies unless explicitly planned.
- Retain 5px grid snapping and native event handling patterns.
