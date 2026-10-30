import { useState, useEffect } from 'react'
import { Box, Button } from 'theme-ui'
import Modal from './Modal'
import { connect, syncProxyControl } from 'utils/manageProxy'

// Enabled extensions (other than us) that can set proxy settings and that the
// user is allowed to disable (policy-installed ones report mayDisable: false).
const getConflictingExtensions = () =>
  new Promise((resolve) => {
    chrome.management.getAll((all) => {
      resolve(
        all.filter(
          (ext) =>
            ext.type === 'extension' &&
            ext.enabled &&
            ext.mayDisable !== false &&
            ext.id !== chrome.runtime.id &&
            ext.permissions &&
            ext.permissions.includes('proxy')
        )
      )
    })
  })

const ProxyConflictModal = ({ isOpen, onClose, messages }) => {
  const [extensions, setExtensions] = useState([])
  const [isDisabling, setIsDisabling] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    getConflictingExtensions().then(setExtensions)
  }, [isOpen])

  const handleDisable = async () => {
    setIsDisabling(true)
    await Promise.allSettled(
      extensions.map((ext) => chrome.management.setEnabled(ext.id, false))
    )
    await syncProxyControl()
    setIsDisabling(false)
    onClose()
    connect()
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
        {messages.proxyConflictTitle}
      </Box>
      <Box
        sx={{
          mb: '20px',
          textAlign: 'center',
          fontSize: '14px',
          fontWeight: 300,
          color: 'grey',
          lineHeight: 1.5,
        }}
      >
        {messages.proxyControlledByOtherExtension}
      </Box>
      <Button
        id="disableOtherExtensionsButton"
        onClick={handleDisable}
        disabled={isDisabling || extensions.length === 0}
        variant="styles.baseButton"
        sx={{ height: '40px' }}
      >
        {extensions.length > 1
          ? messages.disableOtherExtensionsButton
          : messages.disableOtherExtensionButton}
      </Button>
    </Modal>
  )
}

export default ProxyConflictModal
