// components/ui/layout/Sidebar.tsx
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-6">Menu</h2>
      <nav className="flex flex-col space-y-4">
        <Link href="/notes" className="hover:text-gray-300">
          📝 My Notes
        </Link>
        <Link href="/shared" className="hover:text-gray-300">
          🤝 Shared Notes
        </Link>
        <Link href="/settings" className="hover:text-gray-300">
          ⚙️ Settings
        </Link>
      </nav>
    </aside>
  );
}
