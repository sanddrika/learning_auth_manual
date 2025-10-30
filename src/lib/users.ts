import { promises as fs } from "fs";
import path from "path";

export type StoredUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
};

type UsersFile = {
  users: StoredUser[];
};

const usersFilePath = path.join(process.cwd(), "users.json");

async function ensureUsersFile(): Promise<void> {
  try {
    await fs.access(usersFilePath);
  } catch {
    const initial: UsersFile = { users: [] };
    await fs.writeFile(usersFilePath, JSON.stringify(initial, null, 2), "utf8");
  }
}

export async function readUsers(): Promise<UsersFile> {
  await ensureUsersFile();
  const data = await fs.readFile(usersFilePath, "utf8");
  return JSON.parse(data) as UsersFile;
}

export async function writeUsers(contents: UsersFile): Promise<void> {
  await fs.writeFile(usersFilePath, JSON.stringify(contents, null, 2), "utf8");
}

export async function findUserByEmail(
  email: string
): Promise<StoredUser | undefined> {
  const data = await readUsers();
  return data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export async function createUser(
  user: Omit<StoredUser, "id" | "createdAt">
): Promise<StoredUser> {
  const data = await readUsers();
  if (await findUserByEmail(user.email)) {
    throw new Error("Email already in use");
  }
  const newUser: StoredUser = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...user,
  };
  data.users.push(newUser);
  await writeUsers(data);
  return newUser;
}
