import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import { diecutRoutes } from "../modules/diecut/routes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="/die-cuts" replace /> },
      ...diecutRoutes,
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;