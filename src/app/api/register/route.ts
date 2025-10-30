import { NextResponse } from "next/server";
import { createUser, findUserByEmail } from "@/src/lib/users";
import { signToken } from "@/src/lib/jwt";

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
    if (await findUserByEmail(email)) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      );
    }
    const newUser = await createUser({ name, email, password });

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
