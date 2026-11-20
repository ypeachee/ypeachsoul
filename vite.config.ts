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
        name: '灵魂使用说明书',
        short_name: '灵魂手册',
        description: '用十个选择，读一遍你此刻的内在运行方式。',
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