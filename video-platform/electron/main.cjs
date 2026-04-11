const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const { mouse, Point } = require('@nut-tree/nut.js');

// Configure nut-js speed for immediate execution without ramping
mouse.config.mouseSpeed = 2000;

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Target the active Vite Dev Server (defaults to 5173, but we can pass 8080 if needed)
  const url = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';
  mainWindow.loadURL(url);
}

app.whenReady().then(() => {
  createWindow();

  // IPC channel listening for Remote Control parameters from React
  ipcMain.on('remote-action', async (event, action) => {
    try {
      if (action.type === 'click' || action.type === 'move') {
        const { width, height } = screen.getPrimaryDisplay().size;
        
        // Incoming coordinates are normalized percentages (0->1) across the viewport.
        // We map them absolutely to OS-level pixels based on screen resolution.
        const targetX = Math.round(action.x * width);
        const targetY = Math.round(action.y * height);
        
        await mouse.setPosition(new Point(targetX, targetY));
        
        if (action.type === 'click') {
          await mouse.leftClick();
        }
      }
    } catch (err) {
      console.error('Failed to execute OS-level remote action:', err);
    }
  });

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
