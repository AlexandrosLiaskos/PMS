import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@radix-ui/react-avatar",
    "@radix-ui/react-label",
    "@radix-ui/react-slot",
    "@radix-ui/react-dialog",
    "lucide-react",
  ],
};

export default nextConfig;