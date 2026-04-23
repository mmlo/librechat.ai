const { execSync } = require('child_process')
const os = require('os')

function cleanCache() {
  const isWindows = os.platform() === 'win32'
  const sitemapCommand = 'pnpm next-sitemap'
  const removeCacheCommand = isWindows ? 'rmdir /s /q .next\\\\cache' : 'rm -rf .next/cache'

  // Run next-sitemap — this must succeed for the build to be valid.
  try {
    execSync(sitemapCommand, { stdio: 'inherit', shell: true })
  } catch (error) {
    console.error('Error running next-sitemap:', error)
    process.exit(1)
  }

  // Remove the Next.js cache to reduce the deployed image size.
  // This is best-effort: on some systems (e.g. Railway's overlay filesystem)
  // the directory may still be held open by the build process, so we treat
  // a failure here as a non-fatal warning rather than a build error.
  try {
    execSync(removeCacheCommand, { stdio: 'inherit', shell: true })
  } catch (error) {
    console.warn(
      'Warning: could not remove .next/cache (device or resource busy) — skipping. ' +
        'The cache will be cleaned up on the next build.',
      error.message,
    )
  }
}

cleanCache()
