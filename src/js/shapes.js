import { canvasState } from './canvas.js';
import { attachDragHandlers, attachResizeHandlers, attachTextEditHandlers } from './events.js';
import { snapToGrid } from './settings.js';

const SHAPE_CONFIG = {
  box: {
    defaultWidth: 160,
    defaultHeight: 100,
    defaultLabel: 'Box!',
  },
  circle: {
    defaultWidth: 100,
    defaultHeight: 100,
    defaultLabel: 'Circle!',
  },
  text: {
    defaultWidth: 160,
    defaultHeight: 40,
    defaultLabel: 'Text Label',
  },
};

// Per-type incremental counters
export const shapeCounters = {
  box: 0,
  circle: 0,
  text: 0,
};

export function resetShapeCounters() {
  shapeCounters.box = 0;
  shapeCounters.circle = 0;
  shapeCounters.text = 0;
}

/**
 * Compute the next unique incremental label for a shape prefix by checking
 * both the per-type high-water counter and all existing labels on the canvas.
 * @param {string} type - 'box' | 'circle' | 'text'
 * @param {string} [sourceLabel] - Optional existing label when duplicating
 * @returns {string}
 */
export function getNextShapeLabel(type, sourceLabel) {
  const config = SHAPE_CONFIG[type] || SHAPE_CONFIG.box;
  let basePrefix = config.defaultLabel;

  if (sourceLabel !== undefined) {
    const trimmed = sourceLabel.replace(/\s+/g, ' ').trim();
    if (!trimmed) return '';
    const match = trimmed.match(/^(.*?)\s*(\d+)$/);
    basePrefix = match && match[1].trim() ? match[1].trim() : trimmed;
  }

  const isDefaultPrefix = basePrefix === config.defaultLabel;
  let maxNum = isDefaultPrefix ? (shapeCounters[type] || 0) : 1;

  // Scan all shapes on the canvas for the highest number with this prefix (or of this shape type)
  const canvasEl = canvasState.canvasElement || document.getElementById('canvas');
  if (canvasEl) {
    const spans = canvasEl.querySelectorAll('.shape span');
    for (const span of spans) {
      const text = (span.textContent || '').replace(/\s+/g, ' ').trim();
      const match = text.match(/^(.*?)\s*(\d+)$/);
      if (match) {
        const prefix = match[1].trim();
        const num = parseInt(match[2], 10);
        if (prefix === basePrefix || (isDefaultPrefix && span.parentElement?.classList.contains(type))) {
          maxNum = Math.max(maxNum, num);
        }
      } else if (text === basePrefix) {
        maxNum = Math.max(maxNum, 1);
      }
    }
  }

  const nextNum = maxNum + 1;
  shapeCounters[type] = Math.max(shapeCounters[type] || 0, nextNum);

  return `${basePrefix} ${nextNum}`;
}

/**
 * Factory function to create and render a shape
 * @param {string} type - 'box' | 'circle' | 'text'
 * @param {Object} [options] - Optional custom geometry and label
 * @param {number} [options.left]
 * @param {number} [options.top]
 * @param {number} [options.width]
 * @param {number} [options.height]
 * @param {string} [options.label]
 */
export function createShape(type, options = {}) {
  const config = SHAPE_CONFIG[type] || SHAPE_CONFIG.box;
  const el = document.createElement('div');
  el.className = `shape ${type}`;

  const defaultLeft = window.innerWidth / 2 - 75 + (Math.random() * 40 - 20);
  const defaultTop = window.innerHeight / 2 - 50 + (Math.random() * 40 - 20);

  const left = options.left !== undefined ? options.left : defaultLeft;
  const top = options.top !== undefined ? options.top : defaultTop;
  const width = options.width !== undefined ? options.width : config.defaultWidth;
  const height = options.height !== undefined ? options.height : config.defaultHeight;

  let labelText;
  if (options.label !== undefined) {
    labelText = options.label;
  } else {
    labelText = getNextShapeLabel(type);
  }

  el.style.left = `${snapToGrid(left)}px`;
  el.style.top = `${snapToGrid(top)}px`;
  el.style.width = `${snapToGrid(width)}px`;
  el.style.height = `${snapToGrid(height)}px`;
  el.style.zIndex = canvasState.nextZIndex();

  const label = document.createElement('span');
  label.innerText = labelText;
  el.appendChild(label);

  const resizer = document.createElement('div');
  resizer.className = 'resizer';
  el.appendChild(resizer);

  // Attach interactions
  attachDragHandlers(el, resizer, label);
  attachResizeHandlers(el, resizer);
  attachTextEditHandlers(el, label);

  canvasState.canvasElement.appendChild(el);
  canvasState.selectShape(el);

  return el;
}
