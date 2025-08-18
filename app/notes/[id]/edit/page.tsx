"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function EditNotePage() {
  const { id } = useParams(); // get note id from URL
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Load note data on mount
  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
    const note = storedNotes.find((n: any) => n.id === id);

    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [id]);

  // Save edited note
  const handleSave = () => {
    const storedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
    const updatedNotes = storedNotes.map((n: any) =>
      n.id === id ? { ...n, title, content } : n
    );

    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    router.push("/notes"); // go back to notes list
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Note</h1>

      <div className="space-y-4">
        <div>
          <Input
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <Textarea
            placeholder="Write your note here..."
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <Button onClick={handleSave} className="w-full">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
