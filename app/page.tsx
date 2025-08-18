// app/page.tsx
import AppLayout from "@/components/ui/layout/AppLayout";

export default function HomePage() {
  return (
    <AppLayout>
      <section className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Welcome to NotesApp</h1>
        <p className="text-gray-600">
          A collaborative notes platform where you can create, edit, and share
          notes in real-time with your team.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <div className="p-6 rounded-xl border bg-white shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Quick Actions</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Create a new note</li>
              <li>View shared notes</li>
              <li>Organize notes by tags</li>
            </ul>
          </div>

          {/* Recent Notes Placeholder */}
          <div className="p-6 rounded-xl border bg-white shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Recent Notes</h2>
            <p className="text-gray-500">No recent notes yet. Start by creating one!</p>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
