import type { Metadata } from "next";
import "./globals.css";
import { DashboardProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "Lab11 Dashboard",
  description: "Dashboard de Proyectos con shadcn/ui",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <DashboardProvider>{children}</DashboardProvider>
      </body>
    </html>
  );
}
