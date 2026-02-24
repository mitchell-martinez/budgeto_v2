import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import tsconfigPaths from 'vite-tsconfig-paths';

const isStorybook = process.argv[1]?.includes('storybook');

export default defineConfig({
  plugins: [
    !isStorybook && reactRouter(),
    tsconfigPaths(),
    !isStorybook &&
      VitePWA({
        strategies: 'injectManifest',
        srcDir: 'src',
        filename: 'entry.worker.ts',
        registerType: 'autoUpdate',
        injectManifest: {
          globPatterns: ['**/*.{js,css,html,svg,png,ico,woff,woff2}'],
        },
        devOptions: {
          enabled: false, // Enable in dev with `true` for testing
        },
        manifest: false, // We manage manifest.webmanifest manually
      }),
  ],
});
