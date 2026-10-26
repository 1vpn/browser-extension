import { useState, useContext } from 'react'
import { Flex, Text } from 'theme-ui'
import { PageContext } from 'context/PageContext'
import flags from 'utils/flags'
import PageHeader from './PageHeader'
import Location from './Location'
import ReviewModal from './ReviewModal'
import RatingModal from './RatingModal'
import InstallModal from './InstallModal'
import Arrow from 'assets/arrow.svg'

const LocationsPage = ({
  activeUrl,
  locations,
  currentCityCode,
  handleLocationToggle,
  installDate,
  messages,
  isPremium,
}) => {
  const { goBackPage } = useContext(PageContext)
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [ratingPromptLocation, setRatingPromptLocation] = useState(null)

  const sortedLocations = Object.values(locations).sort((a, b) => {
    if (!isPremium) {
      const aIsPremium = a.isPremium ? 1 : 0
      const bIsPremium = b.isPremium ? 1 : 0
      if (aIsPremium !== bIsPremium) return aIsPremium - bIsPremium
    }
    const countryCompare = (a.country || '').localeCompare(b.country || '')
    if (countryCompare !== 0) return countryCompare
    return (a.city || '').localeCompare(b.city || '')
  })

  return (
    <>
      <PageHeader
        left={<Text sx={{ fontSize: '20px' }}>{messages.locations}</Text>}
        rightIcon={Arrow}
        onRightClick={goBackPage}
      />
      <InstallModal
        activeUrl={activeUrl}
        messages={messages}
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />
      <ReviewModal
        messages={messages}
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />
      <RatingModal
        messages={messages}
        isOpen={!!ratingPromptLocation}
        onClose={() => {
          const location = ratingPromptLocation
          setRatingPromptLocation(null)
          handleLocationToggle(location)
        }}
        onRate={() => setRatingPromptLocation(null)}
      />
      <Flex
        sx={{
          position: 'relative',
          flexDirection: 'column',
          maxHeight: '525px',
          overflowY: 'overlay',
          overflowX: 'hidden',
          // p: isFirefox ? '0 24px 24px 0' : '0 18px 24px 0',
        }}
      >
        <Flex sx={{ flexDirection: 'column' }}>
          {sortedLocations.map((location) => {
            return (
              <Location
                activeUrl={activeUrl}
                title={messages[location.cityCode]}
                subTitle={messages[location.countryCode]}
                id={location.cityCode}
                checked={currentCityCode === location.cityCode}
                location={location}
                handleLocationToggle={handleLocationToggle}
                installDate={installDate}
                setIsReviewModalOpen={setIsReviewModalOpen}
                setRatingPromptLocation={setRatingPromptLocation}
                setIsInstallModalOpen={setIsInstallModalOpen}
                icon={flags[location.cityCode]}
                isPremium={location.isPremium}
                key={location.cityCode}
              />
            )
          })}
        </Flex>
      </Flex>
    </>
  )
}

export default LocationsPage
