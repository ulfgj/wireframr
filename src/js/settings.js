/**
 * Application settings state and UI controller
 */
export const settings = {
  resetCountersOnClear: true,
  snapDistance: 5,
  dotVisibility: 25, // 0 to 100 scale (25 matches default subtle slate dots)
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
 * Initialize settings cogwheel button, popover behavior, and control bindings
 */
export function initSettingsUI() {
  const container = document.getElementById('settings-container');
  const toggleBtn = document.getElementById('btn-settings');
  const popover = document.getElementById('settings-popover');
  const resetCheckbox = document.getElementById('setting-reset-numbers');
  const snapButtons = document.querySelectorAll('.snap-option');
  const dotSlider = document.getElementById('setting-dot-visibility');
  const dotValueLabel = document.getElementById('dot-visibility-value');

  if (!toggleBtn || !popover) return;

  // Apply initial dot visibility
  applyDotVisibility(settings.dotVisibility);

  // Toggle settings popover
  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isHidden = popover.hasAttribute('hidden');
    if (isHidden) {
      popover.removeAttribute('hidden');
      toggleBtn.classList.add('active');
      toggleBtn.setAttribute('aria-expanded', 'true');
    } else {
      popover.setAttribute('hidden', '');
      toggleBtn.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Close popover when clicking outside
  window.addEventListener('mousedown', (e) => {
    if (!popover.hasAttribute('hidden') && container && !container.contains(e.target)) {
      popover.setAttribute('hidden', '');
      toggleBtn.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Close popover on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !popover.hasAttribute('hidden')) {
      popover.setAttribute('hidden', '');
      toggleBtn.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // 1. Reset numbers on Clear All toggle
  if (resetCheckbox) {
    resetCheckbox.checked = settings.resetCountersOnClear;
    resetCheckbox.addEventListener('change', (e) => {
      settings.resetCountersOnClear = e.target.checked;
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
}
