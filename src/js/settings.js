/**
 * Application settings state and UI controller
 */
export const settings = {
  resetCountersOnClear: true,
  bringToFrontOnClick: true,
  snapDistance: 5,
  dotVisibility: 25, // 0 to 100 scale (25 matches default subtle slate dots)
  dragOpacity: 60, // 20 to 100 percentage opacity while dragging items
};

/**
 * Snap a coordinate or dimension value to the active grid snap distance
 * @param {number} value
 * @returns {number}
 */
export function snapToGrid(value) {
  const step = settings.snapDistance || 1;
  return Math.round(value / step) * step;
}

/**
 * Live-update CSS custom properties for canvas dot grid color and size
 * @param {number} visibility - 0 to 100
 */
export function applyDotVisibility(visibility) {
  const clamped = Math.max(0, Math.min(100, Number(visibility)));
  settings.dotVisibility = clamped;
  const t = clamped / 100;

  // Interpolate RGB from light slate (148, 163, 184) to deep slate (15, 23, 42)
  const r = Math.round(148 - t * (148 - 15));
  const g = Math.round(163 - t * (163 - 23));
  const b = Math.round(184 - t * (184 - 42));

  // Interpolate opacity from 0.12 (very faint) to 0.88 (high visibility)
  const alpha = (0.12 + t * 0.76).toFixed(2);

  // Subtly scale dot radius from 0.85px to 1.65px for visibility boost
  const size = (0.85 + t * 0.8).toFixed(2);

  const root = document.documentElement;
  root.style.setProperty('--dot-color', `rgba(${r}, ${g}, ${b}, ${alpha})`);
  root.style.setProperty('--dot-size', `${size}px`);
}

/**
 * Live-update CSS custom property for dragged item opacity
 * @param {number} opacityPercent - 20 to 100
 */
export function applyDragOpacity(opacityPercent) {
  const clamped = Math.max(20, Math.min(100, Number(opacityPercent)));
  settings.dragOpacity = clamped;
  document.documentElement.style.setProperty('--drag-opacity', (clamped / 100).toFixed(2));
}

/**
 * Initialize settings cogwheel button, popover behavior, and control bindings
 */
export function initSettingsUI() {
  const container = document.getElementById('settings-container');
  const toggleBtn = document.getElementById('btn-settings');
  const popover = document.getElementById('settings-popover');
  const helpContainer = document.getElementById('help-container');
  const helpBtn = document.getElementById('btn-help');
  const helpPopover = document.getElementById('help-popover');
  const resetCheckbox = document.getElementById('setting-reset-numbers');
  const bringToFrontCheckbox = document.getElementById('setting-bring-to-front');
  const snapButtons = document.querySelectorAll('.snap-option');
  const dotSlider = document.getElementById('setting-dot-visibility');
  const dotValueLabel = document.getElementById('dot-visibility-value');
  const dragOpacitySlider = document.getElementById('setting-drag-opacity');
  const dragOpacityLabel = document.getElementById('drag-opacity-value');

  if (!toggleBtn || !popover) return;

  // Apply initial dot visibility and drag opacity
  applyDotVisibility(settings.dotVisibility);
  applyDragOpacity(settings.dragOpacity);

  function closePopover(pop, btn) {
    if (!pop || !btn) return;
    pop.setAttribute('hidden', '');
    btn.classList.remove('active');
    btn.setAttribute('aria-expanded', 'false');
  }

  function openPopover(pop, btn) {
    if (!pop || !btn) return;
    pop.removeAttribute('hidden');
    btn.classList.add('active');
    btn.setAttribute('aria-expanded', 'true');
  }

  // Toggle settings popover (closes help popover if open)
  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isHidden = popover.hasAttribute('hidden');
    if (isHidden) {
      closePopover(helpPopover, helpBtn);
      openPopover(popover, toggleBtn);
    } else {
      closePopover(popover, toggleBtn);
    }
  });

  // Toggle help popover (closes settings popover if open)
  if (helpBtn && helpPopover) {
    helpBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = helpPopover.hasAttribute('hidden');
      if (isHidden) {
        closePopover(popover, toggleBtn);
        openPopover(helpPopover, helpBtn);
      } else {
        closePopover(helpPopover, helpBtn);
      }
    });
  }

  // Close popovers when clicking outside
  window.addEventListener('mousedown', (e) => {
    if (!popover.hasAttribute('hidden') && container && !container.contains(e.target)) {
      closePopover(popover, toggleBtn);
    }
    if (helpPopover && !helpPopover.hasAttribute('hidden') && helpContainer && !helpContainer.contains(e.target)) {
      closePopover(helpPopover, helpBtn);
    }
  });

  // Close popovers on Escape key, or toggle help on '?'
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closePopover(popover, toggleBtn);
      closePopover(helpPopover, helpBtn);
      return;
    }
    if (e.key === '?' && helpPopover && helpBtn) {
      const isEditing = document.activeElement?.isContentEditable;
      if (!isEditing) {
        e.preventDefault();
        const isHidden = helpPopover.hasAttribute('hidden');
        if (isHidden) {
          closePopover(popover, toggleBtn);
          openPopover(helpPopover, helpBtn);
        } else {
          closePopover(helpPopover, helpBtn);
        }
      }
    }
  });

  // 1. Reset numbers on Clear All toggle
  if (resetCheckbox) {
    resetCheckbox.checked = settings.resetCountersOnClear;
    resetCheckbox.addEventListener('change', (e) => {
      settings.resetCountersOnClear = e.target.checked;
    });
  }

  // 1b. Bring clicked item to front toggle
  if (bringToFrontCheckbox) {
    bringToFrontCheckbox.checked = settings.bringToFrontOnClick;
    bringToFrontCheckbox.addEventListener('change', (e) => {
      settings.bringToFrontOnClick = e.target.checked;
    });
  }

  // 2. Grid snap distance options
  snapButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const dist = parseInt(btn.dataset.snap, 10);
      if (!isNaN(dist) && dist > 0) {
        settings.snapDistance = dist;
        snapButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
      }
    });
  });

  // 3. Live dot visibility / contrast slider
  if (dotSlider) {
    dotSlider.value = String(settings.dotVisibility);
    dotSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      applyDotVisibility(val);
      if (dotValueLabel) {
        dotValueLabel.textContent = `${val}%`;
      }
    });
  }

  // 4. Drag item opacity slider
  if (dragOpacitySlider) {
    dragOpacitySlider.value = String(settings.dragOpacity);
    dragOpacitySlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      applyDragOpacity(val);
      if (dragOpacityLabel) {
        dragOpacityLabel.textContent = `${val}%`;
      }
    });
  }
}
