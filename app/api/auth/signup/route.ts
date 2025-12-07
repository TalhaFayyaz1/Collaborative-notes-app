
// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { email, password } = body;

//     if (!email || !password) {
//       return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
//     }

//     const existing = await prisma.user.findUnique({ where: { email } });

//     if (existing) {
//       return NextResponse.json({ error: "User already exists" }, { status: 400 });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = await prisma.user.create({
//       data: { email, password: hashedPassword },
//     });

//     return NextResponse.json(
//       {
//         message: "User created successfully",
//         user: { id: user.id, email: user.email },
//       },
//       { status: 201 }
//     );
//   } catch (err: any) {
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }





import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

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
