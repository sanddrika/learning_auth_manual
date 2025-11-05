import jwt from "jsonwebtoken";

const DEFAULT_EXPIRY = "7d";
export type JwtPayload = {
  sub: string;
  email: string;
  name: string;
};

export function signToken(
  payload: JwtPayload,
  secret = process.env.JWT_SECRET
): string {
  if (!secret) throw new Error("JWT_SECRET is not set");

  return jwt.sign(payload, secret, { expiresIn: DEFAULT_EXPIRY });
}

export function verifyToken(
  token: string,
  secret = process.env.JWT_SECRET
): JwtPayload | null {
  if (!secret) throw new Error("JWT_SECRET is not set");
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch {
    return null;
  }
}
