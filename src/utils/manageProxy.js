import setBadge from './setBadge'
import { isFirefox, mainUrl, backupUrls, proxyAuthUrl } from './constants'
import freeLocations from './freeLocations'

const whitelistDomains = ['localhost', '127.0.0.1', mainUrl, ...backupUrls]

const handleProxyRequest = (details) => {
  return new Promise((resolve, reject) => {
    const url = new URL(details.url)
    const hostname = url.hostname

    if (whitelistDomains.some(domain => hostname === domain || hostname.endsWith(`.${domain}`))) {
      resolve({ type: 'direct' })
      return
    }

    chrome.storage.local.get(
      ['isConnected', 'currentLocation', 'locations'],
      (storage) => {
        if (storage.isConnected && storage.currentLocation) {
          const locations = storage.locations || freeLocations
          const location = locations[storage.currentLocation]
          if (location && location.hosts) {
            const randomizedHosts = [...location.hosts].sort(() => Math.random() - 0.5)
            resolve(randomizedHosts.map((host) => ({
              type: 'https',
              host: host.hostname,
              port: host.port,
            })))
          } else {
            resolve({ type: 'direct' })
          }
        } else {
          resolve({ type: 'direct' })
        }
      }
    )
  })
}

const getPacScript = (hosts) => {
  const hostNamesString = hosts.reduce(
    (hostsString, host) =>
      (hostsString += `HTTPS ${host.hostname}:${host.port};`),
    ''
  )

  const whitelistChecks = whitelistDomains
    .map(domain => `dnsDomainIs(host, "${domain}")`)
    .join(' || ')

  return `
    function FindProxyForURL(url, host) {
      if (${whitelistChecks}) {
        return "DIRECT";
      }
      return "${hostNamesString}";
    }
  `
}

// Chrome gives proxy control to the most recently installed extension that
// asks for it. While connected, record whether another extension outranks us
// so the popup can show ProxyConflictModal instead of a false "Connected".
const syncProxyControl = () => {
  if (isFirefox) return Promise.resolve()
  return Promise.all([
    chrome.proxy.settings.get({}),
    chrome.storage.local.get(['isConnected']),
  ]).then(([setting, storage]) =>
    chrome.storage.local.set({
      proxyControlledByOtherExtension:
        Boolean(storage.isConnected) &&
        setting.levelOfControl === 'controlled_by_other_extensions',
    })
  )
}

const connect = () => {
  chrome.storage.local.get(['currentLocation', 'locations'], async (storage) => {
    if (!storage.currentLocation) return

    const locations = storage.locations || freeLocations
    const location = locations[storage.currentLocation]

    if (!location || !location.hosts) return

    if (!isFirefox) {
      // Refuse to connect while another extension controls the proxy; the
      // flag opens ProxyConflictModal in the popup.
      const { levelOfControl } = await chrome.proxy.settings.get({})
      if (levelOfControl === 'controlled_by_other_extensions') {
        chrome.storage.local.set({
          isConnected: false,
          proxyControlledByOtherExtension: true,
        })
        return
      }

      const randomizedHosts = [...location.hosts].sort(
        () => Math.random() - 0.5
      )
      const pacScript = getPacScript(randomizedHosts)

      chrome.proxy.settings
        .set({
          value: {
            mode: 'pac_script',
            pacScript: {
              data: pacScript,
              mandatory: true,
            },
          },
          scope: 'regular',
        })
        .then(() => {
          fetch(`https://${proxyAuthUrl}/ping/`)
          syncProxyControl()
        })
    }

    chrome.storage.local.set({ isConnected: true })
    setBadge()
  })
}

const disconnect = () => {
  if (!isFirefox) {
    chrome.proxy.settings.set({
      value: { mode: 'direct', rules: {} },
      scope: 'regular',
    })
  }
  chrome.storage.local.set({
    isConnected: false,
    proxyControlledByOtherExtension: false,
  })
  chrome.action.setBadgeText({ text: '' })
}

export { handleProxyRequest, connect, disconnect, syncProxyControl }
