import { useState, useEffect, useMemo } from 'react'
import { applyDocumentDirection } from 'utils/direction'

const useLocalization = (messageKeysProp) => {
  const [localizedText, setLocalizedText] = useState({})

  const messageKeys = useMemo(() => messageKeysProp, [messageKeysProp])

  useEffect(() => {
    applyDocumentDirection()

    const loadMessages = () => {
      const messages = messageKeys.reduce((acc, key) => {
        acc[key] = chrome.i18n.getMessage(key)
        return acc
      }, {})
      setLocalizedText(messages)
    }

    loadMessages()
  }, [messageKeys])

  return localizedText
}

export default useLocalization
