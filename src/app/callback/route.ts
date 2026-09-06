// src/app/callback/route.ts
import { handleAuth } from "@workos-inc/authkit-nextjs";

//export const GET = handleAuth();
export const GET = handleAuth({ returnPathname: "/admin", });