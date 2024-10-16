import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <div className="flex w-full justify-center">
      <img src="img/casa_alta.png" alt="Casa Alta" width={100} />
    </div>
    <App />
  </React.StrictMode>
);
