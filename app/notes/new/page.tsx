"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Note, saveNotes, getNotes } from "@/lib/notes";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NewNotePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [pinned, setPinned] = useState(false);

  const handleSave = () => {
    if (!title.trim() && !content.trim()) {
      alert("Note cannot be empty!");
      return;
    }

    const newNote: Note = {
      id: uuidv4(),
      title: title.trim() || "(Untitled)",
      content: content.trim(),
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      pinned,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const existing = getNotes();
    saveNotes([newNote, ...existing]);

    router.push("/notes");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-3xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">Create a New Note</h1>
          <Button
            variant="outline"
            onClick={() => router.push("/notes")}
          >
            ← Back
          </Button>
        </div>

        {/* Card */}
        <div className="bg-white/70 backdrop-blur rounded-2xl shadow-lg p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title..."
              className="w-full"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note here..."
              rows={8}
              className="w-full rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags <span className="text-xs text-gray-400">(comma separated)</span>
            </label>
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. work, personal, ideas"
              className="w-full"
            />
          </div>

          {/* Pinned checkbox */}
          <div className="flex items-center gap-2">
            <input
              id="pinned"
              type="checkbox"
              checked={pinned}
              onChange={(e) => setPinned(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="pinned" className="text-sm text-gray-700">
              Pin this note 📌
            </label>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => router.push("/notes")}
            >
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
              onClick={handleSave}
            >
              💾 Save Note
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
