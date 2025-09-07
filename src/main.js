import { app, BrowserWindow, ipcMain, Notification } from "electron";
import started from "electron-squirrel-startup";
import windowLoader from "./mainWindowHandler";

if (started) {
  app.quit();
}

app.on("ready", () => {
  // Once main process ready then show the window
  const windowInstance = windowLoader();
  windowInstance.show(RENDER_WINDOW_WEBPACK_ENTRY);
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      windowLoader.show(RENDER_WINDOW_WEBPACK_ENTRY);
    }
  });

  ipcMain.on("message-from-render", (_, payload) => {
    const notification = new Notification({
      title: "Message from render",
      body: `${payload?.message}`,
      hasReply: true,
    });
    notification.show();
    notification.on("click", () => {
      windowInstance.sendMessageToRenderer({
        ack: true,
      });
    });
  });
});

app.on("browser-window-created", (_, window) => {
  // window.webContents.openDevTools({
  //   mode: "detach",
  // });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
