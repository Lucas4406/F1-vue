const { submitToIndexNow } = require('../scripts/indexnow')

const baseUrl = 'https://gridfanhub.com'

const staticRoutes = [
    '/', '/team-standings', '/profile', '/update-profile',
    '/race-results/2025', '/qualifying-results/2025',
    '/reaction-game', '/f1-history', '/drivers', '/teams',
    '/schedule', '/login', '/signup', '/sources',
    '/change-password', '/forgot-password'
]

async function getDynamicRoutes() {
    const res = await fetch('https://api.jolpi.ca/ergast/f1/2025.json?limit=100')
    const data = await res.json()

    return data.MRData.RaceTable.Races.map(race => {
        const year = race.season
        const name = race.raceName.replaceAll(' ', '_')
        return `/schedule/${year}/${name}`
    })
}

async function submitUrlsToIndexNow() {
    const dynamicRoutes = await getDynamicRoutes()

    const allUrls = [
        ...staticRoutes.map(route => `${baseUrl}${route}`),
        ...dynamicRoutes.map(route => `${baseUrl}${route}`)
    ]

    await submitToIndexNow(allUrls)
}

submitUrlsToIndexNow()
