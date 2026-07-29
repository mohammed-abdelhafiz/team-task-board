import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";

import "./index.css";
import { router } from "./routes/router";
import { AppProvider } from "./providers/AppProvider";
import { Toaster } from "@/components/ui/sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProvider>
      <main>
        <Toaster richColors />
        <RouterProvider router={router} />
      </main>
    </AppProvider>
  </StrictMode>,
);
