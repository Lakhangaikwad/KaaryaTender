import { app, BrowserWindow } from "electron";
import started from "electron-squirrel-startup";
import windowLoader from "./windowLoader.js";

// Ensure RENDER_WINDOW_WEBPACK_ENTRY is defined
if (typeof RENDER_WINDOW_WEBPACK_ENTRY === "undefined") {
  throw new Error("RENDER_WINDOW_WEBPACK_ENTRY is not defined");
}

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
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
