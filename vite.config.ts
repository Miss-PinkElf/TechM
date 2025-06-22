import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
// AI
// vite
export default defineConfig({
  plugins: [
    react(),
    // 让你可以像这样导入SVG: import { ReactComponent as Logo } from './logo.svg'
    // 或者 import Logo from './logo.svg?react'
    svgr(),
  ],
})