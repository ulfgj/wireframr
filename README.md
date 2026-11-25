# Wireframr

A lightweight, distraction-free browser tool for quick low-fidelity wireframing and flow mapping.

🚀 **Live Web App**: [https://ulfgj.github.io/wireframr/](https://ulfgj.github.io/wireframr/)

## What You Can Do
- **Add Shapes**: Insert boxes (containers), circles (nodes), and text labels.
- **Marquee Multi-Selection**: Click and drag from empty canvas space to draw a selection rectangle selecting multiple shapes at once (hold `Shift` to add to selection).
- **Group Move & Align**: Drag elements with 5px grid snapping against a 10px dot grid background (moves all selected items in unison).
- **Layer Ordering**: Automatically bring clicked items to the front (toggleable in Settings) or press `[` and `]` to step selected items backward/forward one z-index layer at a time (`Shift + [` / `Shift + ]` jumps to the very back/front).
- **Resize**: Drag the bottom-right corner handle of any selected shape (hold `Shift` or `Cmd`/`Ctrl` to lock aspect ratio).
- **Edit Text**: Double-click any element to edit its text inline.
- **Duplicate**: Clone single or multiple selected shapes with a diagonal step using **Duplicate** or `Cmd + D` / `Ctrl + D`.
- **Delete & Clear**: Remove selected shapes with `Backspace` / `Delete` or clear the entire canvas.
- **Customize Settings**: Click the cogwheel on the right side of the toolbar to toggle counter reset on Clear All, adjust grid snap distance (`Off`, `5px`, `10px`, `20px`), boost canvas dot grid visibility live, or set dragged item opacity.
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
