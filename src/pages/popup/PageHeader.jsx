import { Box, Flex, Button } from 'theme-ui'

const PageHeader = ({ left, rightIcon, onRightClick, sx }) => {
  return (
    <Flex
      sx={{
        justifyContent: 'space-between',
        alignItems: 'center',
        px: '22px',
        height: '60px',
        borderBottom: '1px solid',
        borderColor: 'borderGrey',
        ...sx,
      }}
    >
      {left && <Box>{left}</Box>}
      {rightIcon && (
        <Button
          onClick={onRightClick}
          sx={{
            all: 'unset',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '36px',
            width: '36px',
            borderRadius: '6px',
            transition: 'background-color 0.2s ease-in-out',
            ':hover': {
              backgroundColor: 'borderGrey50',
            },
          }}
        >
          <Box
            as={rightIcon}
            sx={{
              height: '24px',
              width: '24px',
            }}
          />
        </Button>
      )}
    </Flex>
  )
}

export default PageHeader
