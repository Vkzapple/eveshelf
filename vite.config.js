import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' membuat hasil build bisa di-host di mana saja (root domain, subfolder, GitHub Pages).
export default defineConfig({ base: './', plugins: [react()] })
