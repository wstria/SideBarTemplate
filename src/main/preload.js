const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('workbench', {
  platform: () => ipcRenderer.invoke('app:platform'),
  startResize: () => ipcRenderer.send('window:resize-start'),
  resizeWindow: (edge, dx, dy) => ipcRenderer.send('window:resize', { edge, dx, dy }),
  endResize: () => ipcRenderer.send('window:resize-end')
});
