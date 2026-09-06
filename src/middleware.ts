// fichier src/middleware.ts
import { authkitMiddleware } from "@workos-inc/authkit-nextjs";

//export default authkitMiddleware({ redirectUri: process.env.WORKOS_REDIRECT_URI, });
export default authkitMiddleware();

export const config = {
  matcher: [
    /*
     * Exclut du middleware :
     * - _next/static & _next/image (fichiers internes Next.js)
     * - Tous les fichiers ayant une extension dans /public (.xml, .txt, .png, .ico, etc.)
     */
    "/((?!_next/static|_next/image|.*\\.[\\w]+$).*)",
  ],
};