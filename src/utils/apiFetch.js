import { mainUrl, backupUrls } from 'utils/constants'

// A blocked domain (e.g. DNS-poisoned in China) typically black-holes the TCP
// connection rather than refusing it, so without a timeout a single fetch can
// hang for minutes and failover never happens.
const REQUEST_TIMEOUT_MS = 10000

const allHosts = [mainUrl, ...backupUrls]

const fetchWithTimeout = async (url, options) => {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

// Only a real answer from our API counts. 401 is included so an expired token
// still reaches the callers that log the user out. Anything else (Cloudflare
// challenge pages, 5xx, captive portals) falls through to the next host.
const shouldUseResponse = (response) =>
  response.ok || response.status === 401

const getActiveUrl = () =>
  new Promise((resolve) => {
    chrome.storage.local.get(['activeUrl'], (storage) => {
      resolve(storage.activeUrl)
    })
  })

const setActiveHost = (host) => {
  chrome.storage.local.set({
    activeUrl: host,
    primaryApiUnreachable: host !== mainUrl,
  })
}

// Try the last host that worked first so users stuck on a backup don't pay the
// main-domain timeout on every call, then the rest in configured order.
const getHostOrder = (activeUrl) =>
  allHosts.includes(activeUrl)
    ? [activeUrl, ...allHosts.filter((host) => host !== activeUrl)]
    : allHosts

// While we're on a backup, cheaply check whether the main domain is reachable
// again so links and the "blocked" banner switch back once it is.
const probePrimary = () => {
  fetchWithTimeout(`https://${mainUrl}/ping/`, { method: 'GET' })
    .then((response) => {
      if (response.ok) setActiveHost(mainUrl)
    })
    .catch(() => {})
}

const apiFetch = async (endpoint, options) => {
  const activeUrl = await getActiveUrl()

  for (const host of getHostOrder(activeUrl)) {
    try {
      const response = await fetchWithTimeout(
        `https://${host}/api/${endpoint}/`,
        options
      )
      if (shouldUseResponse(response)) {
        setActiveHost(host)
        if (host !== mainUrl) probePrimary()
        return response
      }
    } catch (e) {
      console.log(e)
    }
  }

  throw new Error('All API hosts failed')
}

export default apiFetch
