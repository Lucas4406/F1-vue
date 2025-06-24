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
    const staticRoutesWithPriority = {
        '/': 1.0,
        '/schedule': 0.9,
        '/drivers': 0.9,
        '/teams': 0.9,
        '/race-results/2025': 0.9,
        '/qualifying-results/2025': 0.9,
        '/reaction-game': 0.8,
        '/f1-history': 0.7,
        "/privacy-policy": 0.6,
        '/profile': 0.5,
        '/update-profile': 0.5,
        '/login': 0.5,
        '/signup': 0.5,
        '/change-password': 0.5,
        '/forgot-password': 0.5,
        '/info': 0.2,
    }

    const dynamicRoutes = await getDynamicRoutes()

    const urls = [
        ...Object.entries(staticRoutesWithPriority).map(([route, priority]) => ({
            loc: `${baseUrl}${route}`,
            lastmod: new Date().toISOString().split('T')[0],
            priority
        })),
        ...dynamicRoutes.map(route => ({
            loc: `${baseUrl}${route}`,
            lastmod: new Date().toISOString().split('T')[0], // Sau race.date
            priority: 0.7 // sau poți seta altă logică (ex: 0.9 pentru Monaco etc.)
        }))
    ]

    const xmlUrls = urls.map(url => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>daily</changefreq>
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
