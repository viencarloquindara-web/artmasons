import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

// Ensure Turbopack treats the folder containing this config as the project root.
// This fixes cases where Next.js incorrectly infers the root as `/app` and then
// fails to resolve `next/package.json`.
const configDir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: configDir,
  },
};

export default nextConfig;
