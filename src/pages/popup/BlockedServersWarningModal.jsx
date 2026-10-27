import { useState, useEffect } from 'react'
import { Box, Button } from 'theme-ui'
import Modal from './Modal'

const RESTRICTED_LANG_PREFIXES = ['ru', 'zh', 'fa']

const isRestrictedLanguage = () => {
  const lang = chrome.i18n.getUILanguage()
  return RESTRICTED_LANG_PREFIXES.some((prefix) => lang.startsWith(prefix))
}

const BlockedServersWarningModal = ({ isConnected, messages }) => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!isConnected || !isRestrictedLanguage()) return
    chrome.storage.local.get(['shownBlockedServersWarningModal'], (storage) => {
      if (!storage.shownBlockedServersWarningModal) {
        setIsOpen(true)
      }
    })
  }, [isConnected])

  const handleDismiss = () => {
    chrome.storage.local.set({ shownBlockedServersWarningModal: true })
    setIsOpen(false)
  }

  return (
    <Modal isOpen={isOpen} onClose={handleDismiss} width="280px">
      <Box
        sx={{
          mb: '20px',
          textAlign: 'center',
          fontSize: '14px',
          fontWeight: 400,
          color: 'black',
          lineHeight: 1.5,
        }}
      >
        {messages.blockedServersModalTitle}
      </Box>
      <Button
        onClick={handleDismiss}
        variant="styles.baseButton"
        sx={{ height: '40px' }}
      >
        {messages.blockedServersModalButton}
      </Button>
    </Modal>
  )
}

export default BlockedServersWarningModal
