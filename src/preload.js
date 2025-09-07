const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("MessageHandler", {
  listenForMessage: (callback) => {
    ipcRenderer.on("message-from-main", (_, payload) => {
      callback(payload);
    });
  },
  sendMessageToMain: (payload) => {
    ipcRenderer.send("message-from-render", payload);
  },
});
