# Wireframr Specification

## Overview
Wireframr is a lightweight, browser-based wireframing tool for rapid low-fidelity prototyping on an infinite-feeling dot grid canvas.

## Core Features & Requirements
1. **Interactive Canvas**:
   - Radial dot grid background (10px spacing).
   - Click background to deselect shapes.
2. **Toolbar**:
   - Create shapes: Box (rectangle container), Circle (node), Text (label).
   - Duplicate selected shape (with offset snapped to grid).
   - Delete selected shape.
   - Clear all canvas elements.
3. **Shapes & Manipulation**:
   - Initial centered placement with slight random jitter.
   - Snapping to a 5px grid during drag-to-move and corner resizing (against a 10px dot grid).
   - Z-index elevation when selecting, creating, or duplicating elements.
   - Distinct appearance for Box (`.box`), Circle (`.circle`), and Text (`.text`).
   - Resizer handle displayed at bottom-right corner when selected.
   - Duplication preserves shape dimensions, label text, and type with an offset (+20px, +20px).
4. **Text Editing**:
   - Double-click to inline edit text content.
   - Select all text on double click; exit edit mode on blur.
5. **Keyboard Shortcuts**:
   - `Backspace` or `Delete`: Deletes currently selected shape (unless currently editing text).
   - `Cmd + D` / `Ctrl + D`: Duplicates currently selected shape (unless currently editing text).
