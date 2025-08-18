"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type Note = {
  id: number;
  title: string;
  content: string;
};

export default function NoteDetailPage() {
  const router = useRouter();
  const params = useParams();
  const noteId = Number(params?.id);

  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // ✅ Load note by ID
  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
    const foundNote = storedNotes.find((n: Note) => n.id === noteId);
    if (foundNote) {
      setNote(foundNote);
      setTitle(foundNote.title);
      setContent(foundNote.content);
    }
  }, [noteId]);

  // ✅ Save changes
  const handleSave = () => {
    if (!note) return;

    const storedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
    const updatedNotes = storedNotes.map((n: Note) =>
      n.id === noteId ? { ...n, title, content } : n
    );

    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    router.push("/notes");
  };

  // ✅ Delete note
  const handleDelete = () => {
    const storedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
    const filteredNotes = storedNotes.filter((n: Note) => n.id !== noteId);

    localStorage.setItem("notes", JSON.stringify(filteredNotes));
    router.push("/notes");
  };

  // ✅ Cancel (discard edits and go back)
  const handleCancel = () => {
    router.push("/notes");
  };

  if (!note) {
    return <p className="text-center mt-10">Note not found.</p>;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-[450px] p-6">
        <CardContent className="space-y-4">
          <h1 className="text-xl font-bold">Edit Note</h1>

          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
            />
          </div>

          {/* ✅ Buttons row */}
          <div className="flex justify-between mt-4">
            <Button onClick={handleSave}>Save Changes</Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
