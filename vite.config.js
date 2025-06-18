import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/', 
<<<<<<< HEAD
  plugins: [react(),tailwindcss()]
=======
  plugins: [react()],
>>>>>>> 5f5d641 (feat : test deployement 1)
  // server: {
  //   proxy: {
  //     '/v1': {
  //       target: 'http://localhost:8081',
  //       changeOrigin: true,
  //       secure: false,
  //       rewrite: (path) => path.replace(/^\/v1/, '/v1'),
  //     }
  //   }
  // }
})
