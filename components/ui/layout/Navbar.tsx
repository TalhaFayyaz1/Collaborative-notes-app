"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full h-14 bg-gray-900 text-white flex items-center px-6">
      <div className="flex gap-6">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <Link href="/notes" className="hover:underline">
          My Notes
        </Link>
        <Link href="/notes/new" className="hover:underline">
          New Note
        </Link>
      </div>
    </nav>
  );
}
