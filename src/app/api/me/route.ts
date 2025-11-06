import { NextResponse } from "next/server";
import { verifyToken } from "@/src/lib/jwt";
import { prisma } from "@/src/lib/prisma";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const tokenPair = cookieHeader
    .split(/;\s*/)
    .find((c) => c.toLowerCase().startsWith("token="));
  const token = tokenPair ? tokenPair.substring("token=".length) : "";
  const payload = token ? verifyToken(token) : null;
  if (!payload)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({
    where: { id: String(payload.sub) },
    select: { id: true, name: true, email: true },
  });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(user);
}
