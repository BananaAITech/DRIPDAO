import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/App.tsx";
import "./styles/fonts.css";
import "./styles/index.css";
import WalletProvider from "./contexts/WalletProvider.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WalletProvider>
      <App />
      <ToastContainer />;
    </WalletProvider>
  </React.StrictMode>
);
