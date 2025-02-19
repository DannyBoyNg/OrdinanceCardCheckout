// preload.js
const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('sqliteAPI', {
  invoke: (channel, data) => ipcRenderer.invoke(channel, data)
});