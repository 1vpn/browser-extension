import { isFirefox, freeCredentials, mainUrl, proxyAuthUrl } from 'utils/constants'
import { fetchUserData } from 'utils/userData'
import setBadge from 'utils/setBadge'
import apiFetch from 'utils/apiFetch'
import { handleProxyRequest, syncProxyControl } from 'utils/manageProxy'
import logout from 'utils/logout'
import spoofGeolocation from 'utils/spoofGeolocation'
import freeLocations from 'utils/freeLocations'

const setUninstallURL = (host) => {
  chrome.runtime.setUninstallURL(
    `https://${host}/referral_redirect?from=uninstall&url=https://${host}/select_plan/`
  )
}

chrome.storage.local.get(['activeUrl'], (storage) => {
  setUninstallURL(storage.activeUrl || mainUrl)
})

chrome.storage.onChanged.addListener((changes) => {
  if (changes.activeUrl) {
    setUninstallURL(changes.activeUrl.newValue || mainUrl)
  }
})

chrome.runtime.onInstalled.addListener((details) => {
  setBadge()

  if (details.reason === 'install') {
    chrome.storage.local.set({ installDate: Date.now() })

    chrome.tabs.create({
      url: chrome.runtime.getURL('install.html'),
    })
  }
})

chrome.runtime.onStartup.addListener(() => {
  setBadge()
  chrome.storage.local.get(['isConnected'], (storage) => {
    if (storage.isConnected) {
      fetch(`https://${proxyAuthUrl}/ping/`)
      syncProxyControl()
    }
  })
})

if (!isFirefox) {
  // Fires when any extension (including this one) changes proxy settings, so
  // the warning stays accurate if another extension takes over later.
  chrome.proxy.settings.onChange.addListener(() => {
    syncProxyControl()
  })
}

chrome.webRequest.onAuthRequired.addListener(
  (details, callbackFn) => {
    const getCredentialsAsync = () => {
      return new Promise((resolve, reject) => {
        chrome.storage.local.get(
          ['isPremium', 'username', 'sessionAuthToken'],
          (storage) => {
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError))
            } else {
              const credentials = storage.isPremium
                ? {
                    username: storage.username,
                    password: storage.sessionAuthToken,
                  }
                : freeCredentials

              resolve({ authCredentials: credentials })
            }
          }
        )
      })
    }

    if (isFirefox) {
      return getCredentialsAsync()
    } else {
      getCredentialsAsync().then((credentials) => {
        callbackFn(credentials)
      })
    }
  },
  { urls: ['<all_urls>'] },
  [isFirefox ? 'blocking' : 'asyncBlocking']
)

if (isFirefox) {
  browser.proxy.onRequest.addListener(handleProxyRequest, {
    urls: ['<all_urls>'],
  })
}

chrome.alarms.create('fetchUserData', { periodInMinutes: 6 * 60 })

chrome.alarms.onAlarm.addListener((alarm) => {
  chrome.storage.local.get(['sessionAuthToken'], (storage) => {
    if (!storage.sessionAuthToken) return
    if (alarm.name === 'fetchUserData') {
      fetchUserData()
      apiFetch('refresh_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Token ' + storage.sessionAuthToken,
        },
      })
        .then(async (response) => {
          if (!response.ok) {
            const err = await response.json()
            logout()
            throw err
          }
          return response.json()
        })
        .then((data) => {
          chrome.storage.local.set(data)
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    }
  })
})

chrome.webNavigation.onCommitted.addListener((details) => {
  if (
    details.url?.startsWith('chrome://') ||
    details.url?.startsWith('chrome-extension://') ||
    details.url?.startsWith('https://chromewebstore.google.com/')
  )
    return

  chrome.storage.local.get(
    ['spoofGeolocation', 'isConnected', 'currentLocation', 'locations'],
    (storage) => {
      if (
        storage.spoofGeolocation &&
        storage.isConnected &&
        storage.currentLocation
      ) {
        const locations = storage.locations || freeLocations
        const location = locations[storage.currentLocation]
        if (location) {
          chrome.scripting.executeScript({
            target: { tabId: details.tabId, allFrames: true },
            world: 'MAIN',
            injectImmediately: true,
            func: spoofGeolocation,
            args: [
              {
                latitude: location.latitude,
                longitude: location.longitude,
              },
            ],
          })
        }
      }
    }
  )
})
