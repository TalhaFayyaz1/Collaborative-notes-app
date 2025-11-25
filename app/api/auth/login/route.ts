// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { email, password } = body;

//     if (!email || !password) {
//       return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
//     }

//     const user = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (!user) {
//       return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
//     }

//     const isValidPassword = await bcrypt.compare(password, user.password);
//     if (!isValidPassword) {
//       return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
//     }

//     // Generate JWT token
//     const token = jwt.sign(
//       { id: user.id, email: user.email },
//       process.env.JWT_SECRET!,
//       { expiresIn: "1h" }
//     );

//     return NextResponse.json({
//       message: "Login successful",
//       token,
//       user: { id: user.id, email: user.email },
//     });
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }


import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    return NextResponse.json({
      message: "Login successful",
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
