import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("token", "", { httpOnly: true, path: "/", maxAge: 0 });
  redirect("/login");
  return res;
}
