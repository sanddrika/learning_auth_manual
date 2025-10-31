import { NextResponse } from "next/server";
import { verifyToken } from "@/src/lib/jwt";

export async function GET(request: Request) {
  const cookie = (request as any).cookies?.get?.("token")?.value;
  const token = cookie || require("next/headers").cookies().get("token")?.value;
  const payload = token ? verifyToken(token) : null;

  if (!payload)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({
    id: payload.sub,
    name: payload.name,
    email: payload.email,
  });
}
