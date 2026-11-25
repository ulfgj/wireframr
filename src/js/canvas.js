import { createShape, resetShapeCounters } from './shapes.js';
import { settings } from './settings.js';

/**
 * Canvas state management with multi-selection support
 */
class CanvasState {
  constructor() {
    this.selectedShapes = new Set();
    this.zIndex = 1;
    this.canvasElement = document.getElementById('canvas');
  }

  // Backwards compatibility getter for single selected shape
  get selected() {
    return this.selectedShapes.size > 0 ? Array.from(this.selectedShapes)[0] : null;
  }

  hasSelection() {
    return this.selectedShapes.size > 0;
  }

  isSelected(element) {
    return this.selectedShapes.has(element);
  }

  nextZIndex() {
    return ++this.zIndex;
  }

  selectShape(element) {
    this.clearSelection();
    if (element) {
      this.addShapeToSelection(element);
    }
  }

  addShapeToSelection(element) {
    if (!element) return;
    this.selectedShapes.add(element);
    element.classList.add('selected');
  }

  getSortedShapesByZIndex() {
    if (!this.canvasElement) return [];
    return Array.from(this.canvasElement.querySelectorAll('.shape')).sort(
      (a, b) => (parseInt(a.style.zIndex, 10) || 0) - (parseInt(b.style.zIndex, 10) || 0)
    );
  }

  applyNormalizedZOrder(orderedShapes) {
    orderedShapes.forEach((shape, idx) => {
      shape.style.zIndex = idx + 1;
    });
    this.zIndex = Math.max(this.zIndex, orderedShapes.length);
  }

  moveSelectedForward() {
    if (this.selectedShapes.size === 0) return;
    const ordered = this.getSortedShapesByZIndex();
    for (let i = ordered.length - 2; i >= 0; i--) {
      if (this.selectedShapes.has(ordered[i]) && !this.selectedShapes.has(ordered[i + 1])) {
        [ordered[i], ordered[i + 1]] = [ordered[i + 1], ordered[i]];
      }
    }
    this.applyNormalizedZOrder(ordered);
  }

  moveSelectedBackward() {
    if (this.selectedShapes.size === 0) return;
    const ordered = this.getSortedShapesByZIndex();
    for (let i = 1; i < ordered.length; i++) {
      if (this.selectedShapes.has(ordered[i]) && !this.selectedShapes.has(ordered[i - 1])) {
        [ordered[i], ordered[i - 1]] = [ordered[i - 1], ordered[i]];
      }
    }
    this.applyNormalizedZOrder(ordered);
  }

  bringSelectedToFront() {
    if (this.selectedShapes.size === 0) return;
    const ordered = this.getSortedShapesByZIndex();
    const unselected = ordered.filter((el) => !this.selectedShapes.has(el));
    const selected = ordered.filter((el) => this.selectedShapes.has(el));
    this.applyNormalizedZOrder([...unselected, ...selected]);
  }

  sendSelectedToBack() {
    if (this.selectedShapes.size === 0) return;
    const ordered = this.getSortedShapesByZIndex();
    const selected = ordered.filter((el) => this.selectedShapes.has(el));
    const unselected = ordered.filter((el) => !this.selectedShapes.has(el));
    this.applyNormalizedZOrder([...selected, ...unselected]);
  }

  removeShapeFromSelection(element) {
    if (!element) return;
    this.selectedShapes.delete(element);
    element.classList.remove('selected');
  }

  toggleShapeSelection(element) {
    if (this.isSelected(element)) {
      this.removeShapeFromSelection(element);
    } else {
      this.addShapeToSelection(element);
    }
  }

  selectShapes(elements) {
    const newSet = new Set(elements);
    // Deselect elements no longer selected
    for (const shape of this.selectedShapes) {
      if (!newSet.has(shape)) {
        shape.classList.remove('selected');
      }
    }
    // Select new elements
    for (const shape of newSet) {
      shape.classList.add('selected');
    }
    this.selectedShapes = newSet;
  }

  clearSelection() {
    for (const shape of this.selectedShapes) {
      shape.classList.remove('selected');
    }
    this.selectedShapes.clear();
  }

  duplicateSelected() {
    if (this.selectedShapes.size === 0) return [];

    const shapesToClone = Array.from(this.selectedShapes);
    const newClones = [];

    for (const el of shapesToClone) {
      let type = 'box';
      if (el.classList.contains('circle')) {
        type = 'circle';
      } else if (el.classList.contains('text')) {
        type = 'text';
      }

      const span = el.querySelector('span');
      const currentLabel = span ? span.innerText.trim() : '';

      // Increment trailing number if present, otherwise append " 2"
      let newLabel;
      const match = currentLabel.match(/^(.*?)(\d+)$/);
      if (match) {
        const prefix = match[1];
        const num = parseInt(match[2], 10) + 1;
        newLabel = `${prefix}${num}`;
      } else if (currentLabel) {
        newLabel = `${currentLabel} 2`;
      } else {
        newLabel = '';
      }

      const currentLeft = el.offsetLeft;
      const currentTop = el.offsetTop;
      const width = el.offsetWidth;
      const height = el.offsetHeight;

      // Duplicate offset by 20px (matches 10px visual grid and 5px snap)
      const newShape = createShape(type, {
        left: currentLeft + 20,
        top: currentTop + 20,
        width,
        height,
        label: newLabel,
      });

      newClones.push(newShape);
    }

    // Select all the newly cloned shapes together
    this.selectShapes(newClones);
    return newClones;
  }

  deleteSelected() {
    for (const shape of this.selectedShapes) {
      shape.remove();
    }
    this.selectedShapes.clear();
  }

  clearCanvas() {
    if (this.canvasElement) {
      this.canvasElement.innerHTML = '';
    }
    this.selectedShapes.clear();
    if (settings.resetCountersOnClear) {
      resetShapeCounters();
    }
  }
}

export const canvasState = new CanvasState();
