const RTL_LANGUAGE_PREFIXES = ['ar', 'fa']

export const isRtlLanguage = (language = '') =>
  RTL_LANGUAGE_PREFIXES.some((prefix) => language.startsWith(prefix))

// Point the document at the browser UI language, which chrome.i18n uses.
export const applyDocumentDirection = () => {
  const language = chrome.i18n.getUILanguage() || 'en'
  document.documentElement.lang = language
  document.documentElement.dir = isRtlLanguage(language) ? 'rtl' : 'ltr'
}

// Spread into sx for icons that point in the reading direction.
export const mirrorInRtl = {
  '[dir="rtl"] &': { transform: 'scaleX(-1)' },
}
