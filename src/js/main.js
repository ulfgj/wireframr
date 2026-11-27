import { canvasState } from './canvas.js';
import { createShape } from './shapes.js';
import { initKeyboardShortcuts, initMarqueeSelection } from './events.js';
import { initSettingsUI } from './settings.js';

function initApp() {
  // Bind toolbar buttons
  document.getElementById('btn-add-box')?.addEventListener('click', () => createShape('box'));
  document.getElementById('btn-add-circle')?.addEventListener('click', () => createShape('circle'));
  document.getElementById('btn-add-text')?.addEventListener('click', () => createShape('text'));
  document.getElementById('btn-add-image')?.addEventListener('click', () => createShape('image'));
  document.getElementById('btn-duplicate')?.addEventListener('click', () => canvasState.duplicateSelected());
  document.getElementById('btn-delete')?.addEventListener('click', () => canvasState.deleteSelected());
  document.getElementById('btn-clear')?.addEventListener('click', () => canvasState.clearCanvas());

  // Text alignment buttons
  document.getElementById('btn-align-left')?.addEventListener('click', () => canvasState.setSelectedAlignment('left'));
  document.getElementById('btn-align-center')?.addEventListener('click', () => canvasState.setSelectedAlignment('center'));
  document.getElementById('btn-align-right')?.addEventListener('click', () => canvasState.setSelectedAlignment('right'));

  // Init settings popover & controls
  initSettingsUI();

  // Init drag box selection from outside items
  initMarqueeSelection();

  // Init global shortcuts
  initKeyboardShortcuts();

  // Initial starter shape
  createShape('box');
}

// Bootstrap once DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
