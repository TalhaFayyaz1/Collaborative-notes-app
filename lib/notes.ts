// lib/notes.ts
export type Note = {
  id: string;
  title: string;
  content: string;
  tags: string[];         // simple labels
  pinned: boolean;        // pin to top
  createdAt: string;      // ISO string
  updatedAt: string;      // ISO string
};

const STORAGE_KEY = "notes";

export function getNotes(): Note[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Note[]) : [];
  } catch {
    return [];
  }
}

export function saveNotes(notes: Note[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export function addNote(partial: Pick<Note, "title" | "content" | "tags">): Note {
  const notes = getNotes();
  const now = new Date().toISOString();
  const newNote: Note = {
    id: Date.now().toString(),
    title: partial.title.trim(),
    content: partial.content.trim(),
    tags: partial.tags.map(t => t.trim()).filter(Boolean),
    pinned: false,
    createdAt: now,
    updatedAt: now,
  };
  notes.push(newNote);
  saveNotes(notes);
  return newNote;
}

export function updateNote(id: string, changes: Partial<Omit<Note, "id" | "createdAt">>) {
  const notes = getNotes();
  const updated = notes.map(n =>
    n.id === id ? { ...n, ...changes, updatedAt: new Date().toISOString() } : n
  );
  saveNotes(updated);
}

export function deleteNote(id: string) {
  const notes = getNotes().filter(n => n.id !== id);
  saveNotes(notes);
}

export function togglePin(id: string) {
  const notes = getNotes();
  const updated = notes.map(n => (n.id === id ? { ...n, pinned: !n.pinned, updatedAt: new Date().toISOString() } : n));
  saveNotes(updated);
}

export function getNoteById(id: string): Note | undefined {
  return getNotes().find(n => n.id === id);
}
