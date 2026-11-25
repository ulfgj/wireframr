# Wireframr Specification

## Overview
Wireframr is a lightweight, browser-based wireframing tool for rapid low-fidelity prototyping on an infinite-feeling dot grid canvas.

## Core Features & Requirements
1. **Interactive Canvas**:
   - Radial dot grid background (10px spacing).
   - Drag background to draw a rubberband/marquee box selecting multiple items.
   - Click background without dragging to clear selection.
   - Shift-click or Shift-drag to augment selection.
2. **Branding & Header**:
   - Outlined typography logo with elongated flourish and circular node displayed in the top-left corner.
   - Fixed header element with `pointer-events: none` to prevent blocking drawing and dragging.
3. **Toolbar**:
   - Create shapes: Box (rectangle container), Circle (node), Text (label).
   - Duplicate selected shapes (clones all selected preserving relative layout).
   - Delete selected shape(s).
   - Clear all canvas elements.
4. **Shapes & Manipulation**:
   - Initial centered placement with slight random jitter.
   - Snapping to a 5px grid during drag-to-move and corner resizing (against a 10px dot grid).
   - Group dragging: moving one selected shape translates all selected shapes in sync.
   - Stable layer stacking: selecting a shape preserves its original z-index so shapes behind stay behind until explicitly reordered.
   - Z-index elevation occurs only upon creating or duplicating new elements.
   - Distinct appearance for Box (`.box`), Circle (`.circle`), and Text (`.text`).
   - Incremental automatic naming on creation (e.g. `Box! 1`, `Circle! 1`, `Text Label 1`).
   - Resizer handle displayed at bottom-right corner when selected.
   - Proportional scaling: holding `Shift`, `Cmd`, or `Ctrl` while dragging corner locks aspect ratio.
   - Duplication preserves shape dimensions, increments trailing number, and types with an offset (+20px, +20px).
5. **Text Editing**:
   - Double-click to inline edit text content.
   - Select all text on double click; exit edit mode on blur.
6. **Keyboard Shortcuts**:
   - `Backspace` or `Delete`: Deletes currently selected shape(s) (unless currently editing text).
   - `Cmd + D` / `Ctrl + D`: Duplicates currently selected shape(s) (unless currently editing text).
7. **Deployment**:
   - Automated zero-dependency static deployment via GitHub Pages at `https://ulfgj.github.io/wireframr/`.
   - `.nojekyll` enabled for native ES module and asset serving.
