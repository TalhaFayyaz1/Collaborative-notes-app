import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const decoded = verifyToken(req);

    return NextResponse.json({
      message: "Access granted to protected route!",
      user: decoded,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
