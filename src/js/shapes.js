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
  image: {
    defaultWidth: 160,
    defaultHeight: 120,
    defaultLabel: 'Image',
  },
};

// Per-type incremental counters
export const shapeCounters = {
  box: 0,
  circle: 0,
  text: 0,
  image: 0,
};

export function resetShapeCounters() {
  shapeCounters.box = 0;
  shapeCounters.circle = 0;
  shapeCounters.text = 0;
  shapeCounters.image = 0;
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
 * Load an image source into an image shape element
 * @param {HTMLElement} el
 * @param {string} src
 */
function setImageSource(el, src) {
  let img = el.querySelector('img');
  if (!img) {
    img = document.createElement('img');
    img.alt = 'Wireframe image';
    el.insertBefore(img, el.querySelector('.resizer'));
  }
  img.src = src;
  el.classList.add('has-image');
  const placeholder = el.querySelector('.image-placeholder');
  if (placeholder) {
    placeholder.style.display = 'none';
  }
  canvasState.updateToolbarState();
}

/**
 * Attach double-click file picker and drag-and-drop image loading to an image shape
 * @param {HTMLElement} el
 */
function attachImageHandlers(el) {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.style.display = 'none';
  el.appendChild(fileInput);

  const loadFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof ev.target?.result === 'string') {
        setImageSource(el, ev.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    loadFile(file);
    fileInput.value = '';
  });

  el.addEventListener('dblclick', (e) => {
    e.stopPropagation();
    fileInput.click();
  });

  el.addEventListener('dragover', (e) => {
    e.preventDefault();
    el.classList.add('drag-over');
  });

  el.addEventListener('dragleave', () => {
    el.classList.remove('drag-over');
  });

  el.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    el.classList.remove('drag-over');
    const file = e.dataTransfer?.files?.[0];
    loadFile(file);
  });
}

/**
 * Factory function to create and render a shape
 * @param {string} type - 'box' | 'circle' | 'text' | 'image'
 * @param {Object} [options] - Optional custom geometry, label, alignment, and imageSrc
 * @param {number} [options.left]
 * @param {number} [options.top]
 * @param {number} [options.width]
 * @param {number} [options.height]
 * @param {string} [options.label]
 * @param {string} [options.align] - 'left' | 'center' | 'right'
 * @param {string} [options.imageSrc]
 */
export function createShape(type, options = {}) {
  const config = SHAPE_CONFIG[type] || SHAPE_CONFIG.box;
  const el = document.createElement('div');
  const alignment = options.align === 'left' || options.align === 'right' ? options.align : 'center';
  el.className = `shape ${type} align-${alignment}`;

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

  const resizer = document.createElement('div');
  resizer.className = 'resizer';
  el.appendChild(resizer);

  if (type === 'image') {
    const placeholder = document.createElement('div');
    placeholder.className = 'image-placeholder';
    placeholder.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="8.5" cy="8.5" r="1.5"></circle>
        <polyline points="21 15 16 10 5 21"></polyline>
      </svg>
      <span class="image-label">${labelText}</span>
      <small>Double-click or drop</small>
    `;
    el.insertBefore(placeholder, resizer);

    if (options.imageSrc) {
      setImageSource(el, options.imageSrc);
    }

    attachDragHandlers(el, resizer, { isContentEditable: false });
    attachResizeHandlers(el, resizer);
    attachImageHandlers(el);
  } else {
    const label = document.createElement('span');
    label.innerText = labelText;
    el.insertBefore(label, resizer);

    // Attach interactions
    attachDragHandlers(el, resizer, label);
    attachResizeHandlers(el, resizer);
    attachTextEditHandlers(el, label);
  }

  canvasState.canvasElement.appendChild(el);
  canvasState.selectShape(el);

  return el;
}
