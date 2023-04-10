/** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   build: {
//     extend(config, {}) {
//         config.node = {
//             fs: 'empty'
//         }
//     }
  
//   },
module.exports = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
        // don't resolve 'fs' module on the client to prevent this error on build --> Error: Can't resolve 'fs'
        config.resolve.fallback = {
            fs: false
        }
    }
    
    return config;
}
}

  

