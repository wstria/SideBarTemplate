const { app, BrowserWindow, ipcMain, nativeTheme } = require('electron');
const path = require('node:path');

const isMac = process.platform === 'darwin';

function createWindow() {
  nativeTheme.themeSource = 'dark';

  const window = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 880,
    minHeight: 560,
    backgroundColor: '#000000',
    movable: true,
    resizable: true,
    show: false,
    title: 'SideBarTemplate',
    titleBarStyle: isMac ? 'hiddenInset' : 'hidden',
    trafficLightPosition: { x: 18, y: 18 },
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  window.once('ready-to-show', () => window.show());
  window.loadFile(path.join(__dirname, '../renderer/index.html'));

  // Let the UI know when the window is fullscreen: macOS hides the traffic
  // lights there, so the toolbar can drop its left gutter.
  const syncFullscreen = () => {
    window.webContents
      .executeJavaScript(
        `document.documentElement.classList.toggle('is-fullscreen', ${window.isFullScreen()})`
      )
      .catch(() => {});
  };
  window.on('enter-full-screen', syncFullscreen);
  window.on('leave-full-screen', syncFullscreen);
  window.webContents.on('did-finish-load', syncFullscreen);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (!isMac) app.quit();
});

ipcMain.handle('app:platform', () => process.platform);

ipcMain.on('window:resize-start', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (window) window.__resizeStartBounds = window.getBounds();
});

ipcMain.on('window:resize', (event, payload) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (!window || !payload?.edge || !window.__resizeStartBounds) return;

  const { edge, dx = 0, dy = 0 } = payload;
  const bounds = window.__resizeStartBounds;
  const [minWidth, minHeight] = window.getMinimumSize();
  const next = { ...bounds };

  if (edge.includes('e')) next.width = Math.max(minWidth, bounds.width + dx);
  if (edge.includes('s')) next.height = Math.max(minHeight, bounds.height + dy);

  if (edge.includes('w')) {
    const width = Math.max(minWidth, bounds.width - dx);
    next.x = bounds.x + bounds.width - width;
    next.width = width;
  }

  if (edge.includes('n')) {
    const height = Math.max(minHeight, bounds.height - dy);
    next.y = bounds.y + bounds.height - height;
    next.height = height;
  }

  window.setBounds(next);
});

ipcMain.on('window:resize-end', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (window) delete window.__resizeStartBounds;
});
