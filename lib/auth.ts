// import jwt from "jsonwebtoken";

// export function verifyToken(req: Request) {
//   const authHeader = req.headers.get("authorization");

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     throw new Error("No token provided");
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET!);
//     return decoded;
//   } catch (err: any) {
//     console.error("JWT verification failed:", err.message);
//     throw new Error("Unauthorized: Invalid token");
//   }
// }




import jwt from "jsonwebtoken";

export function verifyToken(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) throw new Error("Unauthorized: No token provided");

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded as { id: number; email: string };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    throw new Error("Unauthorized: Invalid token");
  }
}
