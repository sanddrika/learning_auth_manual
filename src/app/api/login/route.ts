import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { signToken } from "@/src/lib/jwt";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body?.email || "")
      .trim()
      .toLowerCase();
    const password = String(body?.password || "").trim();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing credentials" },
        { status: 400 }
      );
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }
    const token = signToken({
      sub: user.id,
      email: user.email,
      name: user.name,
    });
    const res = NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
    res.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
