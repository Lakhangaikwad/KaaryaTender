import { app, BrowserWindow, ipcMain, Notification } from "electron";
import started from "electron-squirrel-startup";
import windowLoader from "./mainWindowHandler";
import "./utils/apiHelper";
import dbConnector from "./utils/dbConnector"; // import your dbConnector
import {
  addNewContractor,
  updateContractor,
  removeContractor,
  getAllContractors,
} from "./utils/dbService.js";
import fs from "fs";
import path from "path";
import crypto from "crypto";

if (started) {
  app.quit();
}

app.whenReady().then(async () => {
  try {
    // Initialize DB
    await dbConnector.initDb();
    console.log("Database initialized successfully");
  } catch (err) {
    console.error("Error initializing database", err);
  }

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

  ipcMain.handle("add-contractor", async (event, data) => {
    try {
      const uploadDir = path.join(app.getPath("userData"), "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      let documentPath = null;
      let originalFileName = null;

      if (data.documentBuffer && data.fileName) {
        try {
          // Generate unique filename to prevent conflicts
          const fileExt = path.extname(data.fileName);
          const timestamp = Date.now();
          const randomId = crypto.randomBytes(4).toString('hex');
          const uniqueFileName = `${timestamp}_${randomId}${fileExt}`;
          originalFileName = data.fileName;

          const newPath = path.join(uploadDir, uniqueFileName);

          const buffer = Buffer.from(data.documentBuffer);
          fs.writeFileSync(newPath, buffer);

          documentPath = newPath;
        } catch (fileError) {
          console.error("Error saving file:", fileError);
          throw new Error(`Failed to save document: ${fileError.message}`);
        }
      } else {
        console.log("No document buffer provided");
      }

      const contractorData = {
        name: data.name,
        address: data.address,
        contactNo: data.contactNo,
        document: documentPath,
        originalFileName: originalFileName, // Store original filename for display
      };

      console.log("Final contractor data:", contractorData);
      const result = await addNewContractor(contractorData);
      return result;
    } catch (error) {
      console.error("Error adding contractor:", error);
      throw error;
    }
  });

  ipcMain.handle("update-contractor", async (event, { id, updateData }) => {
    try {
      const result = await updateContractor(id, updateData);
      return result;
    } catch (error) {
      console.error("Error updating contractor:", error);
      throw error;
    }
  });

  ipcMain.handle("remove-contractor", async (event, { id }) => {
    try {
      // First get the contractor to find the associated file
      const contractors = await getAllContractors();
      const contractor = contractors.find(c => c.id === id);

      if (contractor && contractor.document) {
        try {
          // Delete the file from filesystem
          if (fs.existsSync(contractor.document)) {
            fs.unlinkSync(contractor.document);
            console.log("Deleted file:", contractor.document);
          }
        } catch (fileError) {
          console.error("Error deleting file:", fileError);
          // Don't throw error here, continue with database deletion
        }
      }

      const result = await removeContractor(id);
      return result;
    } catch (error) {
      console.error("Error removing contractor:", error);
      throw error;
    }
  });

  ipcMain.handle("get-all-contractors", async () => {
    try {
      const result = await getAllContractors();
      return result;
    } catch (error) {
      console.error("Error getting all contractors:", error);
      throw error;
    }
  });
});

app.on("browser-window-created", (_, window) => {
  window.webContents.openDevTools({
    mode: "detach",
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
