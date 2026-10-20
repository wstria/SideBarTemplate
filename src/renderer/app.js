const shell = document.getElementById('shell');
const tablist = document.getElementById('tablist');
const sidebarToggle = document.getElementById('sidebar-toggle');
const newTabButton = document.getElementById('new-tab');
const settingsOpen = document.getElementById('settings-open');
const settingsView = document.getElementById('settings');

/* ---------------------------------------------------------------- theme --- */

const THEME_KEY = 'sidebar-template-theme';

const FONTS = {
  inter: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  system: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  rounded: '"SF Pro Rounded", ui-rounded, "Nunito", system-ui, sans-serif',
  mono: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace',
  serif: '"New York", Georgia, "Times New Roman", serif'
};

const PRESETS = {
  minimal: {
    name: 'Minimal',
    colors: {
      '--bg': '#000000', '--chrome': '#000000', '--rail': '#000000',
      '--sidebar': '#000000', '--stage': '#000000', '--tab': '#161618',
      '--tab-hover': '#1d1d20', '--tab-active': '#242428', '--line': '#222225',
      '--line-bright': '#33333a', '--text': '#ececec', '--muted': '#a1a1aa',
      '--quiet': '#6e6e78'
    }
  },
  blackout: {
    name: 'Blackout',
    colors: {
      '--bg': '#020302', '--chrome': '#050605', '--rail': '#030403',
      '--sidebar': '#080a08', '--stage': '#070807', '--tab': '#0d100d',
      '--tab-hover': '#121512', '--tab-active': '#151915', '--line': '#1d221e',
      '--line-bright': '#283028', '--text': '#eff2ee', '--muted': '#8e978e',
      '--quiet': '#596159'
    }
  },
  graphite: {
    name: 'Graphite',
    colors: {
      '--bg': '#121315', '--chrome': '#17181b', '--rail': '#141518',
      '--sidebar': '#1b1d21', '--stage': '#161719', '--tab': '#212329',
      '--tab-hover': '#282b31', '--tab-active': '#30333a', '--line': '#2b2e34',
      '--line-bright': '#3a3e45', '--text': '#edeef1', '--muted': '#9aa0ab',
      '--quiet': '#656b75'
    }
  },
  midnight: {
    name: 'Midnight',
    colors: {
      '--bg': '#0a0d14', '--chrome': '#0e121b', '--rail': '#0b0e16',
      '--sidebar': '#121829', '--stage': '#0e131e', '--tab': '#182033',
      '--tab-hover': '#1f283f', '--tab-active': '#27324d', '--line': '#263048',
      '--line-bright': '#354160', '--text': '#e9edf6', '--muted': '#8893a8',
      '--quiet': '#5a6378'
    }
  },
  paper: {
    name: 'Paper',
    colors: {
      '--bg': '#f4f3ef', '--chrome': '#eae8e2', '--rail': '#e4e2db',
      '--sidebar': '#fbfaf7', '--stage': '#ffffff', '--tab': '#e9e7e0',
      '--tab-hover': '#e0ded5', '--tab-active': '#d6d3c9', '--line': '#dcd9d0',
      '--line-bright': '#c9c5ba', '--text': '#1c1b18', '--muted': '#6c685f',
      '--quiet': '#9a968c'
    }
  }
};

const THEME_DEFAULTS = {
  preset: 'minimal',
  accent: '#10a37f',
  font: 'inter',
  fontSize: 14,
  sidebarW: 248,
  railW: 48,
  topbarH: 52,
  radius: 10
};

let theme = { ...THEME_DEFAULTS, ...readTheme() };

function readTheme() {
  try {
    return JSON.parse(localStorage.getItem(THEME_KEY)) || {};
  } catch {
    return {};
  }
}

function saveTheme() {
  localStorage.setItem(THEME_KEY, JSON.stringify(theme));
}

function applyTheme() {
  const root = document.documentElement.style;
  const colors = (PRESETS[theme.preset] || PRESETS.blackout).colors;
  for (const [key, value] of Object.entries(colors)) root.setProperty(key, value);
  root.setProperty('--accent', theme.accent);
  root.setProperty('--font-ui', FONTS[theme.font] || FONTS.system);
  root.setProperty('--font-size', `${theme.fontSize}px`);
  root.setProperty('--sidebar-w', `${theme.sidebarW}px`);
  root.setProperty('--rail-w', `${theme.railW}px`);
  root.setProperty('--topbar-h', `${theme.topbarH}px`);
  root.setProperty('--radius', `${theme.radius}px`);
  document.documentElement.style.colorScheme = theme.preset === 'paper' ? 'light' : 'dark';
}

/* --------------------------------------------------------- settings UI --- */

const presetGrid = document.getElementById('preset-grid');
const controls = {
  accent: document.getElementById('opt-accent'),
  font: document.getElementById('opt-font'),
  fontSize: document.getElementById('opt-font-size'),
  sidebarW: document.getElementById('opt-sidebar-w'),
  railW: document.getElementById('opt-rail-w'),
  topbarH: document.getElementById('opt-topbar-h'),
  radius: document.getElementById('opt-radius')
};
const vals = {
  fontSize: document.getElementById('val-font-size'),
  sidebarW: document.getElementById('val-sidebar-w'),
  railW: document.getElementById('val-rail-w'),
  topbarH: document.getElementById('val-topbar-h'),
  radius: document.getElementById('val-radius')
};

const sidebarNav = document.getElementById('sidebar-nav');
const SETTINGS_SECTIONS = [
  { id: 'themes', label: 'Themes' },
  { id: 'colors', label: 'Colors' },
  { id: 'typography', label: 'Typography' },
  { id: 'layout', label: 'Layout' }
];
let activeSection = 'themes';

function buildSidebarNav() {
  sidebarNav.replaceChildren();
  SETTINGS_SECTIONS.forEach((section) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'nav-item';
    item.textContent = section.label;
    item.addEventListener('click', () => showSection(section.id));
    sidebarNav.append(item);
  });
}

function showSection(id) {
  activeSection = id;
  settingsView.querySelectorAll('.setting-group').forEach((group) => {
    group.hidden = group.dataset.section !== id;
  });
  sidebarNav.querySelectorAll('.nav-item').forEach((item, index) => {
    item.classList.toggle('active', SETTINGS_SECTIONS[index].id === id);
  });
  settingsView.scrollTop = 0;
}

function buildPresetGrid() {
  presetGrid.replaceChildren();
  for (const [id, preset] of Object.entries(PRESETS)) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'preset';
    button.dataset.preset = id;

    const swatch = document.createElement('div');
    swatch.className = 'preset-swatch';
    ['--bg', '--sidebar', '--tab-active', '--text'].forEach((key) => {
      const span = document.createElement('span');
      span.style.background = preset.colors[key];
      swatch.append(span);
    });

    const name = document.createElement('div');
    name.className = 'preset-name';
    name.textContent = preset.name;

    button.append(swatch, name);
    button.addEventListener('click', () => {
      theme.preset = id;
      applyTheme();
      saveTheme();
      syncControls();
    });
    presetGrid.append(button);
  }
}

function syncControls() {
  presetGrid.querySelectorAll('.preset').forEach((el) => {
    el.classList.toggle('selected', el.dataset.preset === theme.preset);
  });
  controls.accent.value = theme.accent;
  controls.font.value = theme.font;
  controls.fontSize.value = theme.fontSize;
  controls.sidebarW.value = theme.sidebarW;
  controls.railW.value = theme.railW;
  controls.topbarH.value = theme.topbarH;
  controls.radius.value = theme.radius;
  vals.fontSize.textContent = `${theme.fontSize}px`;
  vals.sidebarW.textContent = `${theme.sidebarW}px`;
  vals.railW.textContent = `${theme.railW}px`;
  vals.topbarH.textContent = `${theme.topbarH}px`;
  vals.radius.textContent = `${theme.radius}px`;
}

function bindControl(input, key, isNumber) {
  input.addEventListener('input', () => {
    theme[key] = isNumber ? Number(input.value) : input.value;
    applyTheme();
    saveTheme();
    syncControls();
  });
}

function initSettings() {
  buildPresetGrid();
  buildSidebarNav();
  showSection(activeSection);
  bindControl(controls.accent, 'accent', false);
  bindControl(controls.font, 'font', false);
  bindControl(controls.fontSize, 'fontSize', true);
  bindControl(controls.sidebarW, 'sidebarW', true);
  bindControl(controls.railW, 'railW', true);
  bindControl(controls.topbarH, 'topbarH', true);
  bindControl(controls.radius, 'radius', true);

  document.getElementById('theme-reset').addEventListener('click', () => {
    theme = { ...THEME_DEFAULTS };
    applyTheme();
    saveTheme();
    syncControls();
  });

  syncControls();
}

/* --------------------------------------------------------------- tabs --- */

const savedState = JSON.parse(localStorage.getItem('black-workbench-shell') || '{}');

let tabs = Array.isArray(savedState.tabs) && savedState.tabs.length
  ? savedState.tabs
  : [{ id: 1, name: 'New tab' }];
let active = tabs.some((tab) => tab.id === savedState.active) ? savedState.active : tabs[0].id;
let nextId = Math.max(...tabs.map((tab) => tab.id), 0) + 1;

if (savedState.sidebarClosed) shell.classList.add('sidebar-closed');

function saveState() {
  localStorage.setItem('black-workbench-shell', JSON.stringify({
    tabs,
    active,
    sidebarClosed: shell.classList.contains('sidebar-closed')
  }));
}

function renderStage() {
  const activeTab = tabs.find((tab) => tab.id === active);
  const isSettings = !!(activeTab && activeTab.type === 'settings');
  settingsView.hidden = !isSettings;
  sidebarNav.hidden = !isSettings;
  if (isSettings) showSection(activeSection);
}

function drawTabs() {
  tablist.replaceChildren();

  tabs.forEach((tab) => {
    const button = document.createElement('button');
    button.className = `tab${tab.id === active ? ' active' : ''}`;
    button.type = 'button';
    button.role = 'tab';
    button.title = tab.name;
    button.setAttribute('aria-selected', String(tab.id === active));

    const label = document.createElement('span');
    label.className = 'tab-label';
    label.textContent = tab.name;

    const close = document.createElement('span');
    close.className = 'tab-close';
    close.setAttribute('aria-label', 'Close tab');
    close.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#icon-close"></use></svg>';
    close.addEventListener('click', (event) => {
      event.stopPropagation();
      closeTab(tab.id);
    });

    button.append(label, close);
    button.addEventListener('click', () => {
      active = tab.id;
      drawTabs();
      saveState();
    });

    tablist.append(button);
  });

  renderStage();
}

function addTab() {
  const tab = { id: nextId++, name: 'New tab' };
  tabs.push(tab);
  active = tab.id;
  drawTabs();

  const element = tablist.lastElementChild;
  element?.classList.add('enter');
  element?.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: 'smooth' });
  saveState();
}

function openSettings() {
  let tab = tabs.find((item) => item.type === 'settings');
  const isNew = !tab;
  if (isNew) {
    tab = { id: nextId++, name: 'Settings', type: 'settings' };
    tabs.push(tab);
  }
  active = tab.id;
  drawTabs();

  if (isNew) {
    const element = tablist.lastElementChild;
    element?.classList.add('enter');
    element?.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: 'smooth' });
  }
  saveState();
}

function closeTab(id) {
  const index = tabs.findIndex((tab) => tab.id === id);
  if (index === -1) return;

  const finish = () => {
    const currentIndex = tabs.findIndex((tab) => tab.id === id);
    if (currentIndex === -1) return;

    tabs.splice(currentIndex, 1);

    if (!tabs.length) {
      tabs = [{ id: nextId++, name: 'New tab' }];
    }

    if (active === id) {
      active = tabs[Math.min(currentIndex, tabs.length - 1)].id;
    }

    drawTabs();
    saveState();
  };

  const element = tablist.children[index];
  if (element && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    element.classList.add('leaving');
    element.addEventListener('animationend', finish, { once: true });
  } else {
    finish();
  }
}

function toggleSidebar() {
  const closed = shell.classList.toggle('sidebar-closed');
  sidebarToggle.setAttribute('aria-expanded', String(!closed));
  saveState();
}

sidebarToggle.addEventListener('click', toggleSidebar);
newTabButton.addEventListener('click', addTab);
settingsOpen.addEventListener('click', openSettings);

document.addEventListener('keydown', (event) => {
  const mod = event.metaKey || event.ctrlKey;
  const key = event.key.toLowerCase();

  if (!mod) return;

  if (key === 't') {
    event.preventDefault();
    addTab();
  }

  if (key === 'b') {
    event.preventDefault();
    toggleSidebar();
  }

  if (key === 'w') {
    event.preventDefault();
    closeTab(active);
  }

  if (key === ',') {
    event.preventDefault();
    openSettings();
  }
});

applyTheme();
initSettings();
drawTabs();
