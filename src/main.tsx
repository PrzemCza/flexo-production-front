import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ToastProvider } from "./shared/providers/ToastProvider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ToastProvider>
    <App />
  </ToastProvider>
);