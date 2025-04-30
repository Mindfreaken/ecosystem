const { contextBridge, ipcRenderer } = require('electron')

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Here you can expose functions to interact with the main process
  // Example: sending notifications, handling file operations, etc.
  sendNotification: (message) => {
    ipcRenderer.send('send-notification', message)
  },
  // You can add more API methods as needed for your application
})

// Any additional setup for the preload script can go here
console.log('Preload script loaded') 