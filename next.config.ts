// 300poils-vercel/next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
        async headers() {
          return [
          {
          source: "/:path*",
          headers: [ { key: "Link", value: '<https://300poils-fvsoft-1963.vercel.app/llms.txt>; rel="alternate"; type="text/markdown"', },],
          },
          ];
        },
        images: { 
          qualities: [75],
          deviceSizes: [640, 750, 828, 1080, 1200], //largeurs pour desktop
          imageSizes: [128, 256, 384], //largeurs pour mobile
        },
};
//const nextConfig: NextConfig = {
  // Force l'utilisation de Webpack pour le build de production => NON!
  // (Turbopack reste utilisé pour `next dev` sauf si --no-turbo est passé)
//};

export default nextConfig;
