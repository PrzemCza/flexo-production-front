import { RouteObject } from "react-router-dom";
import PolymerList from "./pages/PolymerList";
import PolymerForm from "./pages/PolymerForm";


export const polymerRoutes: RouteObject[] = [
    {
        path: "polymers",
        children: [
          { index: true, element: <PolymerList /> },
          { path: "create", element: <PolymerForm /> },
        ],
      },
    ];