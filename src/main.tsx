import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ConsentProvider } from "./consent/ConsentProvider";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConsentProvider>
      <App />
    </ConsentProvider>
  </React.StrictMode>,
);
