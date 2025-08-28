import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
        ppr: "incremental",
        browserDebugInfoInTerminal: true,
    },
};

export default nextConfig;
