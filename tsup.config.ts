import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ['react', 'react-dom'],
  // Component CSS is imported from src/index.ts; tsup emits it as dist/index.css.
  // Rename to the public `oblivion-ui/styles.css` entry point.
  onSuccess: 'mv dist/index.css dist/styles.css 2>/dev/null || true',
});
