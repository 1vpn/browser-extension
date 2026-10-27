import { useContext } from 'react'
import { Flex, Text, Button, Link } from 'theme-ui'
import { PageContext } from 'context/PageContext'
import { freeMonthlyPrice, premiumMonthlyPrice } from 'utils/constants'
import PageHeader from './PageHeader'
import PlanCard from './PlanCard'

const withPrice = (message = '', price) =>
  message.replace('{price}', () => price)

const UpgradePage = ({ activeUrl, messages }) => {
  const { setCurrentPage } = useContext(PageContext)

  const markUpgradePageSeen = () => {
    chrome.storage.local.set({
      upgradeButtonClicked: true,
      upgradePageType: null,
    })
  }

  const handleContinueFree = () => {
    markUpgradePageSeen()
    setCurrentPage('main')
  }

  const premiumFeatures = [
    messages.moreServerLocations,
    messages.fasterSpeeds,
    messages.cleanerIpAddresses,
    messages.tenDayMoneyBackGuarantee,
  ]

  return (
    <Flex
      sx={{
        flexDirection: 'column',
        flex: 1,
      }}
    >
      <PageHeader
        left={<Text sx={{ fontSize: '20px' }}>{messages.choosePlan}</Text>}
        sx={{ justifyContent: 'center' }}
      />
      <Flex
        sx={{
          flexDirection: 'column',
          p: '24px',
          gap: '24px',
        }}
      >
        <PlanCard
          highlighted
          title={messages.premium}
          price={withPrice(messages.pricePerMonth, premiumMonthlyPrice)}
          features={premiumFeatures}
          button={
            <Link
              id="upgradeButton"
              href={
                `https://${activeUrl}` +
                `/referral_redirect?from=upgrade_page&url=${encodeURIComponent(
                  `https://${activeUrl}/select_plan/`
                )}`
              }
              target="_blank"
              variant="styles.baseButton"
              onClick={markUpgradePageSeen}
            >
              {messages.getPremium}
            </Link>
          }
        />
        <PlanCard
          title={messages.free}
          price={withPrice(messages.pricePerMonth, freeMonthlyPrice)}
          button={
            <Button
              id="continueFreeButton"
              onClick={handleContinueFree}
              variant="styles.outlineButton"
            >
              {messages.continueFree}
            </Button>
          }
        />
      </Flex>
    </Flex>
  )
}

export default UpgradePage
