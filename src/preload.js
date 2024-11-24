// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  sendNavigate: (route) => ipcRenderer.send('navigate', route),
});