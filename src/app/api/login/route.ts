import { NextResponse } from "next/server";
import { findUserByEmail } from "@/src/lib/users";
import { signToken } from "@/src/lib/jwt";

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

    const user = await findUserByEmail(email);

    if (!user || user.password !== password) {
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
