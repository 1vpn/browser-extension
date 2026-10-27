import { Box, Flex, Text } from 'theme-ui'
import Check from 'assets/check.svg'

const PlanCard = ({
  title,
  price,
  features = [],
  button,
  highlighted = false,
}) => {
  return (
    <Flex
      sx={{
        flexDirection: 'column',
        p: '24px',
        borderRadius: '8px',
        border: '1px solid',
        borderColor: highlighted ? 'blue30' : 'borderGrey',
        backgroundColor: highlighted ? 'blue10' : 'white',
      }}
    >
      <Flex
        sx={{
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: '12px',
        }}
      >
        <Text sx={{ fontSize: '20px' }}>{title}</Text>
        <Text
          sx={{
            fontSize: '13px',
            color: 'grey',
            fontWeight: 300,
            textAlign: 'right',
          }}
        >
          {price}
        </Text>
      </Flex>
      {features.length > 0 && (
        <Flex
          sx={{
            flexDirection: 'column',
            gap: '14px',
            mt: '24px',
          }}
        >
          {features.map((feature, index) => (
            <Flex key={index} sx={{ alignItems: 'center', gap: '12px' }}>
              <Box
                as={Check}
                sx={{
                  height: '20px',
                  width: '20px',
                  flexShrink: 0,
                  color: 'blue',
                }}
              />
              <Text sx={{ fontSize: '14px', fontWeight: 300 }}>{feature}</Text>
            </Flex>
          ))}
        </Flex>
      )}
      <Box sx={{ mt: '24px' }}>{button}</Box>
    </Flex>
  )
}

export default PlanCard
