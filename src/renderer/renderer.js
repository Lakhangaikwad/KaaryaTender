import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { PrimeReactProvider } from "primereact/api";
import "bootstrap/dist/css/bootstrap.min.css";
const rootDom = ReactDOM.createRoot(document.getElementById("root"));
const primeReactConfig = {
  hideOverlaysOnDocumentScrolling: true, // or false, depending on your preference
  // other PrimeReact configurations
};
rootDom.render(
  <PrimeReactProvider value={primeReactConfig}>
    <App />
  </PrimeReactProvider>
);
