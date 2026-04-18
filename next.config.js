/** @type {import('next').NextConfig} */
const nextConfig = {
  // ESMとして扱う必要があるパッケージを明示的に指定
  serverExternalPackages: ["jsdom"],
}

module.exports = nextConfig
