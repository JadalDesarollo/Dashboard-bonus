import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

import App from "./App";
import { TransactionProvider } from "context/TransactionContext";
import { AuthProvider } from "auth/context/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <AuthProvider>
    <TransactionProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </TransactionProvider>
  </AuthProvider>
);
