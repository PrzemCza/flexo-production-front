import { RouteObject } from "react-router-dom";
import ProductionDashboard from "./pages/ProductionDashboard";
import ProductionOrderForm from "./pages/ProductionOrderForm";

export const productionMonitorRoutes: RouteObject[] = [
  {
    path: "production-monitor",
    children: [
      {
        index: true, // To odpowiada za samą ścieżkę /production-monitor
        element: <ProductionDashboard />,
      },
      {
        path: "new", // To odpowiada za /production-monitor/new
        element: <ProductionOrderForm />,
      },
      {
        path: "edit/:id", // To odpowiada za /production-monitor/edit/:id
        element: <ProductionOrderForm />,
      },
    ],
  },
];