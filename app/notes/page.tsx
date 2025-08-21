"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Note {
  id: string;
  title: string;
  content: string;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
    setNotes(savedNotes);
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Notes</h1>
        <div className="flex gap-2">
          <Link href="/">
            <Button variant="outline">Home</Button>
          </Link>
          <Link href="/notes/new">
            <Button>New Note</Button>
          </Link>
        </div>
      </div>

      {notes.length === 0 ? (
        <p className="text-gray-600">No notes yet. Create one!</p>
      ) : (
        <ul className="space-y-4">
          {notes.map((note) => (
            <li
              key={note.id}
              className="p-4 bg-white shadow rounded flex justify-between items-center"
            >
              <div>
                <h2 className="text-lg font-semibold">{note.title}</h2>
                <p className="text-gray-600 text-sm truncate">{note.content}</p>
              </div>
              <Link href={`/notes/${note.id}`}>
                <Button variant="secondary">Edit</Button>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
