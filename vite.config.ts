import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server: {
		port: 1234, // Ganti dengan port yang kamu inginkan
		strictPort: false, // Jika true, Vite akan error jika port 3000 sudah dipakai
	}
})
