import { createShape } from './shapes.js';

/**
 * Canvas state management
 */
class CanvasState {
  constructor() {
    this.selected = null;
    this.zIndex = 1;
    this.canvasElement = document.getElementById('canvas');
  }

  nextZIndex() {
    return ++this.zIndex;
  }

  selectShape(element) {
    if (this.selected) {
      this.selected.classList.remove('selected');
    }
    this.selected = element;
    if (this.selected) {
      this.selected.classList.add('selected');
      this.selected.style.zIndex = this.nextZIndex();
    }
  }

  duplicateSelected() {
    if (!this.selected) return null;

    // Detect shape type from class list
    let type = 'box';
    if (this.selected.classList.contains('circle')) {
      type = 'circle';
    } else if (this.selected.classList.contains('text')) {
      type = 'text';
    }

    const span = this.selected.querySelector('span');
    const label = span ? span.innerText : '';

    const currentLeft = this.selected.offsetLeft;
    const currentTop = this.selected.offsetTop;
    const width = this.selected.offsetWidth;
    const height = this.selected.offsetHeight;

    // Offset duplicate by 20px (retaining 10px grid alignment)
    const newShape = createShape(type, {
      left: currentLeft + 20,
      top: currentTop + 20,
      width,
      height,
      label,
    });

    return newShape;
  }

  deleteSelected() {
    if (this.selected) {
      this.selected.remove();
      this.selected = null;
    }
  }

  clearCanvas() {
    if (this.canvasElement) {
      this.canvasElement.innerHTML = '';
    }
    this.selected = null;
  }
}

export const canvasState = new CanvasState();
