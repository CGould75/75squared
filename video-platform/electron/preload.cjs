const { contextBridge, ipcRenderer } = require('electron');

// Expose safe IPC communication pipeline to the React frontend
contextBridge.exposeInMainWorld('electronAPI', {
  performAction: (action) => ipcRenderer.send('remote-action', action)
});
