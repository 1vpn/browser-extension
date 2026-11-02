const https = require('https')
const fs = require('fs')
const path = require('path')

function fetchFreeServers() {
  return new Promise((resolve, reject) => {
    https.get('https://1vpn.org/api/get_proxy_servers/', (res) => {
      let data = ''
      res.on('data', (chunk) => { data += chunk })
      res.on('end', () => {
        try {
          resolve(JSON.parse(data))
        } catch (error) {
          reject(error)
        }
      })
    }).on('error', reject)
  })
}

// Every browser shows the rating prompt for Singapore; the refer/review
// "to unlock" flow (ratingLocked) is no longer used on Edge or Firefox.
const FREE_LOCATIONS_OVERRIDES = { sgp: { ratingPrompt: true } }

async function updateFreeLocations() {
  const freeLocationsPath = path.join(__dirname, '../src/utils/freeLocations.js')

  try {
    const apiData = await fetchFreeServers()
    for (const [code, overrides] of Object.entries(FREE_LOCATIONS_OVERRIDES)) {
      if (apiData[code]) {
        Object.assign(apiData[code], overrides)
      }
    }
    const fileContent = `const freeLocations = ${JSON.stringify(apiData, null, 2)}\n\nexport default freeLocations\n`
    fs.writeFileSync(freeLocationsPath, fileContent, 'utf-8')
  } catch (error) {
    // Ignore errors
  }
}

module.exports = updateFreeLocations

if (require.main === module) {
  updateFreeLocations().then(() => process.exit(0)).catch(() => process.exit(0))
}
