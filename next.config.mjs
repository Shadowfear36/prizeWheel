/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
      config.module.rules.push({
        test: /\.(mp3|wav|ogg|m4a)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'static/audio/',
            publicPath: '/_next/static/audio/',
          },
        },
      });
  
      return config;
    },
  };

export default nextConfig;
