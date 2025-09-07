# Electron Multiple Processes Setup and IPC Communication with Renderer to Main and Vice Versa

I have demonstrated a multi-process setup and inter-process communication (IPC) between the main process and the renderer process in this Electron application. The app allows the user to send a message from the renderer process to the main process, which then displays a native notification. When the notification is clicked, the main process sends an acknowledgment message back to the renderer process. (Technologies used - ElectronJs,NodeJs, ReactJs, Bootstrap)

## How IPC Communication is Implemented

### Renderer to Main

1. The user types a message in the input field and submits the form.
2. A preload script is used for additional security to prevent exposing `ipcRenderer` in the renderer process.
3. Context isolation and node integration are set to false for security.
4. The `sendMessageToMain` function in the preload script is called, which uses `ipcRenderer.send` to send the message to the main process.

### Main Process

1. The main process listens for the `message-from-render` event using `ipcMain.on`.
2. When the event is received, the main process creates a native notification displaying the message.
3. If the notification is clicked, the main process sends an acknowledgment message back to the renderer process using `webContents.send`.

### Main to Renderer

1. The renderer process listens for the `message-from-main` event using `ipcRenderer.on`.
2. When the acknowledgment message is received, `sendMessageToRenderer` is used to send a message to the renderer process that updates the state to display the acknowledgment message in the UI.

## Running the App

1. Install dependencies: `npm install`
2. Start the Electron app: `npm start`

## File Structure

- `src/main.js`: Main process code.
- `src/renderer/App.jsx`: Renderer process code (React.js).
- `src/preload.js`: Preload script to expose IPC methods to the renderer (to reduce security risks).
- `src/mainWindowHandler.js`: Helper to create and manage the main window.
- `src/index.html`: HTML file for the renderer process.
