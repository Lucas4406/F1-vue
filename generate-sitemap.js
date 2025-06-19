const fs = require('fs')
const path = require('path')

// Exemplu de rute dinamice extrase dintr-un API
async function getDynamicRoutes() {
    const res = await fetch('https://api.jolpi.ca/ergast/f1/2025.json?limit=100')
    const data = await res.json()

    return data.MRData.RaceTable.Races.map(race => {
        const year = race.season
        const name = race.raceName.replaceAll(' ', '-').toLowerCase()
        return `/schedule/${year}/${name}`
    })
}

async function generateSitemap() {
    const baseUrl = 'https://gridfanhub.com'
    const staticRoutes = [
        '/',
        '/team-standings',
        '/profile',
        '/update-profile',
        '/race-results/2025',
        '/qualifying-results/2025',
        '/reaction-game',
        '/f1-history',
        '/drivers',
        '/teams',
        '/schedule',
        '/login',
        '/signup',
        '/sources',
        '/change-password',
        '/forgot-password',
    ]

    const dynamicRoutes = await getDynamicRoutes()

    const urls = [...staticRoutes.map(route => ({
        loc: `${baseUrl}${route}`,
        lastmod: new Date().toISOString().split('T')[0],
        priority: route === '/' ? 1.0 : 0.8
    })), ...dynamicRoutes.map(route => ({
        loc: `${baseUrl}${route}`,
        lastmod: new Date().toISOString().split('T')[0], // Sau data cursei din API dacă ai
        priority: 0.8
    }))]

    const xmlUrls = urls.map(url => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <priority>${url.priority}</priority>
  </url>
`).join('\n')
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
>
${xmlUrls}
</urlset>`

    fs.writeFileSync(path.resolve(__dirname, './public/sitemap.xml'), sitemap.trim())
    console.log('✅ Sitemap generated')
}

generateSitemap()
