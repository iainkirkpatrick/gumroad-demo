import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'
import ViteReact from '@vitejs/plugin-react'
import FullReload from 'vite-plugin-full-reload'
import StimulusHMR from 'vite-plugin-stimulus-hmr'

export default defineConfig({
  plugins: [
    RubyPlugin(),
    ViteReact(),
    FullReload(['config/routes.rb', 'app/views/**/*']),
    StimulusHMR()
  ],
})
