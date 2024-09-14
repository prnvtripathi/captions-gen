/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config) {
        config.module.rules.push({
            test: /\.(woff|woff2|eot|ttf|otf)$/i,
            issuer: {
                and: [/\.(ts|tsx|js|jsx|md|mdx)$/]
            },
            type: 'asset/resource'
        })
        return config
    }
};

export default nextConfig;
