import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { signToken } from "@/src/lib/jwt";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body?.name || "").trim();
    const email = String(body?.email || "")
      .trim()
      .toLowerCase();
    const password = String(body?.password || "").trim();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      );
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { name, email, passwordHash },
    });

    const token = signToken({
      sub: newUser.id,
      email: newUser.email,
      name: newUser.name,
    });

    const res = NextResponse.json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    });

    res.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
    return res;
  } catch (e) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
