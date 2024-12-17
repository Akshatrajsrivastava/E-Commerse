/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '/**', // You can adjust the pathname if needed (for example, to match specific image paths)
            },
        ],
    },
};

export default nextConfig;
