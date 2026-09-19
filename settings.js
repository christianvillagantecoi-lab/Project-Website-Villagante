/* --- SLIDE-OUT SETTINGS CABINET LOGIC --- */

const THEMES = {
  'dark': {
    '--bg-color': '#0f0f0f',
    '--card-bg': '#0f0f0f',
    '--card-hover': '#252530',
    '--accent-color': '#aaaaaa',
    '--text-main': '#ffffff',
    '--text-muted': '#aaaaaa',
    '--border-color': '#2a2a36'
  },
  'light': {
    '--bg-color': '#f4f4f7',
    '--card-bg': '#f4f4f7',
    '--card-hover': '#e9e9f0',
    '--accent-color': '#666675',
    '--text-main': '#111115',
    '--text-muted': '#666675',
    '--border-color': '#d1d1dc'
  },
  'cyber': {
    '--bg-color': '#0d0003',
    '--card-bg': '#1f0007',
    '--card-hover': '#33000b',
    '--accent-color': '#ff003c',
    '--text-main': '#ffffff',
    '--text-muted': '#ff809b',
    '--border-color': '#4a0011'
  },
  'midnight': {
    '--bg-color': '#070b19',
    '--card-bg': '#0f172a',
    '--card-hover': '#1e293b',
    '--accent-color': '#38bdf8',
    '--text-main': '#f8fafc',
    '--text-muted': '#94a3b8',
    '--border-color': '#1e293b'
  }
};

/* Toggle Cabinet Drawer Open/Close */
function toggleSettingsDrawer() {
  const drawer = document.getElementById('settingsDrawer');
  const backdrop = document.getElementById('settingsBackdrop');

  if (drawer && backdrop) {
    drawer.classList.toggle('open');
    backdrop.classList.toggle('active');
  }
}

/* Apply Theme */
function selectPresetTheme(presetKey) {
  if (!THEMES[presetKey]) return;

  localStorage.removeItem('custom_theme');
  localStorage.setItem('preset_theme', presetKey);

  applyThemeVars(THEMES[presetKey]);

  document.querySelectorAll('.theme-option-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById(`theme-btn-${presetKey}`);
  if (activeBtn) activeBtn.classList.add('active');

  updateColorPickers(THEMES[presetKey]);
}

/* Live Custom Color Picker Adjustment */
function updateCustomColor(cssVar, colorValue) {
  document.documentElement.style.setProperty(cssVar, colorValue);

  let customTheme = JSON.parse(localStorage.getItem('custom_theme')) || {};
  customTheme[cssVar] = colorValue;

  localStorage.setItem('custom_theme', JSON.stringify(customTheme));
  document.querySelectorAll('.theme-option-btn').forEach(btn => btn.classList.remove('active'));
}

function applyThemeVars(themeObj) {
  Object.keys(themeObj).forEach(key => {
    document.documentElement.style.setProperty(key, themeObj[key]);
  });
}

function updateColorPickers(preset) {
  if (document.getElementById('bgPicker')) document.getElementById('bgPicker').value = preset['--bg-color'];
  if (document.getElementById('cardPicker')) document.getElementById('cardPicker').value = preset['--card-bg'];
  if (document.getElementById('textPicker')) document.getElementById('textPicker').value = preset['--text-main'];
  if (document.getElementById('accentPicker')) document.getElementById('accentPicker').value = preset['--accent-color'];
}

function resetSettingsTheme() {
  selectPresetTheme('dark');
}

/* Initialize Theme on Page Load */
function initThemeSettings() {
  const savedCustom = localStorage.getItem('custom_theme');
  const savedPreset = localStorage.getItem('preset_theme') || 'dark';

  if (savedCustom) {
    applyThemeVars(JSON.parse(savedCustom));
  } else if (THEMES[savedPreset]) {
    selectPresetTheme(savedPreset);
  }
}
/* Switch between Main Settings Menu and Theme Sub-View */
function openDrawerSubView(viewName) {
  const mainView = document.getElementById('drawerMainView');
  const themeView = document.getElementById('drawerThemeView');

  if (viewName === 'theme') {
    mainView.classList.remove('active-view');
    themeView.classList.add('active-view');
  } else {
    themeView.classList.remove('active-view');
    mainView.classList.add('active-view');
  }
}

/* Toggle Drawer Open/Close (Resets to Main View when closed) */
function toggleSettingsDrawer() {
  const drawer = document.getElementById('settingsDrawer');
  const backdrop = document.getElementById('settingsBackdrop');

  if (drawer && backdrop) {
    const isOpen = drawer.classList.contains('open');

    drawer.classList.toggle('open');
    backdrop.classList.toggle('active');

    // Reset back to main settings menu whenever drawer closes
    if (isOpen) {
      setTimeout(() => openDrawerSubView('main'), 300);
    }
  }
}
initThemeSettings();