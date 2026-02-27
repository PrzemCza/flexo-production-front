import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import DieCutsList from "./pages/DieCutsList";
import DieCutDetails from "./pages/DieCutDetails";
import DieCutCreate from "./pages/DieCutCreate";
import DieCutEdit from "./pages/DieCutEdit";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<DieCutsList />} />
          <Route path="/die-cuts/new" element={<DieCutCreate />} />
          <Route path="/die-cuts/:id" element={<DieCutDetails />} />
          <Route path="/die-cuts/:id/edit" element={<DieCutEdit />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
