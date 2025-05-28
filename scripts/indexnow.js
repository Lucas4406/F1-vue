/**
 * Trimite o listă de URL-uri absolute către IndexNow.
 * @param {string[]} urls
 */
async function submitToIndexNow(urls) {
    const key = 'e0f96968ad4d4161815b0b9d86f01f5a'
    const host = 'gridfanhub.com'
    const keyLocation = `https://${host}/${key}.txt`

    try {
        const res = await fetch('https://api.indexnow.org/indexnow', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                host,
                key,
                keyLocation,
                urlList: urls
            })
        })

        if (!res.ok) {
            console.error(`❌ IndexNow error: ${res.status} - ${res.statusText}`)
        } else {
            console.log(`✅ IndexNow: ${urls.length} URL-uri trimise`)
        }
    } catch (err) {
        console.error('❌ Eroare la trimiterea către IndexNow:', err)
    }
}

module.exports = { submitToIndexNow }
