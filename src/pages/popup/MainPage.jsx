import { useContext, useState, useEffect } from 'react'
import { PageContext } from 'context/PageContext'
import { Box, Flex, Button, Link, Text } from 'theme-ui'
import flags from 'utils/flags'
import { TWENTY_FOUR_HOURS } from 'utils/constants'
import Logo from 'assets/logo.svg'
import MenuIcon from 'assets/menu.svg'
import Star from 'assets/star.svg'
import ChevronRight from 'assets/chevronRight.svg'
import { mirrorInRtl } from 'utils/direction'
import PageHeader from './PageHeader'
import RatingModal from './RatingModal'
import BlockedServersWarningModal from './BlockedServersWarningModal'
import ProxyConflictModal from './ProxyConflictModal'

const MainPage = ({
  activeUrl,
  isPremium,
  isConnected,
  currentCityCode,
  locations,
  handleConnectionToggle,
  messages,
  primaryApiUnreachable,
  proxyControlledByOtherExtension,
  setProxyControlledByOtherExtension,
  installDate,
}) => {
  const { setCurrentPage } = useContext(PageContext)
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false)

  useEffect(() => {
    if (!installDate) return
    chrome.storage.local.get(['rated', 'ratingPromptShown'], (storage) => {
      if (
        !storage.rated &&
        !storage.ratingPromptShown &&
        Date.now() - installDate > TWENTY_FOUR_HOURS
      ) {
        setIsRatingModalOpen(true)
      }
    })
  }, [installDate])

  const dismissRatingModal = () => {
    chrome.storage.local.set({ rated: true })
    setIsRatingModalOpen(false)
  }

  return (
    <Flex
      sx={{
        flexDirection: 'column',
        color: 'black',
        overflow: 'hidden',
      }}
    >
      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={dismissRatingModal}
        onRate={() => setIsRatingModalOpen(false)}
        messages={messages}
      />
      {!isPremium && <BlockedServersWarningModal isConnected={isConnected} messages={messages} />}
      <ProxyConflictModal
        isOpen={proxyControlledByOtherExtension}
        onClose={() => setProxyControlledByOtherExtension(false)}
        messages={messages}
      />
      <PageHeader
        left={
          <Link
            href={`https://${activeUrl}`}
            target="_blank"
            sx={{
              all: 'unset',
              cursor: 'pointer',
              height: '28px',
              display: 'block',
            }}
          >
            <Box
              as={Logo}
              sx={{
                height: '28px',
                width: 'auto',
              }}
            />
          </Link>
        }
        rightIcon={MenuIcon}
        rightButtonId="optionsPageButton"
        onRightClick={() => setCurrentPage('options')}
      />
      <Flex
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          pt: '60px',
          pb: '48px',
        }}
      >
        <Flex
          sx={{
            height: '90px',
            width: '175px',
            justifyContent: 'center',
          }}
        >
          <Button
            id="proxyToggle"
            onClick={() => handleConnectionToggle()}
            title={isConnected ? messages.connected : messages.disconnected}
            sx={{
              appearance: 'none',
              cursor: 'pointer',
              p: '8px 10px',
              height: '100%',
              width: '100%',
              borderRadius: '70px',
              backgroundColor: isConnected ? 'blue' : 'toggleGrey',
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <Box
              sx={{
                height: '70px',
                width: '70px',
                backgroundColor: '#fff',
                borderRadius: '100%',
                transform: `translateX(${isConnected ? '85px' : '0px'})`,
                '[dir="rtl"] &': {
                  transform: `translateX(${isConnected ? '-85px' : '0px'})`,
                },
                transition: 'all 0.2s ease-in-out',
              }}
            />
          </Button>
        </Flex>
        <Box
          sx={{
            mt: '16px',
            fontSize: '18px',
          }}
        >
          {isConnected ? messages.connected : messages.disconnected}
        </Box>
      </Flex>
      <Flex
        sx={{
          flexDirection: 'column',
          px: '22px',
          pb: '24px',
        }}
      >
        <Button
          id="locationsPageButton"
          onClick={() => setCurrentPage('locations')}
          title={messages.goToLocationsPage}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            p: '16px 18px',
            width: '100%',
            borderRadius: '8px',
            fontSize: '16px',
            color: 'black',
            backgroundColor: 'white',
            border: '1px solid',
            borderColor: 'darkBorderGrey',
            transition: 'all 0.2s ease-in-out',
            ':hover': {
              backgroundColor: 'borderGrey50',
            },
          }}
        >
          {currentCityCode && locations[currentCityCode] && (
            <>
              <Box
                as={flags[currentCityCode]}
                sx={{
                  height: '30px',
                  width: '30px',
                  borderRadius: '6px',
                  backgroundColor: 'toggleGrey',
                }}
              />
              <Flex
                sx={{
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  flex: 1,
                  marginInlineStart: '18px',
                }}
              >
                <Text sx={{ fontSize: '14px', fontWeight: 400 }}>
                  {messages[locations[currentCityCode].cityCode]}
                </Text>
                <Text sx={{ fontSize: '13px', color: 'grey', fontWeight: 300 }}>
                  {messages[locations[currentCityCode].countryCode]}
                </Text>
              </Flex>
            </>
          )}
          <Box
            as={ChevronRight}
            sx={{
              color: 'grey',
              height: '24px',
              width: '24px',
              ...mirrorInRtl,
            }}
          />
        </Button>

        {!isPremium && (
          <>
            <Button
              id="upgradeLink"
              onClick={() =>
                window.open(`https://${activeUrl}/select_plan`, '_blank')
              }
              title={messages.upgradeToPremium}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                p: '16px 18px',
                width: '100%',
                borderRadius: '8px',
                fontSize: '16px',
                color: 'white',
                backgroundColor: 'blue',
                transition: 'all 0.2s ease-in-out',
                mt: '16px',
                textDecoration: 'none',
                ':hover': {
                  backgroundColor: 'darkBlue',
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '32px',
                  width: '32px',
                  borderRadius: '6px',
                  backgroundColor: 'white20',
                  overflow: 'visible',
                }}
              >
                <Box
                  as={Star}
                  sx={{
                    overflow: 'visible',
                    height: '18px',
                    width: '18px',
                  }}
                />
              </Box>
              <Flex
                sx={{
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  flex: 1,
                  marginInlineStart: '18px',
                }}
              >
                <Text sx={{ fontSize: '14px', fontWeight: 400 }}>
                  {messages.upgradeToPremium}
                </Text>
                <Text sx={{ fontSize: '13px', fontWeight: 300 }}>
                  {messages.moreLocationsAndFasterSpeeds}
                </Text>
              </Flex>
              <Box
                as={ChevronRight}
                sx={{
                  color: 'white',
                  ...mirrorInRtl,
                }}
              />
            </Button>
          </>
        )}
        {primaryApiUnreachable && (
          <Box
            sx={{
              fontSize: '12px',
              textAlign: 'center',
              mt: '16px',
              p: '16px 18px',
              borderRadius: '8px',
              backgroundColor: 'white',
              border: '1px solid',
              borderColor: 'darkBorderGrey',
              color: 'grey',
              fontWeight: 300,
            }}
          >
            <Text as="span" sx={{ display: 'inline' }}>
              {messages.primaryApiBlockedPart1}
            </Text>
            <Link
              href={`https://${activeUrl}`}
              target="_blank"
              sx={{
                fontSize: 'inherit',
                color: 'blue',
                textDecoration: 'none',
                ':hover': { textDecoration: 'underline' },
              }}
            >
              {activeUrl}
            </Link>
            <Text as="span" sx={{ display: 'inline' }}>
              {messages.primaryApiBlockedPart2}
            </Text>
          </Box>
        )}
      </Flex>
    </Flex>
  )
}

export default MainPage
