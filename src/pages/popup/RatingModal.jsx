import { useState } from 'react'
import { Box, Flex } from 'theme-ui'
import Star from 'assets/star.svg'
import Modal from './Modal'
import { reviewUrl } from 'utils/constants'

const RatingModal = ({ isOpen, onClose, onRate, messages }) => {
  const [hovered, setHovered] = useState(0)

  const handleStarClick = (rating) => {
    chrome.storage.local.set({ rated: true }).then(() => {
      onRate()
      if (rating === 5) {
        window.open(reviewUrl, '_blank')
      }
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} width="280px">
      <Box
        sx={{
          mb: '14px',
          textAlign: 'center',
          fontSize: '16px',
          fontWeight: 400,
          color: 'black',
        }}
      >
        {messages.rateYourExperience}
      </Box>
      <Box
        sx={{
          mb: '16px',
          textAlign: 'center',
          fontSize: '14px',
          fontWeight: 300,
          color: 'grey',
        }}
      >
        {messages.rateUsMessage}
      </Box>
      <Flex sx={{ gap: '8px', justifyContent: 'center' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Box
            key={star}
            as={Star}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => handleStarClick(star)}
            sx={{
              height: '30px',
              width: '30px',
              cursor: 'pointer',
              color: star <= hovered ? 'yellow' : 'toggleGrey',
              fill: star <= hovered ? 'yellow' : 'toggleGrey',
              transition: 'color 0.1s ease, fill 0.1s ease',
            }}
          />
        ))}
      </Flex>
    </Modal>
  )
}

export default RatingModal
