import React, { createContext, useState, useEffect } from 'react'
import { ONE_HOUR } from 'utils/constants'

export const PageContext = createContext()

export const PageProvider = ({ children }) => {
  const [pages, setPages] = useState([])

  useEffect(() => {
    chrome.storage.local.get(
      ['isPremium', 'upgradeOptionPickedAt'],
      (storage) => {
        let initialPage = 'main'

        if (!storage.isPremium) {
          // Show the upgrade page on every open until the user picks an
          // option, then leave it hidden for an hour before showing it again.
          const upgradeOptionPickedAt = storage.upgradeOptionPickedAt || 0

          if (Date.now() - upgradeOptionPickedAt >= ONE_HOUR) {
            initialPage = 'upgrade'
          }
        }

        setPages([initialPage])
      }
    )
  }, [])

  const currentPage = pages[0]

  const setCurrentPage = (page) => {
    setPages((prevPages) => [page, ...prevPages].slice(0, 3))
  }

  const goBackPage = () => {
    const previousPage = pages[1]

    if (previousPage) {
      setPages(pages.slice(1))
    }
  }

  return (
    <PageContext.Provider value={{ currentPage, setCurrentPage, goBackPage }}>
      {children}
    </PageContext.Provider>
  )
}
