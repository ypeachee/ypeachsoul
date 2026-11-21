import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/ypeachsoul/' : '/',
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['icon.svg'],
      manifest: {
        name: '关于你的单案例研究',
        short_name: '单案例研究',
        description: '30 个情境选择，约 5 分钟，生成一份以你为唯一样本的人格观察报告。',
        theme_color: '#151817',
        background_color: '#151817',
        display: 'standalone',
        start_url: './',
        lang: 'zh-CN',
        icons: [
          {
            src: 'icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        navigateFallback: 'index.html',
      },
    }),
  ],
  server: {
    host: '127.0.0.1',
    port: 4173,
  },
});