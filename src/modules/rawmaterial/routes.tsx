import { RouteObject } from "react-router-dom";
import RawMaterialList from "./pages/RawMaterialList";
import RawMaterialCreate from "./pages/RawMaterialCreate";

export const rawMaterialRoutes: RouteObject[] = [
  {
    path: "raw-materials",
    children: [
      { index: true, element: <RawMaterialList /> },
      { path: "create", element: <RawMaterialCreate /> },
    ],
  },
];