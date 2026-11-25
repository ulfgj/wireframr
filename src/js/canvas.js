import { createShape } from './shapes.js';

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
    element.style.zIndex = this.nextZIndex();
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
      shape.style.zIndex = this.nextZIndex();
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
      const label = span ? span.innerText : '';

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
        label,
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
  }
}

export const canvasState = new CanvasState();
