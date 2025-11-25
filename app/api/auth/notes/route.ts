// import { NextResponse } from "next/server";
// import { verifyToken } from "@/lib/auth";

// export async function GET(req: Request) {
//   try {
//     const decoded = verifyToken(req);

//     return NextResponse.json({
//       message: "Access granted to protected route!",
//       user: decoded,
//     });
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 401 });
//   }
// }



import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/lib/auth";

const prisma = new PrismaClient();

// GET user's notes
export async function GET(req: Request) {
  try {
    const user = verifyToken(req);

    const notes = await prisma.note.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ notes });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}

// POST (create a new note)
export async function POST(req: Request) {
  try {
    const user = verifyToken(req);
    const body = await req.json();
    const { title, content } = body;

    const note = await prisma.note.create({
      data: {
        title,
        content,
        userId: user.id,
      },
    });

    return NextResponse.json({ message: "Note added", note });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}
