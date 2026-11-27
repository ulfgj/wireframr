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
   - Outlined typography logo (`#94a3b8` slate contour) with elongated flourish and circular node displayed in the top-left corner (`51px` height).
   - Fixed header element with `pointer-events: none` and a soft radial-gradient backdrop fading behind and below the logo to soften background dots without blocking drawing or dragging.
3. **Toolbar**:
   - Create shapes: Box (rectangle container), Circle (node), Text (label), Image (image placeholder/container).
   - Duplicate selected shapes (clones all selected preserving relative layout).
   - Delete selected shape(s).
   - Clear all canvas elements.
   - Text alignment button group: Left, Center, and Right buttons to format text alignment on all selected shapes.
   - Integrated right-side utility controls (separated by a vertical divider): Settings Cogwheel (`#btn-settings`) and Shortcuts & Hints (`#btn-help` / `?`).
   - Responsive positioning: centered on wide viewports while clamping its left edge (`min 325px`) so resizing the browser window never causes the toolbar to overlap the top-left brand logo.
4. **Shapes & Manipulation**:
   - Initial centered placement with slight random jitter.
   - Configurable grid snapping (`5px` default; `Off`/1px, `5px`, `10px`, `20px`) during drag-to-move, corner resizing, and initial placement (against a 10px dot grid).
   - Group dragging: moving one selected shape translates all selected shapes in sync.
   - Translucent drag feedback: shapes apply `.dragging` (`opacity: var(--drag-opacity)`, default 60%) once mouse movement starts so underlying shapes and grid dots remain visible while positioning.
   - Layer stacking control: configurable "Bring clicked item to front" setting on direct click (while marquee selection always preserves relative layer order), plus explicit `[` / `]` single-step z-index layer movement and `Shift + [` / `Shift + ]` to send all the way to back/front.
   - Distinct appearance for Box (`.box`), Circle (`.circle`), Text (`.text`), and Image (`.image`).
   - Image blocks support loading any image file via double-click file picker or drag-and-drop, rendering with `object-fit: cover` while preserving drag, resize, and duplication.
   - Collision-free incremental auto-numbering on creation and duplication using a unified high-water mark + canvas prefix scan (e.g. duplicating `Box! 5` when `Box! 8` already exists names the new item `Box! 9`, and clicking `+ Box` next creates `Box! 10`).
   - Resizer handle displayed at bottom-right corner when selected.
   - Proportional scaling: holding `Shift`, `Cmd`, or `Ctrl` while dragging corner locks aspect ratio with uniform scale projection.
   - Duplication preserves shape dimensions, assigns the next globally unused prefix number, and offsets diagonally by (+20px, +20px).
5. **Text Editing**:
   - Double-click to inline edit text content.
   - Select all text on double click; exit edit mode on blur.
6. **Keyboard Shortcuts**:
   - `Backspace` or `Delete`: Deletes currently selected shape(s) (unless currently editing text).
   - `Cmd + D` / `Ctrl + D`: Duplicates currently selected shape(s) (unless currently editing text).
   - `]` / `[`: Steps selected shape(s) forward (`]`) or backward (`[`) by one layer in the z-index stack (hold `Shift` with `]` or `[` to jump all the way to the front or back).
   - `?`: Toggles the Shortcuts & Hints popover.
   - `Escape`: Closes the settings or help popover if open.
7. **Settings & Help Popovers (Toolbar Cogwheel & `?` Button)**:
   - **Reset numbers on Clear All**: Checkbox toggle (enabled by default) controlling whether `Clear All` resets item auto-numbering back to 1.
   - **Bring clicked item to front**: Checkbox toggle (enabled by default) controlling whether directly clicking a shape elevates it to the top layer.
   - **Grid snap distance**: Configurable snapping step (`Off` / 1px, `5px` default, `10px`, `20px`) applied to drag-to-move, resizing, and shape placement.
   - **Grid dot visibility**: Live range slider (0%–100%) that dynamically updates `--dot-color` and `--dot-size` CSS variables in real time on the canvas.
   - **Drag item opacity**: Range slider (20%–100%, default 60%) controlling the translucency (`--drag-opacity`) of shapes while they are actively being dragged so underlying shapes and grid dots remain visible.
   - **Shortcuts & Hints (`?` button)**: Slide-down popover displaying all mouse and keyboard interactions in a formatted list.
8. **Deployment**:
   - Automated zero-dependency static deployment via GitHub Pages at `https://ulfgj.github.io/wireframr/`.
   - `.nojekyll` enabled for native ES module and asset serving.
