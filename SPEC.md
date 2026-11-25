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
   - `Escape`: Closes the settings popover if open.
7. **Settings Popover (Toolbar Cogwheel)**:
   - **Reset numbers on Clear All**: Checkbox toggle (enabled by default) controlling whether `Clear All` resets item auto-numbering back to 1.
   - **Grid snap distance**: Configurable snapping step (`Off` / 1px, `5px` default, `10px`, `20px`) applied to drag-to-move, resizing, and shape placement.
   - **Grid dot visibility**: Live range slider (0%–100%) that dynamically updates `--dot-color` and `--dot-size` CSS variables in real time on the canvas.
   - **Drag item opacity**: Range slider (20%–100%, default 60%) controlling the translucency (`--drag-opacity`) of shapes while they are actively being dragged so underlying shapes and grid dots remain visible.
8. **Deployment**:
   - Automated zero-dependency static deployment via GitHub Pages at `https://ulfgj.github.io/wireframr/`.
   - `.nojekyll` enabled for native ES module and asset serving.
