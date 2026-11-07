import type { NextConfig } from "next";

// GitHub Pages only serves static files, so the Pages workflow builds a static
// export served from /<repo-name>/. Local `npm run dev` / `npm run build` are unchanged.
const isPages = process.env.GITHUB_PAGES === "true";
const basePath = isPages ? process.env.PAGES_BASE_PATH ?? "" : "";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  // Partial prerendering can't run in a static export, so these are local/server-only.
  cacheComponents: !isPages,
  partialPrefetching: !isPages,
  ...(isPages && {
    output: "export",
    basePath,
    trailingSlash: true,
    images: { unoptimized: true },
  }),
  env: {
    NEXT_PUBLIC_STATIC_EXPORT: isPages ? "true" : "false",
  },
};

export default nextConfig;
