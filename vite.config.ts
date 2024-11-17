import reactRefresh from '@vitejs/plugin-react'
import { RemoveWrapperFunction } from 'unplugin-ast/transformers'
import AST from 'unplugin-ast/vite'
import { defineConfig } from 'vite'
import { checker } from 'vite-plugin-checker'
import tsconfigPaths from 'vite-tsconfig-paths'

import PKG from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    reactRefresh(),
    tsconfigPaths(),
    checker({
      typescript: true,
      enableBuild: true,
    }),
    AST({
      transformer: [RemoveWrapperFunction(['tw', 'defineSettingPageData'])],
    }),
  ],
  server: {
    port: 7123,
  },
  define: {
    APP_DEV_CWD: JSON.stringify(process.cwd()),
    APP_NAME: JSON.stringify(PKG.name),
  },
})
