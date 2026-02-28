import type { RouteObject } from "react-router-dom";
import DieCutsList from "./pages/DieCutsList";
import DieCutDetails from "./pages/DieCutDetails";
import DieCutCreate from "./pages/DieCutCreate";
import DieCutEdit from "./pages/DieCutEdit";

export const diecutRoutes: RouteObject[] = [
  {
    path: "die-cuts",
    children: [
      { index: true, element: <DieCutsList /> },
      { path: "create", element: <DieCutCreate /> }, 
      { path: ":id", element: <DieCutDetails /> },  
      { path: ":id/edit", element: <DieCutEdit /> },
    ],
  },
];