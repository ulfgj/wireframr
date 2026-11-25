import { canvasState } from './canvas.js';
import { snapToGrid } from './settings.js';

/**
 * Attach drag-to-move behavior with configurable grid snapping and multi-selection group dragging
 */
export function attachDragHandlers(element, resizer, labelElement) {
  element.addEventListener('mousedown', (e) => {
    if (e.target === resizer || labelElement.isContentEditable) return;

    // Handle shift-click for toggle
    if (e.shiftKey) {
      canvasState.toggleShapeSelection(element);
      return;
    }

    // If clicking an unselected shape without shift, select only it
    if (!canvasState.isSelected(element)) {
      canvasState.selectShape(element);
    }

    // Capture initial positions for all currently selected shapes
    const selectedElements = Array.from(canvasState.selectedShapes);
    const startMouseX = e.clientX;
    const startMouseY = e.clientY;

    const initialPositions = selectedElements.map((el) => ({
      el,
      startLeft: el.offsetLeft,
      startTop: el.offsetTop,
    }));

    function onMove(ev) {
      const deltaX = ev.clientX - startMouseX;
      const deltaY = ev.clientY - startMouseY;

      // Snap deltas to configured grid distance
      const snappedDeltaX = snapToGrid(deltaX);
      const snappedDeltaY = snapToGrid(deltaY);

      for (const item of initialPositions) {
        item.el.style.left = `${item.startLeft + snappedDeltaX}px`;
        item.el.style.top = `${item.startTop + snappedDeltaY}px`;
      }
    }

    function onUp() {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    }

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  });
}

/**
 * Attach resize behavior with configurable grid snapping and aspect-ratio locking (Shift, Cmd, or Ctrl)
 */
export function attachResizeHandlers(element, resizer) {
  resizer.addEventListener('mousedown', (e) => {
    e.stopPropagation();
    e.preventDefault(); // Prevent text selection or browser drag gestures during resize

    const startW = element.offsetWidth;
    const startH = element.offsetHeight;
    const aspectRatio = startW / startH;
    const isSquare = Math.abs(aspectRatio - 1) < 0.02; // e.g. circles
    const startX = e.clientX;
    const startY = e.clientY;

    function onResize(ev) {
      const lockAspect = ev.shiftKey || ev.metaKey || ev.ctrlKey;
      const dragX = ev.clientX - startX;
      const dragY = ev.clientY - startY;

      let newW;
      let newH;

      if (lockAspect) {
        // Uniform scaling based on the dominant mouse movement
        let scale;
        if (Math.abs(dragX) >= Math.abs(dragY * aspectRatio)) {
          scale = Math.max(0.1, (startW + dragX) / startW);
        } else {
          scale = Math.max(0.1, (startH + dragY) / startH);
        }

        if (isSquare) {
          // Strictly keep width == height for circles and squares
          const side = Math.max(30, snapToGrid(startW * scale));
          newW = side;
          newH = side;
        } else {
          newW = Math.max(30, snapToGrid(startW * scale));
          newH = Math.max(30, snapToGrid(newW / aspectRatio));
        }
      } else {
        newW = Math.max(30, snapToGrid(startW + dragX));
        newH = Math.max(30, snapToGrid(startH + dragY));
      }

      element.style.width = newW + 'px';
      element.style.height = newH + 'px';
    }

    function onUp() {
      window.removeEventListener('mousemove', onResize);
      window.removeEventListener('mouseup', onUp);
    }

    window.addEventListener('mousemove', onResize);
    window.addEventListener('mouseup', onUp);
  });
}

/**
 * Attach inline text editing behavior
 */
export function attachTextEditHandlers(element, labelElement) {
  element.addEventListener('dblclick', () => {
    labelElement.contentEditable = 'true';
    labelElement.focus();
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(labelElement);
    selection.removeAllRanges();
    selection.addRange(range);
  });

  labelElement.addEventListener('blur', () => {
    labelElement.contentEditable = 'false';
  });
}

/**
 * Rubberband / Marquee selection from canvas background
 */
export function initMarqueeSelection() {
  const canvas = canvasState.canvasElement;

  canvas.addEventListener('mousedown', (e) => {
    // Only trigger when clicking directly on canvas or body, not on shapes/toolbar
    if (e.target !== canvas && e.target !== document.body) return;

    // Deselect existing shapes unless Shift is held
    if (!e.shiftKey) {
      canvasState.clearSelection();
    }

    const startX = e.clientX;
    const startY = e.clientY;

    const selectionBox = document.createElement('div');
    selectionBox.className = 'selection-box';
    selectionBox.style.left = `${startX}px`;
    selectionBox.style.top = `${startY}px`;
    selectionBox.style.width = '0px';
    selectionBox.style.height = '0px';
    document.body.appendChild(selectionBox);

    const allShapes = Array.from(document.querySelectorAll('.shape'));
    const initialSelected = new Set(canvasState.selectedShapes);

    function onMove(ev) {
      const currentX = ev.clientX;
      const currentY = ev.clientY;

      const boxLeft = Math.min(startX, currentX);
      const boxTop = Math.min(startY, currentY);
      const boxWidth = Math.abs(currentX - startX);
      const boxHeight = Math.abs(currentY - startY);

      selectionBox.style.left = `${boxLeft}px`;
      selectionBox.style.top = `${boxTop}px`;
      selectionBox.style.width = `${boxWidth}px`;
      selectionBox.style.height = `${boxHeight}px`;

      const boxRight = boxLeft + boxWidth;
      const boxBottom = boxTop + boxHeight;

      // Check intersection with each shape
      const newlySelected = [];
      for (const shape of allShapes) {
        const sLeft = shape.offsetLeft;
        const sTop = shape.offsetTop;
        const sRight = sLeft + shape.offsetWidth;
        const sBottom = sTop + shape.offsetHeight;

        // AABB intersection check
        const intersects = !(
          sRight < boxLeft ||
          sLeft > boxRight ||
          sBottom < boxTop ||
          sTop > boxBottom
        );

        if (intersects || (e.shiftKey && initialSelected.has(shape))) {
          newlySelected.push(shape);
        }
      }

      canvasState.selectShapes(newlySelected);
    }

    function onUp() {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      selectionBox.remove();
    }

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  });
}

/**
 * Global keyboard shortcuts
 */
export function initKeyboardShortcuts() {
  window.addEventListener('keydown', (e) => {
    if (!canvasState.hasSelection()) return;

    // Check if any selected shape is actively being edited
    const isEditingText = Array.from(canvasState.selectedShapes).some(
      (shape) => shape.querySelector('span')?.isContentEditable
    );
    if (isEditingText) return;

    // Delete key shortcut
    if (e.key === 'Backspace' || e.key === 'Delete') {
      canvasState.deleteSelected();
      return;
    }

    // Duplicate shortcut: Cmd+D (Mac) or Ctrl+D (Windows/Linux)
    if ((e.metaKey || e.ctrlKey) && (e.key === 'd' || e.key === 'D')) {
      e.preventDefault();
      canvasState.duplicateSelected();
    }
  });
}
