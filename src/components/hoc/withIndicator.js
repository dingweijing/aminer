// 切换中英文
import React, { useState } from 'react'
import { saveLocale } from 'locales';
import { sysconfig, } from 'systems'

const withIndicator = WrappedComponent => props => {
  const defaultLang = sysconfig.Locale
  const [lang, setLang] = useState(defaultLang)
  const onToggleLang = currentLang => {
    const nextLang = lang === 'zh-CN' ? 'en-US' : 'zh-CN'

    if (currentLang) {
      if (lang !== currentLang) {
        setLang(nextLang)
        saveLocale(sysconfig.SYSTEM, nextLang)
      }

      return;
    }
    setLang(nextLang)
    saveLocale(sysconfig.SYSTEM, nextLang)
  }
  return (<WrappedComponent
    lang={lang}
    onToggleLang={onToggleLang}
    {...props}
  />)
}

export default withIndicator
