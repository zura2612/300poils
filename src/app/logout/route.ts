// src/app/logout/route.ts
import { signOut } from "@workos-inc/authkit-nextjs";

export async function GET() {
  await signOut();
}