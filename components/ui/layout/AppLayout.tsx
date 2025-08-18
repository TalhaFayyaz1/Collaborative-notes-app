// components/ui/layout/AppLayout.tsx
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navbar */}
      <Navbar />

      {/* Sidebar + Page Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 text-white p-4">
          <Sidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
}
