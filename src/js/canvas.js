import { createShape, getNextShapeLabel, resetShapeCounters } from './shapes.js';
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
    this.updateToolbarState();
  }

  addShapeToSelection(element) {
    if (!element) return;
    this.selectedShapes.add(element);
    element.classList.add('selected');
    this.updateToolbarState();
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
    this.updateToolbarState();
  }

  clearSelection() {
    for (const shape of this.selectedShapes) {
      shape.classList.remove('selected');
    }
    this.selectedShapes.clear();
    this.updateToolbarState();
  }

  updateToolbarState() {
    const btnDuplicate = document.getElementById('btn-duplicate');
    const btnAlignLeft = document.getElementById('btn-align-left');
    const btnAlignCenter = document.getElementById('btn-align-center');
    const btnAlignRight = document.getElementById('btn-align-right');

    const alignButtons = [btnAlignLeft, btnAlignCenter, btnAlignRight];

    if (this.selectedShapes.size === 0) {
      if (btnDuplicate) {
        btnDuplicate.disabled = true;
        btnDuplicate.title = 'Select an item to duplicate';
      }
      alignButtons.forEach((btn) => {
        if (btn) {
          btn.disabled = true;
          btn.classList.remove('active');
        }
      });
      return;
    }

    const hasDuplicable = Array.from(this.selectedShapes).some(
      (el) => !el.classList.contains('image') || el.classList.contains('has-image')
    );

    if (btnDuplicate) {
      btnDuplicate.disabled = !hasDuplicable;
      btnDuplicate.title = hasDuplicable
        ? 'Duplicate (Cmd/Ctrl+D)'
        : 'Add an image first to duplicate';
    }

    // Update text alignment buttons based on selected shapes
    alignButtons.forEach((btn) => {
      if (btn) btn.disabled = false;
    });

    const shapesList = Array.from(this.selectedShapes);
    const firstAlignment = this.getShapeAlignment(shapesList[0]);
    const allSameAlignment = shapesList.every(
      (shape) => this.getShapeAlignment(shape) === firstAlignment
    );

    btnAlignLeft?.classList.toggle('active', allSameAlignment && firstAlignment === 'left');
    btnAlignCenter?.classList.toggle('active', allSameAlignment && firstAlignment === 'center');
    btnAlignRight?.classList.toggle('active', allSameAlignment && firstAlignment === 'right');
  }

  getShapeAlignment(element) {
    if (!element) return 'center';
    if (element.classList.contains('align-left')) return 'left';
    if (element.classList.contains('align-right')) return 'right';
    return 'center';
  }

  setSelectedAlignment(align) {
    if (this.selectedShapes.size === 0) return;
    const validAlign = align === 'left' || align === 'right' ? align : 'center';

    for (const shape of this.selectedShapes) {
      shape.classList.remove('align-left', 'align-center', 'align-right');
      shape.classList.add(`align-${validAlign}`);
    }

    this.updateToolbarState();
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
      } else if (el.classList.contains('image')) {
        // Do not duplicate empty image placeholders until an image is loaded
        if (!el.classList.contains('has-image')) {
          continue;
        }
        type = 'image';
      }

      const span = el.querySelector('span');
      const currentLabel = span ? (span.textContent || '').replace(/\s+/g, ' ').trim() : '';
      const newLabel = getNextShapeLabel(type, currentLabel);
      const img = el.querySelector('img');
      const imageSrc = img ? img.src : undefined;

      const currentLeft = el.offsetLeft;
      const currentTop = el.offsetTop;
      const width = el.offsetWidth;
      const height = el.offsetHeight;
      const align = this.getShapeAlignment(el);

      // Duplicate offset by 20px (matches 10px visual grid and 5px snap)
      const newShape = createShape(type, {
        left: currentLeft + 20,
        top: currentTop + 20,
        width,
        height,
        label: newLabel,
        align,
        imageSrc,
      });

      newClones.push(newShape);
    }

    // Select all the newly cloned shapes together if any were created
    if (newClones.length > 0) {
      this.selectShapes(newClones);
    }
    return newClones;
  }

  deleteSelected() {
    for (const shape of this.selectedShapes) {
      shape.remove();
    }
    this.selectedShapes.clear();
    this.updateToolbarState();
  }

  clearCanvas() {
    if (this.canvasElement) {
      this.canvasElement.innerHTML = '';
    }
    this.selectedShapes.clear();
    if (settings.resetCountersOnClear) {
      resetShapeCounters();
    }
    this.updateToolbarState();
  }
}

export const canvasState = new CanvasState();
