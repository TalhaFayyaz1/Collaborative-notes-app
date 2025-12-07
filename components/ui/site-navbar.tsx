"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SiteNavbar() {
  return (
    <header className="border-b">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo / Brand */}
        <Link href="/" className="text-xl font-bold">
          NotesApp
        </Link>

        {/* Nav Links */}
        <nav className="flex items-center gap-4">
          <Link href="/notes" className="text-sm font-medium hover:underline">
            Notes
          </Link>
          <Link href="/about" className="text-sm font-medium hover:underline">
            About
          </Link>
          <Button>Login</Button>
        </nav>
      </div>
    </header>
  );
}
