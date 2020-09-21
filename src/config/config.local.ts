import { defineConfig } from 'umi';

export default defineConfig({
  // fix prefix-less CSS warn.
  targets: false,
  autoprefixer: false,
});
