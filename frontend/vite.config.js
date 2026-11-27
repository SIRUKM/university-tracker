import fs from 'fs'
import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const SPA_ROUTES = [
  'student-deals',
  'deals',
  'grade-calculator',
  'my-journey',
  'roadmap',
]

/** Copy built index.html into SPA route folders so static hosts serve them directly on reload/share. */
function emitSpaRouteFallbacks() {
  let rootDir = process.cwd()
  let outDir = 'dist'

  return {
    name: 'emit-spa-route-fallbacks',
    configResolved(config) {
      rootDir = config.root
      outDir = config.build.outDir
    },
    closeBundle() {
      const distPath = path.resolve(rootDir, outDir)
      const indexHtml = path.join(distPath, 'index.html')
      if (!fs.existsSync(indexHtml)) return

      const html = fs.readFileSync(indexHtml, 'utf8')
      for (const route of SPA_ROUTES) {
        const routeDir = path.join(distPath, route)
        fs.mkdirSync(routeDir, { recursive: true })
        fs.writeFileSync(path.join(routeDir, 'index.html'), html, 'utf8')
      }
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    emitSpaRouteFallbacks(),
  ],
})
