import { RouteObject } from "react-router-dom";
import RawMaterialList from "./pages/RawMaterialList";
import RawMaterialCreate from "./pages/RawMaterialCreate";
import RawMaterialDetails from "./pages/RawMaterialDetails";
import RawMaterialEdit from "./pages/RawMaterialEdit";

export const rawMaterialRoutes: RouteObject[] = [
  {
    path: "raw-materials",
    children: [
      { index: true, element: <RawMaterialList /> },
      { path: "create", element: <RawMaterialCreate /> },
      { path: ":id", element: <RawMaterialDetails /> },
      { path: ":id/edit", element: <RawMaterialEdit /> },
    ],
  },
];