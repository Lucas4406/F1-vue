import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'group-user': [
            './src/views/Calificari.vue',
            './src/views/Clasament.vue',
            './src/views/Clasamentpiloti.vue',
            './src/views/Curse.vue',
            './src/views/Echipe.vue',
            './src/views/Formtest.vue',
            './src/views/Istorie.vue',
            './src/views/Joculet.vue',
            './src/views/Live.vue',
            './src/views/login.vue',
            './src/views/Program.vue',
            './src/views/signup.vue',
            './src/views/Stiri.vue',
            './src/views/Surse-pagina.vue',
            './src/views/updateForm.vue',
            './src/views/profile/profile.vue'
          ]
        }
      }
    }
  }
})
