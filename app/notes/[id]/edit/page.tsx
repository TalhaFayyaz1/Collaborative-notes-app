"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function EditNotePage() {
  const [note, setNote] = useState<Note | null>(null);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const savedNotes: Note[] = JSON.parse(localStorage.getItem("notes") || "[]");
    const currentNote = savedNotes.find((n) => n.id === params?.id);
    if (currentNote) setNote(currentNote);
  }, [params?.id]);

  if (!note) return <p>Loading...</p>;

  const handleSave = () => {
    const savedNotes: Note[] = JSON.parse(localStorage.getItem("notes") || "[]");
    const updatedNotes = savedNotes.map((n) =>
      n.id === note.id ? { ...note, updatedAt: new Date().toISOString() } : n
    );
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    router.push("/notes");
  };

  const handleDelete = () => {
    const savedNotes: Note[] = JSON.parse(localStorage.getItem("notes") || "[]");
    const updatedNotes = savedNotes.filter((n) => n.id !== note.id);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    router.push("/notes");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Note</h1>
      <Input
        value={note.title}
        onChange={(e) => setNote({ ...note, title: e.target.value })}
        className="mb-4"
      />
      <Textarea
        value={note.content}
        onChange={(e) => setNote({ ...note, content: e.target.value })}
        className="mb-4"
      />

      <p className="text-xs text-gray-500 mb-4">
        Created: {new Date(note.createdAt).toLocaleString()} <br />
        Last updated: {new Date(note.updatedAt).toLocaleString()}
      </p>

      <div className="flex gap-2">
        <Button onClick={handleSave}>Save</Button>
        <Button variant="destructive" onClick={handleDelete}>
          Delete
        </Button>
        <Link href="/notes">
          <Button variant="secondary">Back</Button>
        </Link>
      </div>
    </div>
  );
}
