import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    include: ['src/**/__tests__/**/*.{test,spec}.{ts,tsx,js,jsx}'],
    environment: 'happy-dom',
    globals: true,
    coverage: {
      reporter: ['text', 'html'],
    },
    setupFiles: ['./vitest.setup.ts'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/e2e/**',
      '**/*.spec.ts',
      '**/*.spec.tsx',
    ],
  },
});
