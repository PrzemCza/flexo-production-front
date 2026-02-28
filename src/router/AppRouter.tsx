import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import MainLayout from "@/layout/MainLayout";
import { diecutRoutes } from "@/modules/diecut/routes";
import { rawMaterialRoutes } from "@/modules/rawmaterial/routes";
import { inkRoutes } from "@/modules/ink/routes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="/die-cuts" replace /> },
      ...diecutRoutes,
      ...rawMaterialRoutes,
      ...inkRoutes,
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;