import { useContext } from 'react'
import { Flex, Text, Button, Link } from 'theme-ui'
import { PageContext } from 'context/PageContext'
import { freeMonthlyPrice, premiumMonthlyPrice } from 'utils/constants'
import PageHeader from './PageHeader'
import PlanCard from './PlanCard'
import PaymentMethods from './PaymentMethods'

const withPrice = (message = '', price) =>
  message.replace('{price}', () => price)

const UpgradePage = ({ activeUrl, messages }) => {
  const { setCurrentPage } = useContext(PageContext)

  const markOptionPicked = () => {
    chrome.storage.local.set({ upgradeOptionPickedAt: Date.now() })
  }

  const handleContinueFree = () => {
    markOptionPicked()
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
        left={
          <Text sx={{ fontSize: '24px', lineHeight: '28px', pt: '3px' }}>
            {messages.choosePlan}
          </Text>
        }
        sx={{ justifyContent: 'center', height: '68px' }}
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
          footer={<PaymentMethods messages={messages} />}
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
              onClick={markOptionPicked}
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
