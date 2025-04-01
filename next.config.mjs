import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {

  devIndicators: {
    //buildActivity: false, // Oculta el indicador de compilación
    buildActivityPosition: 'bottom-right', // Puedes cambiar la posición si lo deseas
  },
  webpack: (config, { isServer, webpack }) => {
    // Configuración de alias
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(process.cwd(), 'src'),
      '@components': path.resolve(process.cwd(), 'src/components'),
      '@lib': path.resolve(process.cwd(), 'src/lib')
    };

    // Solo para el lado del cliente
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        dns: false,
        net: false,
        tls: false,
        fs: false,
        child_process: false,
        pg: false
      };

      // Excluir completamente paquetes de DB del cliente
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^pg-native$|^dns$|^net$|^tls$|^fs$|^child_process$/,
        })
      );
    }

    return config;
  },
  // Configuración para paquetes externos (reemplaza serverComponentsExternalPackages)
  serverExternalPackages: ['pg', '@pqina/pintura', '@pqina/react-pintura'],
  // Habilitar Server Actions si es necesario (opcional)
  experimental: {
    serverActions: true // Solo si realmente necesitas esta característica
  },
  transpilePackages: ['next-auth'],
  output: 'standalone'
};

export default nextConfig;