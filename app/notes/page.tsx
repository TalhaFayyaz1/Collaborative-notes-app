"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Note = {
  id: number;
  title: string;
  content: string;
};

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const router = useRouter();

  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
    setNotes(storedNotes);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Notes</h1>
        <div className="space-x-2">
          <Button variant="secondary" onClick={() => router.push("/")}>
            Back to Home
          </Button>
          <Button onClick={() => router.push("/notes/new")}>+ New Note</Button>
        </div>
      </div>

      {notes.length === 0 ? (
        <p className="text-gray-500">No notes yet. Create one!</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {notes.map((note) => (
            <Card
              key={note.id}
              className="cursor-pointer hover:shadow-md transition"
              onClick={() => router.push(`/notes/${note.id}`)}
            >
              <CardContent className="p-4">
                <h2 className="font-semibold">{note.title}</h2>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {note.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
