import { createBrowserRouter, Navigate } from "react-router";

import GuestRoutes from "@/routes/GuestRoutes";
import ProtectedRoutes from "@/routes/ProtectedRoutes";

import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Dashboard from "@/pages/dashboard/Dashboard";
import ProjectDetails from "@/pages/project/ProjectDetails";

export const router = createBrowserRouter([
  {
    element: <GuestRoutes />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
  {
    element: <ProtectedRoutes />,
    children: [
      {
        path: "",
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "projects/:id",
        element: <ProjectDetails />,
      },
    ],
  },
]);
