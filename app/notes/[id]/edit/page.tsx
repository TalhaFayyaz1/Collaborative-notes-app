"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import {
	AlertDialog,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogCancel,
	AlertDialogAction,
} from "@/components/ui/alert-dialog";

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
		const savedNotes: Note[] = JSON.parse(
			localStorage.getItem("notes") || "[]"
		);
		const currentNote = savedNotes.find((n) => n.id === params?.id);
		if (currentNote) setNote(currentNote);
	}, [params?.id]);

	if (!note) return <p>Loading...</p>;

	const handleSave = () => {
		const savedNotes: Note[] = JSON.parse(
			localStorage.getItem("notes") || "[]"
		);
		const updatedNotes = savedNotes.map((n) =>
			n.id === note.id ? { ...note, updatedAt: new Date().toISOString() } : n
		);
		localStorage.setItem("notes", JSON.stringify(updatedNotes));
		router.push("/notes");
	};

	const handleDelete = () => {
		const savedNotes: Note[] = JSON.parse(
			localStorage.getItem("notes") || "[]"
		);
		const updatedNotes = savedNotes.filter((n) => n.id !== note.id);
		localStorage.setItem("notes", JSON.stringify(updatedNotes));
		router.push("/notes");
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-6">
			<div className="w-full max-w-3xl p-6 rounded-2xl shadow-xl bg-white/70 dark:bg-gray-900/70 backdrop-blur">
				<h1 className="text-3xl font-bold mb-6 text-indigo-700 dark:text-indigo-300">
					Edit Note
				</h1>

				<Input
					value={note.title}
					onChange={(e) => setNote({ ...note, title: e.target.value })}
					className="mb-4"
					placeholder="Note title..."
				/>
				<Textarea
					value={note.content}
					onChange={(e) => setNote({ ...note, content: e.target.value })}
					className="mb-4 min-h-[200px]"
					placeholder="Write your note..."
				/>

				<p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
					Created: {new Date(note.createdAt).toLocaleString()} <br />
					Last updated: {new Date(note.updatedAt).toLocaleString()}
				</p>

				<div className="flex gap-3">
					<Button
						onClick={handleSave}
						className="bg-indigo-600 text-white hover:bg-indigo-700">
						Save
					</Button>

					{/* Custom-styled confirmation modal for delete */}
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button variant="destructive">Delete</Button>
						</AlertDialogTrigger>
						<AlertDialogContent className="rounded-2xl shadow-2xl p-6 border-0 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 text-white">
							<AlertDialogHeader>
								<AlertDialogTitle className="text-xl font-bold">
									Delete this note?
								</AlertDialogTitle>
								<AlertDialogDescription className="text-gray-200">
									This action cannot be undone. Your note will be permanently
									removed.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter className="flex justify-end gap-3 mt-6">
								<AlertDialogCancel className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 transition text-white">
									Cancel
								</AlertDialogCancel>
								<AlertDialogAction
									onClick={handleDelete}
									className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 transition text-white">
									Delete
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>

					<Link href="/notes">
						<Button variant="secondary">Back</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}
