import { rsbuildConfig } from '@halo-dev/ui-plugin-bundler-kit'
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin'
import Icons from 'unplugin-icons/rspack'

export default rsbuildConfig({
  rsbuild: {
    resolve: {
      alias: {
        '@': './src',
      },
    },
    tools: {
      rspack: {
        plugins: [Icons({ compiler: 'vue3' }), new MonacoWebpackPlugin()],
      },
    },
  },
})
