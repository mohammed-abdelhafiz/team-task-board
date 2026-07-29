import { useEffect, type ReactNode } from "react";
import QueryProvider from "./QueryProvider";
import { useThemeStore } from "@/store/theme.store";
import type { Theme } from "@/store/theme.store";
import { AuthProvider } from "./AuthProvider";

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const setTheme = useThemeStore((state) => state.setTheme);
  useEffect(() => {
    const theme = (localStorage.getItem("theme") as Theme) || "system";
    setTheme(theme);
  }, [setTheme]);
  return (
    <QueryProvider>
      <AuthProvider>{children}</AuthProvider>
    </QueryProvider>
  );
};
