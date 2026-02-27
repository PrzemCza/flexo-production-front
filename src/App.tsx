import { AppRouter } from "./router/AppRouter";
import { ToastProvider } from "./shared/providers/ToastProvider";
import "./App.css";

function App() {
  return (
    <ToastProvider>
      <AppRouter />
    </ToastProvider>
  );
}

export default App;