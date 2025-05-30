/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: false,
  reactStrictMode: false,
  images: {
    domains: [
      "localhost",
      "reselluae.com",
      "dxb.reselluae.com",
      "codnetwork.reselluae.com",
      "parfumderoman.reselluae.com",
      "96613.ecomdoors.com",
      "ecomdoor-images.s3.ap-southeast-1.amazonaws.com",
    ],
  },
};

export default nextConfig;
