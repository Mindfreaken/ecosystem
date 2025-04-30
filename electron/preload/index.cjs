const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Here you can expose functions to interact with the main process
  // Example: sending notifications, handling file operations, etc.
  sendNotification: (message) => {
    ipcRenderer.send('send-notification', message);
  },
  
  // Window control methods
  minimizeWindow: () => {
    ipcRenderer.send('window-control', 'minimize');
  },
  maximizeWindow: () => {
    ipcRenderer.send('window-control', 'maximize');
  },
  closeWindow: () => {
    ipcRenderer.send('window-control', 'close');
  }
});

// Any additional setup for the preload script can go here
console.log('Preload script loaded'); 