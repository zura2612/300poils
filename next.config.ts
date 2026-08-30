// 300poils-vercel/next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
        async headers() {
          return [
          {
          source: "/:path*",
          headers: [ { key: "Link", value: '<https://300poils.vercel.app/llms.txt>; rel="alternate"; type="text/markdown"', },],
          },
          ];
        },
	/*experimental: {
          serverActions: { allowedOrigins: ['www.site-toilettage47.com', 'site-toilettage47.com'] },
        },*/
        images: { 
          qualities: [75],
          deviceSizes: [640, 750, 828, 1080, 1200], //largeurs pour desktop
          imageSizes: [128, 256, 384], //largeurs pour mobile
        },
};

export default nextConfig;
