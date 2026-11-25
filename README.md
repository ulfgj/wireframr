# Wireframr

A lightweight, distraction-free browser tool for quick low-fidelity wireframing and flow mapping.

🚀 **Live Web App**: [https://ulfgj.github.io/wireframr/](https://ulfgj.github.io/wireframr/)

## What You Can Do
- **Add Shapes**: Insert boxes (containers), circles (nodes), and text labels.
- **Marquee Selection**: Click and drag from empty canvas space to draw a selection rectangle selecting multiple shapes at once (hold `Shift` to add to selection).
- **Move & Align**: Drag elements with 5px grid snapping against a 10px dot grid background (moves all selected items in unison).
- **Resize**: Drag the bottom-right corner handle of any selected shape.
- **Edit Text**: Double-click any element to edit its text inline.
- **Duplicate**: Clone single or multiple selected shapes with a diagonal step using **Duplicate** or `Cmd + D` / `Ctrl + D`.
- **Delete & Clear**: Remove selected shapes with `Backspace` / `Delete` or clear the entire canvas.

## Getting Started
Run a local web server from the project directory:

```bash
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000) in your browser.
