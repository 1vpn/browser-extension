import { disconnect } from 'utils/manageProxy'
import freeLocations from 'utils/freeLocations'
import { mainUrl } from 'utils/constants'

const logout = () => {
  disconnect()

  chrome.storage.local.get(['activeUrl'], (storage) => {
    fetch(`https://${storage.activeUrl || mainUrl}/logout/`, { method: 'GET' })
  })

  const keysToKeep = [
    'messages',
    'installDate',
    'locationUnlocked',
    'upgradeModalClicked',
    'upgradeOptionPickedAt',
    'installModalClickedTime',
    'userModalType',
    'activeUrl',
    'spoofGeolocation',
    'disableWebRtc',
    'rated',
    'ratingPromptShown',
    'shownBlockedServersWarningModal',
  ]

  chrome.storage.local.get(null, (items) => {
    const keysToRemove = Object.keys(items).filter(
      (key) => !keysToKeep.includes(key)
    )
    if (keysToRemove.length) {
      chrome.storage.local.remove(keysToRemove)
    }
    const firstLocation = Object.values(freeLocations)[0]
    if (firstLocation) {
      chrome.storage.local.set({ currentLocation: firstLocation.cityCode })
    }
  })
}

export default logout
