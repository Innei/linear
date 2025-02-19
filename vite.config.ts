import reactRefresh from '@vitejs/plugin-react'
import { cyan, dim, green } from 'kolorist'
import { RemoveWrapperFunction } from 'unplugin-ast/transformers'
import AST from 'unplugin-ast/vite'
import type { PluginOption, ViteDevServer } from 'vite'
import { defineConfig } from 'vite'
import { checker } from 'vite-plugin-checker'
import tsconfigPaths from 'vite-tsconfig-paths'

import PKG from './package.json'

const devPrint = (): PluginOption => ({
  name: 'dev-print',
  configureServer(server: ViteDevServer) {
    const _printUrls = server.printUrls
    server.printUrls = () => {
      _printUrls()
      console.info(
        `  ${green('➜')}  ${dim('Online debug')}: ${cyan(
          'https://linear.innei.in/__debug_proxy',
        )}`,
      )
    }
  },
})

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    reactRefresh(),
    tsconfigPaths(),
    // MillionLint.vite({}),
    checker({
      typescript: true,
      enableBuild: true,
    }),
    AST({
      transformer: [RemoveWrapperFunction(['tw', 'defineSettingPageData'])],
    }),
    devPrint(),
  ],
  server: {
    port: 7123,
  },
  define: {
    APP_DEV_CWD: JSON.stringify(process.cwd()),
    APP_NAME: JSON.stringify(PKG.name),
  },
})
