/** @type {import('next').NextConfig} */
import path from 'path';

const nextConfig = {
    output: "export",
    basePath: process.env.NODE_ENV === 'production' ? '/app' : '',
    webpack: (config) => {
        config.resolve.alias['@style'] = path.resolve('./public/style');
        config.resolve.alias['@image'] = path.resolve('./public/image');
        return config;
    },
};
export default nextConfig;
