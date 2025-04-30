const { app, BrowserWindow, shell, ipcMain, Notification } = require('electron');
const path = require('path');
const { join } = path;

// Handle creating/removing shortcuts on Windows when installing/uninstalling
if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow = null;

const createWindow = async () => {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false, // Remove default window frame
    webPreferences: {
      preload: join(__dirname, '../preload/index.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // In production, use the built files
  if (app.isPackaged) {
    mainWindow.loadFile(join(__dirname, '../../index.html'));
  } else {
    // In development, use the dev server
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  }

  // Open external links in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
};

// Set up IPC handlers for main process
function setupIpcHandlers() {
  // Notification handler
  ipcMain.on('send-notification', (_, message) => {
    new Notification({
      title: 'Notification',
      body: message
    }).show();
  });
  
  // Window control handler
  ipcMain.on('window-control', (_, command) => {
    if (!mainWindow) return;
    
    switch (command) {
      case 'minimize':
        mainWindow.minimize();
        break;
      case 'maximize':
        if (mainWindow.isMaximized()) {
          mainWindow.unmaximize();
        } else {
          mainWindow.maximize();
        }
        break;
      case 'close':
        mainWindow.close();
        break;
    }
  });
}

// Create window when Electron is ready
app.whenReady().then(() => {
  createWindow();
  setupIpcHandlers();

  // On macOS it's common to re-create a window when the dock icon is clicked
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
}); 