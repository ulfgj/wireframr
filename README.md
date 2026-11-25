# Wireframr

A lightweight, distraction-free browser tool for quick low-fidelity wireframing and flow mapping.

🚀 **Live Web App**: [https://ulfgj.github.io/wireframr/](https://ulfgj.github.io/wireframr/)

## What You Can Do
- **Add & Auto-Number Shapes**: Insert boxes, circles, and text labels with automatic collision-free incremental numbering (`Box! 1`, `Box! 2`...) across both creation and duplication.
- **Marquee Multi-Selection**: Click and drag from empty canvas space to draw a selection rectangle selecting multiple shapes at once (hold `Shift` to add to selection).
- **Group Move & Translucent Drag**: Drag elements with configurable grid snapping (`5px` default) against a 10px dot grid background; dragged items turn translucent (60% default opacity) so you can align against underlying items.
- **Layer Ordering**: Automatically bring clicked items to the front (toggleable in Settings) or press `[` and `]` to step selected items backward/forward one z-index layer at a time (`Shift + [` / `Shift + ]` jumps to the very back/front).
- **Resize**: Drag the bottom-right corner handle of any selected shape (hold `Shift` or `Cmd`/`Ctrl` to lock aspect ratio).
- **Edit Text**: Double-click any element to edit its text inline.
- **Duplicate**: Clone single or multiple selected shapes with a diagonal step using **Duplicate** or `Cmd + D` / `Ctrl + D` (always picks the next globally unused number).
- **Delete & Clear**: Remove selected shapes with `Backspace` / `Delete` or clear the entire canvas.
- **Customize Settings**: Click the cogwheel in the toolbar to configure:
  - *Reset numbers on Clear All*
  - *Bring clicked item to front*
  - *Grid snap distance* (`Off`, `5px`, `10px`, `20px`)
  - *Grid dot visibility* (live canvas contrast slider)
  - *Drag item opacity* (`20%`–`100%`)
- **Quick Shortcuts Guide**: Click the `?` button in the toolbar (or press `?`) to slide down the full list of mouse and keyboard shortcuts.

## Tech Stack
- Pure HTML5, CSS3, modern Vanilla ES Modules.
- Zero build tools or external runtime dependencies.
- Deployed directly to GitHub Pages.

## Getting Started (Local Development)
Run a local web server from the project directory:

```bash
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000) in your browser.
