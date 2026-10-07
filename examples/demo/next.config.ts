import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Il kit è codice sorgente del workspace, non un pacchetto già compilato.
  transpilePackages: ["@mattia/ui"],
  // La radice del workspace: serve a Turbopack per seguire il link a packages/ui.
  turbopack: { root: path.join(__dirname, "../..") },
};

export default nextConfig;
