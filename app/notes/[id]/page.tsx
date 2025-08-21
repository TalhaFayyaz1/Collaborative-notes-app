"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function EditNotePage() {
  const router = useRouter();
  const params = useParams(); // get note ID from URL
  const noteId = params?.id as string;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
    const note = savedNotes.find((n: any) => n.id === noteId);
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [noteId]);

  const handleSave = () => {
    const savedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
    const updatedNotes = savedNotes.map((n: any) =>
      n.id === noteId ? { ...n, title, content } : n
    );
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    router.push("/notes"); // go back after saving
  };

  const handleCancel = () => {
    router.push("/notes"); // go back without saving
  };

  const handleDelete = () => {
    const savedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
    const updatedNotes = savedNotes.filter((n: any) => n.id !== noteId);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    router.push("/notes"); // go back after deleting
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Note</h1>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border rounded p-2 mb-4"
      />

      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full border rounded p-2 mb-4 h-40"
      />

      <div className="flex gap-4">
        <Button onClick={handleSave}>Save</Button>
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={handleDelete}>
          Delete
        </Button>

        <Link href="/">
  <Button variant="outline">🏠 Home</Button>
</Link>

        
      </div>
    </div>
  );
}
