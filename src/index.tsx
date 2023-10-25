import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

import App from "./App";
import { TransactionProvider } from "context/TransactionContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <TransactionProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </TransactionProvider>
);
