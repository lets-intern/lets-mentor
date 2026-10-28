import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // 렛츠커리어 프로그램 썸네일과 멘토 프로필 이미지 (src/lib/programs.ts)
    remotePatterns: [
      new URL("https://letsintern-bucket.s3.ap-northeast-2.amazonaws.com/program/**"),
      new URL("https://letsintern-bucket.s3.ap-northeast-2.amazonaws.com/user/**"),
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
