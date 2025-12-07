

// import { NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";
// import { verifyToken } from "@/lib/auth";

// const prisma = new PrismaClient();

// // GET user's notes
// export async function GET(req: Request) {
//   try {
//     const user = verifyToken(req);

//     const notes = await prisma.note.findMany({
//       where: { userId: user.id },
//       orderBy: { createdAt: "desc" },
//     });

//     return NextResponse.json({ notes });
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 401 });
//   }
// }

// // POST (create a new note)
// export async function POST(req: Request) {
//   try {
//     const user = verifyToken(req);
//     const body = await req.json();
//     const { title, content } = body;

//     const note = await prisma.note.create({
//       data: {
//         title,
//         content,
//         userId: user.id,
//       },
//     });

//     return NextResponse.json({ message: "Note added", note });
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 401 });
//   }
// }





import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET(req: Request) {
  try {
    const res = await fetch(`${BACKEND_URL}/notes`, {
      method: "GET",
      headers: req.headers, // forward authorization headers if any
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Backend connection failed" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch(`${BACKEND_URL}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...req.headers, // forward authorization headers if needed
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Backend connection failed" },
      { status: 500 }
    );
  }
}
