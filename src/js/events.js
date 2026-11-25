import { canvasState } from './canvas.js';

/**
 * Attach drag-to-move behavior with 5px grid snapping
 */
export function attachDragHandlers(element, resizer, labelElement) {
  element.addEventListener('mousedown', (e) => {
    if (e.target === resizer || labelElement.isContentEditable) return;
    canvasState.selectShape(element);

    const startX = e.clientX - element.offsetLeft;
    const startY = e.clientY - element.offsetTop;

    function onMove(ev) {
      element.style.left = Math.round((ev.clientX - startX) / 5) * 5 + 'px';
      element.style.top = Math.round((ev.clientY - startY) / 5) * 5 + 'px';
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
 * Attach resize behavior with 5px grid snapping
 */
export function attachResizeHandlers(element, resizer) {
  resizer.addEventListener('mousedown', (e) => {
    e.stopPropagation();
    const startW = element.offsetWidth;
    const startH = element.offsetHeight;
    const startX = e.clientX;
    const startY = e.clientY;

    function onResize(ev) {
      const newW = Math.max(30, Math.round((startW + ev.clientX - startX) / 5) * 5);
      const newH = Math.max(30, Math.round((startH + ev.clientY - startY) / 5) * 5);
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
 * Global keyboard shortcuts
 */
export function initKeyboardShortcuts() {
  window.addEventListener('keydown', (e) => {
    const selected = canvasState.selected;
    const isEditingText = selected && selected.querySelector('span')?.isContentEditable;

    // Delete key shortcut
    if ((e.key === 'Backspace' || e.key === 'Delete') && selected && !isEditingText) {
      canvasState.deleteSelected();
      return;
    }

    // Duplicate shortcut: Cmd+D (Mac) or Ctrl+D (Windows/Linux)
    if ((e.metaKey || e.ctrlKey) && (e.key === 'd' || e.key === 'D') && selected && !isEditingText) {
      e.preventDefault();
      canvasState.duplicateSelected();
    }
  });
}
