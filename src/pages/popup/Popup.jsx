import { useEffect, useState, useContext } from 'react'
import { PageContext } from 'context/PageContext'
import useLocalization from 'hooks/useLocalization'
import useChromeStorage from 'hooks/useChromeStorage'
import { Flex, Box } from 'theme-ui'
import freeLocations from 'utils/freeLocations'
import { connect, disconnect } from 'utils/manageProxy'
import { localeMessageKeys, mainUrl } from 'utils/constants'
import { fetchUserData } from 'utils/userData'
import MainPage from './MainPage'
import OptionsPage from './OptionsPage'
import LocationsPage from './LocationsPage'
import UpgradePage from './UpgradePage'
import AndroidPage from './AndroidPage'

const Popup = () => {
  const { currentPage, setCurrentPage } = useContext(PageContext)
  const messages = useLocalization(localeMessageKeys)

  const [isLoaded, setIsLoaded] = useState(false)

  const [sessionAuthToken] = useChromeStorage('sessionAuthToken', '')
  const [installDate] = useChromeStorage('installDate', 0)
  const [locations] = useChromeStorage('locations', freeLocations)
  const [isPremium] = useChromeStorage('isPremium', false)
  const [isConnected, setIsConnected] = useChromeStorage('isConnected', false)
  const [currentCityCode, setCurrentCityCode] = useChromeStorage(
    'currentLocation',
    ''
  )
  const [spoofGeolocation, setSpoofGeolocation] = useChromeStorage(
    'spoofGeolocation',
    false
  )
  const [disableWebRtc, setDisableWebRtc] = useChromeStorage(
    'disableWebRtc',
    false
  )
  const [primaryApiUnreachable] = useChromeStorage(
    'primaryApiUnreachable',
    false
  )
  const [proxyControlledByOtherExtension, setProxyControlledByOtherExtension] =
    useChromeStorage('proxyControlledByOtherExtension', false)
  const [activeUrl] = useChromeStorage('activeUrl', mainUrl)

  useEffect(() => {
    fetchUserData()

    chrome.storage.local.get(['currentLocation'], (storage) => {
      if (!storage.currentLocation) {
        const firstLocation = Object.values(locations)[0]
        if (firstLocation) {
          setCurrentCityCode(firstLocation.cityCode)
        }
      }
      setIsLoaded(true)
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleConnectionToggle = () => {
    if (isConnected) {
      setIsConnected(false)
      disconnect()
    } else {
      connect()
    }
  }

  const handleLocationToggle = (location) => {
    setCurrentPage('main')
    setCurrentCityCode(location.cityCode)
    connect()
  }

  const renderCurrentPage = () => {
    // Premium accounts never see the upgrade page, even if it was chosen
    // before their user data finished loading.
    const page = isPremium && currentPage === 'upgrade' ? 'main' : currentPage

    switch (page) {
      case 'locations':
        return (
          <LocationsPage
            activeUrl={activeUrl}
            locations={isPremium ? locations : freeLocations}
            currentCityCode={currentCityCode}
            handleLocationToggle={handleLocationToggle}
            installDate={installDate}
            messages={messages}
            isPremium={isPremium}
          />
        )
      case 'options':
        return (
          <OptionsPage
            activeUrl={activeUrl}
            sessionAuthToken={sessionAuthToken}
            isPremium={isPremium}
            spoofGeolocation={spoofGeolocation}
            setSpoofGeolocation={setSpoofGeolocation}
            disableWebRtc={disableWebRtc}
            setDisableWebRtc={setDisableWebRtc}
            messages={messages}
          />
        )
      case 'upgrade':
        return (
          <UpgradePage activeUrl={activeUrl} messages={messages} />
        )
      case 'android':
        return <AndroidPage messages={messages} />
      case 'main':
      default:
        return (
          <MainPage
            activeUrl={activeUrl}
            isPremium={isPremium}
            isConnected={isConnected}
            currentCityCode={currentCityCode}
            locations={isPremium ? locations : freeLocations}
            handleConnectionToggle={handleConnectionToggle}
            installDate={installDate}
            messages={messages}
            primaryApiUnreachable={primaryApiUnreachable}
            proxyControlledByOtherExtension={proxyControlledByOtherExtension}
            setProxyControlledByOtherExtension={setProxyControlledByOtherExtension}
          />
        )
    }
  }

  if (!isLoaded) {
    return <Box sx={{ width: 0, height: 0 }} />
  }

  return (
    <Flex
      sx={{
        width: '100%',
        minWidth: '375px',
        flexDirection: 'column',
        backgroundColor: 'white',
      }}
    >
      {renderCurrentPage()}
    </Flex>
  )
}

export default Popup
