import { fileURLToPath } from "url";
import { BrowserWindow } from "electron";
import path from "node:path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function windowLoader() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  mainWindow.removeMenu();
  const windowManager = {
    mainWindow,
    show: async function (url) {
      if (url) {
        await this.mainWindow.loadURL(url);
        this.mainWindow.show();
      }
    },
    close: function () {
      this.mainWindow.close();
    },
    sendMessageToRenderer: function (payload) {
      this.mainWindow.webContents.send("message-from-main", payload);
    },
  };
  return windowManager;
}
