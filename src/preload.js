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
  getVillagesByTakula: (payload) => {
    return ipcRenderer.invoke("get-villages-by-takula", payload);
  },
  addContractor: (payload) => {
    return ipcRenderer.invoke("add-contractor", payload);
  },
  updateContractor: (payload) => {
    return ipcRenderer.invoke("update-contractor", payload);
  },
  removeContractor: (payload) => {
    return ipcRenderer.invoke("remove-contractor", payload);
  },
  getAllContractors: () => {
    return ipcRenderer.invoke("get-all-contractors");
  },
});
