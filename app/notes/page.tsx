"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Note, getNotes, saveNotes, togglePin, deleteNote } from "@/lib/notes";

type SortKey = "updatedAt" | "createdAt" | "title";
type SortDir = "desc" | "asc";

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("updatedAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [view, setView] = useState<"list" | "grid">("list");

  // Load notes on mount
  useEffect(() => {
    setNotes(getNotes());
  }, []);

  // Helpers to persist local changes
  const refreshFromStorage = () => setNotes(getNotes());

  const handleTogglePin = (id: string) => {
    togglePin(id);
    refreshFromStorage();
  };

  const { toast } = useToast();


  const handleDelete = (id: string) => {
    deleteNote(id);
    refreshFromStorage();
    toast({
  title: "Note deleted",
  description: "Your note has been permanently removed.",
  variant: "destructive",
});

  };

  const handleClearAll = () => {
    saveNotes([]);
    setNotes([]);
    toast({
  title: "All notes cleared",
  description: "Every note has been deleted.",
  variant: "destructive",
});

  };

  const filteredAndSorted = useMemo(() => {
    const q = search.toLowerCase().trim();

    const matches = notes.filter((n) => {
      const inTitle = n.title.toLowerCase().includes(q);
      const inContent = n.content.toLowerCase().includes(q);
      const inTags = ((n.tags?.join(" "))?.toLowerCase() || "").includes(q);
      return q ? inTitle || inContent || inTags : true;
    });

    const dirMul = sortDir === "asc" ? 1 : -1;

    const sortFn = (a: Note, b: Note) => {
      if (sortKey === "title") {
        return a.title.localeCompare(b.title) * dirMul;
      }
      const va = new Date(a[sortKey]).getTime();
      const vb = new Date(b[sortKey]).getTime();
      return (va - vb) * dirMul;
    };

    const pinned = matches.filter((n) => n.pinned).sort(sortFn);
    const others = matches.filter((n) => !n.pinned).sort(sortFn);

    return [...pinned, ...others];
  }, [notes, search, sortKey, sortDir]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-10">
          <h1 className="text-3xl font-extrabold text-gray-800">My Notes</h1>
          <div className="flex gap-3">
            <Link href="/">
              <Button variant="outline">🏠 Home</Button>
            </Link>
            <Link href="/notes/new">
              <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                + New Note
              </Button>
            </Link>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-8 bg-white/70 backdrop-blur rounded-xl p-4 shadow-md">
          <Input
            placeholder="🔍 Search by title, content, or tag…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sm:max-w-sm"
          />

          <div className="flex flex-wrap gap-2 items-center">
            <select
              className="border rounded px-2 py-2 text-sm"
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              aria-label="Sort key"
            >
              <option value="updatedAt">Sort: Last Updated</option>
              <option value="createdAt">Sort: Created</option>
              <option value="title">Sort: Title</option>
            </select>

            <select
              className="border rounded px-2 py-2 text-sm"
              value={sortDir}
              onChange={(e) => setSortDir(e.target.value as SortDir)}
              aria-label="Sort direction"
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>

            <Button
              variant="outline"
              onClick={() => setView((v) => (v === "list" ? "grid" : "list"))}
            >
              View: {view === "list" ? "📋 List" : "🔲 Grid"}
            </Button>

            {/* Clear All with Modal */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">🗑️ Clear All</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear all notes?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all notes. This action cannot
                    be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearAll}>
                    Yes, Clear All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Empty state */}
        {filteredAndSorted.length === 0 ? (
          <div className="text-center text-gray-600 py-16 border rounded-xl bg-white/60 backdrop-blur shadow-md">
            <p className="mb-4">No notes found.</p>
            <Link href="/notes/new">
              <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                Create your first note
              </Button>
            </Link>
          </div>
        ) : view === "list" ? (
          // List view
          <ul className="space-y-4">
            {filteredAndSorted.map((note) => (
              <li
                key={note.id}
                className="p-5 bg-white/70 backdrop-blur rounded-xl shadow hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {note.pinned && (
                        <span className="text-xs px-2 py-0.5 rounded bg-yellow-200 text-yellow-800 font-medium">
                          📌 Pinned
                        </span>
                      )}
                      <h2 className="text-lg font-semibold truncate text-gray-800">
                        {note.title || "(Untitled)"}
                      </h2>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                      {note.content}
                    </p>

                    {/* Tags */}
                    {note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {note.tags.map((t, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="text-xs text-gray-400 mt-2">
                      Created: {new Date(note.createdAt).toLocaleString()} •
                      Updated: {new Date(note.updatedAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    <Link href={`/notes/${note.id}`}>
                      <Button variant="secondary">✏️ Edit</Button>
                    </Link>
                    <Button
                      variant="outline"
                      onClick={() => handleTogglePin(note.id)}
                    >
                      {note.pinned ? "Unpin" : "Pin"}
                    </Button>

                    {/* Delete Single Note with Modal */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">Delete</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete note?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete{" "}
                            <strong>{note.title || "Untitled"}</strong>. This
                            action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(note.id)}
                          >
                            Yes, Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          // Grid view
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAndSorted.map((note) => (
              <div
                key={note.id}
                className="p-5 bg-white/70 backdrop-blur rounded-xl shadow hover:shadow-lg transition flex flex-col"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {note.pinned && (
                        <span className="text-xs px-2 py-0.5 rounded bg-yellow-200 text-yellow-800 font-medium">
                          📌 Pinned
                        </span>
                      )}
                      <h2 className="text-lg font-semibold truncate text-gray-800">
                        {note.title || "(Untitled)"}
                      </h2>
                    </div>
                  </div>
                  <button
                    className="text-xs underline"
                    onClick={() => handleTogglePin(note.id)}
                    title={note.pinned ? "Unpin" : "Pin"}
                  >
                    {note.pinned ? "Unpin" : "Pin"}
                  </button>
                </div>

                <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                  {note.content}
                </p>

                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {note.tags.map((t, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-xs text-gray-400 mt-2">
                  Updated: {new Date(note.updatedAt).toLocaleString()}
                </p>

                <div className="mt-auto pt-3 flex items-center justify-between">
                  <Link href={`/notes/${note.id}`}>
                    <Button size="sm" variant="secondary">
                      ✏️ Edit
                    </Button>
                  </Link>

                  {/* Delete in Grid View with Modal */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive">
                        🗑️ Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete note?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete{" "}
                          <strong>{note.title || "Untitled"}</strong>. This
                          action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(note.id)}
                        >
                          Yes, Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
