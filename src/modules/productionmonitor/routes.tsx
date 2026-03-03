import { RouteObject } from "react-router-dom";
import ProductionDashboard from "./pages/ProductionDashboard";

export const productionMonitorRoutes: RouteObject[] = [
  {
    path: "production-monitor",
    element: <ProductionDashboard />,
  }
];