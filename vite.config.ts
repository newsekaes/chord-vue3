import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import styleImport, { VantResolve } from 'vite-plugin-style-import';
import { resolve } from 'path'


function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir)
}

process.env.DEPLOY_ENV = process.env.npm_config_dp_env || 'default'

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.DEPLOY_ENV === 'gh-page'
  ? '/chord-vue3/'
  : '/',
  plugins: [
    vue(), // 基础的 vue 插件支持
    vueJsx(), // vue-jsx 插件支持
    styleImport({
      resolves: [VantResolve()],
    }), // Vant 按需引入 插件支持
  ],
  resolve: {
    alias: [
      // /@/xxxx => src/xxxx
      {
        find: /@\//,
        replacement: pathResolve('src') + '/',
      },
    ]
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "@/style/variables.scss" as *;'
      }
    },
    modules: {
      localsConvention: 'camelCaseOnly'
    }
  }
})
