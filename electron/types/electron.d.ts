/**
 * Type definitions for Electron API
 * This allows TypeScript to understand the structure of the window.electronAPI object
 */

interface ElectronAPI {
  sendNotification: (message: string) => void
  // Add more methods here as they're implemented in the preload script
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

export {} 