import { Box, Flex } from 'theme-ui'
import CreditCard from 'assets/payments/creditCard.svg'
import Paypal from 'assets/payments/paypal.svg'
import Bitcoin from 'assets/payments/bitcoin.svg'
import Alipay from 'assets/payments/alipay.svg'
import Sbp from 'assets/payments/sbp.svg'
import Mir from 'assets/payments/mir.svg'
import SberPay from 'assets/payments/sberPay.svg'

const PaymentMethods = ({ messages }) => {
  const paymentMethods = [
    { name: messages.creditCard, icon: CreditCard },
    { name: 'PayPal', icon: Paypal },
    { name: messages.cryptocurrency, icon: Bitcoin },
    { name: 'Alipay', icon: Alipay },
    { name: 'SBP', icon: Sbp },
    { name: 'MIR', icon: Mir },
    { name: 'SberPay', icon: SberPay },
  ]

  return (
    <Flex
      id="paymentMethods"
      sx={{ justifyContent: 'center', alignItems: 'center', gap: '14px' }}
    >
      {paymentMethods.map((method, index) => (
        <Box
          key={index}
          title={method.name}
          sx={{ display: 'flex', height: '18px', width: '18px' }}
        >
          <Box as={method.icon} sx={{ height: '100%', width: '100%' }} />
        </Box>
      ))}
    </Flex>
  )
}

export default PaymentMethods
