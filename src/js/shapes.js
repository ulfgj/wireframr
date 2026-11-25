import { canvasState } from './canvas.js';
import { attachDragHandlers, attachResizeHandlers, attachTextEditHandlers } from './events.js';

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
    shapeCounters[type] = (shapeCounters[type] || 0) + 1;
    labelText = `${config.defaultLabel} ${shapeCounters[type]}`;
  }

  el.style.left = `${Math.round(left / 5) * 5}px`;
  el.style.top = `${Math.round(top / 5) * 5}px`;
  el.style.width = `${Math.round(width / 5) * 5}px`;
  el.style.height = `${Math.round(height / 5) * 5}px`;
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
