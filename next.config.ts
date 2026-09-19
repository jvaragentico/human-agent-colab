import type { NextConfig } from "next";
const config: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  turbopack: { root: process.cwd() },
  experimental: { workerThreads: true, cpus: 2, useTypeScriptCli: false }
};
export default config;
