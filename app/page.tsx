// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Note, getNotes } from "@/lib/notes";

// export default function HomePage() {
//   const [notes, setNotes] = useState<Note[]>([]);

//   useEffect(() => {
//     setNotes(getNotes());
//   }, []);

//   const pinned = notes.filter((n) => n.pinned);
//   const lastUpdated = [...notes].sort(
//     (a, b) =>
//       new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
//   )[0];

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-indigo-100 via-white to-purple-100">
//       {/* Decorative Gradient Blobs */}
//       <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
//       <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />

//       {/* Hero Section */}
//       <div className="relative text-center max-w-2xl mb-12 z-10">
//         <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-800 drop-shadow-sm">
//           ✨ Simple Notes
//         </h1>
//         <p className="text-lg sm:text-xl text-gray-600 mt-4 mb-8 leading-relaxed">
//           Capture your thoughts, stay organized, and never lose an idea again.
//         </p>

//         <div className="flex justify-center gap-4">
//           <Link href="/notes">
//             <Button
//               size="lg"
//               className="px-6 py-3 text-lg rounded-2xl shadow-lg transition hover:scale-105 hover:shadow-xl"
//             >
//               🚀 Go to Notes
//             </Button>
//           </Link>
//           <Link href="/notes/new">
//             <Button
//               size="lg"
//               variant="outline"
//               className="px-6 py-3 text-lg rounded-2xl shadow-lg border-gray-300 hover:border-indigo-500 hover:text-indigo-600 transition hover:scale-105"
//             >
//               ➕ New Note
//             </Button>
//           </Link>
//         </div>
//       </div>

//       {/* Quick Stats */}
//       <div className="grid sm:grid-cols-3 gap-6 w-full max-w-4xl mb-12 z-10">
//         <div className="p-6 bg-white/70 backdrop-blur-xl rounded-2xl shadow-md text-center hover:shadow-lg transition">
//           <p className="text-4xl font-bold text-indigo-600">{notes.length}</p>
//           <p className="text-gray-700">Total Notes</p>
//         </div>
//         <div className="p-6 bg-white/70 backdrop-blur-xl rounded-2xl shadow-md text-center hover:shadow-lg transition">
//           <p className="text-4xl font-bold text-yellow-500">{pinned.length}</p>
//           <p className="text-gray-700">Pinned Notes</p>
//         </div>
//         <div className="p-6 bg-white/70 backdrop-blur-xl rounded-2xl shadow-md text-center hover:shadow-lg transition">
//           <p className="text-sm text-gray-500">Last Updated</p>
//           <p className="text-lg font-medium text-gray-800 mt-1">
//             {lastUpdated
//               ? new Date(lastUpdated.updatedAt).toLocaleDateString()
//               : "—"}
//           </p>
//         </div>
//       </div>

//       {/* Pinned Notes Preview */}
//       {pinned.length > 0 && (
//         <div className="w-full max-w-5xl z-10">
//           <h2 className="text-2xl font-semibold mb-6 text-gray-800">
//             📌 Pinned Notes
//           </h2>
//           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {pinned.slice(0, 3).map((note) => (
//               <Link
//                 key={note.id}
//                 href={`/notes/${note.id}`}
//                 className="block p-6 bg-white/80 backdrop-blur-xl rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition"
//               >
//                 <h3 className="font-semibold text-gray-800 mb-2 truncate">
//                   {note.title || "(Untitled)"}
//                 </h3>
//                 <p className="text-sm text-gray-600 line-clamp-3">
//                   {note.content}
//                 </p>
//               </Link>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Footer Call-to-Action */}
// <div className="mt-16 text-center text-gray-600 text-sm z-10">
//   <p>
//     Crafted with passion by{" "}
//     <Link href="https://github.com/TalhaFayyaz1" target="_blank" className="underline">
//     <span className="font-medium bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
//       Talha Fayyaz
//     </span>
//     </Link>
//   </p>
// </div>

//     </div>
//   );
// }



// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HomePage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    // call backend to verify token and get user
    (async () => {
      try {
        const res = await fetch("/api/notes", { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) {
          localStorage.removeItem("token");
          router.replace("/login");
          return;
        }
        const data = await res.json();
        setUserEmail(data.user?.email || null);
      } catch {
        localStorage.removeItem("token");
        router.replace("/login");
      } finally {
        setChecking(false);
      }
    })();
  }, [router]);

  if (checking) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto p-12 text-center">
        <h1 className="text-5xl font-extrabold">✨ Simple Notes</h1>
        <p className="mt-3 text-gray-600">Capture your thoughts — you&apos;re signed in as <strong>{userEmail}</strong></p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/notes">
            <button className="px-6 py-3 rounded-lg bg-black text-white">🚀 Go to Notes</button>
          </Link>
          <Link href="/notes/new">
            <button className="px-6 py-3 rounded-lg border">+ New Note</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
