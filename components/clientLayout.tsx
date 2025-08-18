// components/clientLayout.tsx
"use client";

import { usePathname } from "next/navigation";
import AppLayout from "@/components/ui/layout/AppLayout"; 

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Routes where navbar is not needed
  const noNavbarRoutes = ["/login", "/register"];

  if (noNavbarRoutes.includes(pathname)) {
    return <>{children}</>; // no navbar
  }

  // Navbar for all other pages
return <AppLayout>{children}</AppLayout>;

}
