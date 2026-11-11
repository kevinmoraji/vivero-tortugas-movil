import path from 'path';
import react from '@vitejs/plugin-react';

const CARPETA_CODIGO = path.resolve(__dirname, './src');
const CARPETA_PUBLICA = path.resolve(__dirname, './public');
const CARPETA_COMPILADA = path.resolve(__dirname, './www');

export default async () => {
  return {
    plugins: [react()],
    root: CARPETA_CODIGO,
    base: '',
    publicDir: CARPETA_PUBLICA,
    build: {
      outDir: CARPETA_COMPILADA,
      assetsInlineLimit: 0,
      emptyOutDir: true,
      rollupOptions: {
        treeshake: false,
      },
    },
    resolve: {
      alias: {
        '@': CARPETA_CODIGO,
      },
    },
    server: {
      host: true,
      port: 5174,
      strictPort: true,
    },
  };
};