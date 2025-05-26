import type { NextConfig } from "next";
import MonacoWebpackPlugin from "monaco-editor-webpack-plugin";
import path from 'path';

const { BACKEND_API_URL } = process.env;
const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${BACKEND_API_URL}/api/:path*`,
      },
    ];
  },
  webpack(config, { isServer, dev }) {
    // TurbopackにはMonacoWebpackPluginを使用しない
    if (!isServer && !dev) {
      config.plugins.push(
        new MonacoWebpackPlugin({
          languages: ['javascript', 'typescript', 'json', 'html', 'css'],
          filename: "static/[name].worker.js"
        })
      );
    }
    
    // monaco-editor 동적 임포트 문제 해결을 위한 설정
    config.resolve.alias = {
      ...config.resolve.alias,
      'monaco-editor': path.resolve(__dirname, 'node_modules/monaco-editor'),
    };
    
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
    };
    
    // worker 로딩 문제 해결
    config.output.globalObject = 'self';

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
  // Next.js 13 이상에서 monaco-editor를 사용하기 위한 설정
  serverExternalPackages: ['monaco-editor'],
};

export default nextConfig;
