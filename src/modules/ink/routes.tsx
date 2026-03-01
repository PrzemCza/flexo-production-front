import { RouteObject } from "react-router-dom";
import InkList from "./pages/InkList";
import InkCreate from "./pages/InkCreate";
import InkDetails from "./pages/InkDetails";
import InkEdit from "./pages/InkEdit";


export const inkRoutes: RouteObject[] = [
  {
    path: "inks",
    children: [
      { index: true, element: <InkList /> },
      { path: "create", element: <InkCreate /> },
      { path: ":id", element: <InkDetails /> },
      { path: ":id/edit", element: <InkEdit /> },
    ],
  },
];