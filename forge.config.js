const { FusesPlugin } = require("@electron-forge/plugin-fuses");
const { FuseV1Options, FuseVersion } = require("@electron/fuses");

module.exports = {
  plugins: [
    {
      name: "@electron-forge/plugin-webpack",
      config: {
        port: 3002,
        mainConfig: "./src/webpack.main.config.js",
        devContentSecurityPolicy: "connect-src 'self' * 'unsafe-eval'",
        renderer: {
          config: "./src/webpack.renderer.config.js",
          nodeIntegration: false,
          contextIsolation: true,
          entryPoints: [
            {
              name: "render_window",
              html: "./src/index.html",
              js: "./src/renderer/renderer.js",
              preload: {
                js: "./src/preload.js",
              },
            },
          ],
        },
      },
    },
  ],
  packagerConfig: {
    asar: true,
  },
};
