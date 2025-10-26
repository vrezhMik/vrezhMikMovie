/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
    plugins: [vue()],
    resolve: { alias: { '@': path.resolve(__dirname, './src') } },
    test: {
        environment: 'happy-dom',
        globals: true,
        setupFiles: './tests/setup.ts',
        css: false,

        // 🔽 Vitest UI config (no CLI flags needed)
        ui: true,
        uiBase: '/',
        api: {
            host: true,   // bind 0.0.0.0 so it’s reachable from outside the container
            port: 51204,
        },
        watch: true,
    },
})
