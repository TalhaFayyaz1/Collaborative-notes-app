"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Note, getNoteById, updateNote, deleteNote, togglePin } from "@/lib/notes";

export default function EditNotePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [note, setNote] = useState<Note | null>(null);
  const [tagsText, setTagsText] = useState("");

  useEffect(() => {
    const n = getNoteById(id);
    if (n) {
      setNote(n);
      setTagsText(n.tags.join(", "));
    }
  }, [id]);

  if (!note) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-gray-600">Note not found.</p>
        <div className="mt-4 flex gap-2">
          <Link href="/notes"><Button variant="outline">Back to Notes</Button></Link>
          <Link href="/"><Button variant="outline">Home</Button></Link>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    const tags = tagsText.split(",").map(t => t.trim()).filter(Boolean);
    updateNote(note.id, {
      title: note.title.trim(),
      content: note.content.trim(),
      tags
    });
    router.push("/notes");
  };

  const handleDelete = () => {
    if (window.confirm("Delete this note? This cannot be undone.")) {
      deleteNote(note.id);
      router.push("/notes");
    }
  };

  const handleTogglePin = () => {
    togglePin(note.id);
    // Refresh local state
    const updated = getNoteById(note.id);
    if (updated) setNote(updated);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Edit Note</h1>
        <div className="flex gap-2">
          <Link href="/notes"><Button variant="outline">Back to Notes</Button></Link>
          <Link href="/"><Button variant="outline">Home</Button></Link>
        </div>
      </div>

      <div className="mb-1 flex items-center gap-2">
        {note.pinned && <span className="text-xs px-2 py-0.5 rounded bg-yellow-100 text-yellow-800">Pinned</span>}
        <Button variant="outline" onClick={handleTogglePin}>
          {note.pinned ? "Unpin" : "Pin"}
        </Button>
      </div>

      <Input
        placeholder="Title"
        value={note.title}
        onChange={(e) => setNote({ ...note, title: e.target.value })}
        className="mb-4"
      />

      <Textarea
        placeholder="Content"
        value={note.content}
        onChange={(e) => setNote({ ...note, content: e.target.value })}
        className="mb-4"
        rows={10}
      />

      <Input
        placeholder="Tags (comma separated)"
        value={tagsText}
        onChange={(e) => setTagsText(e.target.value)}
        className="mb-6"
      />

      <p className="text-xs text-gray-500 mb-4">
        Created: {new Date(note.createdAt).toLocaleString()} • Last updated: {new Date(note.updatedAt).toLocaleString()}
      </p>

      <div className="flex gap-2">
        <Button onClick={handleSave}>Save</Button>
        <Button variant="destructive" onClick={handleDelete}>Delete</Button>
        <Link href="/notes"><Button variant="secondary">Cancel</Button></Link>
      </div>
    </div>
  );
}
