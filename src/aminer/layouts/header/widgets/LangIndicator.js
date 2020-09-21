import React, { useState } from 'react';
import { connect, component } from 'acore';
import { sysconfig } from 'systems'
import { formatMessage, isLocaleValid, saveLocale, getCurrentLocal } from 'locales';
import { classnames } from 'utils';
import { Tooltip } from 'antd';
import { useSSRTwoPassRender } from 'helper/hooks';

import styles from './LangIndicator.less';

const langIconTable = {
  home: { 'en-US': '#icon-en2', 'zh-CN': '#icon-cn2' },
  homeX: { 'en-US': '#icon-en', 'zh-CN': '#icon-cn' },
}

// const iconCfg = useMemo(() => ({
//   home: { 'en-US': '#icon-en2', 'zh-CN': '#icon-cn2' },
//   homeX: { 'en-US': '#icon-en', 'zh-CN': '#icon-cn' },
// }), [])

// const LanguageBlock = useMemo(() => {
//   const iconcfg = className === 'home' ? iconCfg.home : iconCfg.homeX;
//   return (
//     <li>
//       {sysconfig.EnableLocalLocale && (
//         <a className={classnames(styles.simpleLanguage, { [styles.hover]: visible })}>
//           <Tooltip placement="bottom"
//             title={formatMessage({ id: 'aminer.header.language.change', defaultMessage: '点击按钮切换到中文' })}
//             overlayClassName={className === 'home' ? 'change_language_tip_home' : 'change_language_tip'}
//             overlayStyle={{ boxShadow: 'none' }}
//           >
//             <svg className="icon" aria-hidden="true" onClick={onChangeLocale}>
//               <use xlinkHref={iconcfg[sysconfig.Locale]} />
//             </svg>
//           </Tooltip>
//         </a>
//       )}
//     </li>
//   )
// }, [visible, sysconfig.Locale])

const LangIndicator = props => {
  const [why, setWhy] = useState(false);
  const { className, visible, onClick = () => { } } = props;

  const onChangeLocale = () => {
    const { langCookie, langLocalStorage } = getCurrentLocal() || {}
    if (langCookie !== langLocalStorage) {
      window && window.localStorage && window.localStorage.setItem('umi_locale', langCookie)
    }
    const key = sysconfig.Locale === 'zh-CN' ? 'en-US' : 'zh-CN'
    sysconfig.Locale = key;
    saveLocale(sysconfig.SYSTEM, key);
    setWhy(!why)
  };

  const getLangIcon = () => {
    if (isLocaleValid(sysconfig.Locale)) {
      return langIconTable[className === 'home' ? 'home' : 'homeX'][sysconfig.Locale]
    }
    return '#icon-en';
  }

  return useSSRTwoPassRender({
    render: ({ hasTest, testPassed: isLoggedin }) => (
      <li className={styles.langindector} onClick={onClick}>
        {sysconfig.EnableLocalLocale && (
          <a className={classnames('simpleLanguage', { hover: visible })}>
            <Tooltip placement="bottom"
              title={formatMessage({ id: 'aminer.header.language.change', defaultMessage: '点击按钮切换到中文' })}
              overlayClassName={className === 'home' ? 'change_language_tip_home' : 'change_language_tip'}
              overlayStyle={{ boxShadow: 'none' }}
            >
              <svg className="icon" aria-hidden="true" onClick={onChangeLocale}>
                <use xlinkHref={getLangIcon()} />
              </svg>
            </Tooltip>
          </a>
        )}
      </li>
    ),
    // failedRender: () => (
    //   <li>   </li>
    // ),
    // defaultRender: () => (<div>empty</div>), // SSR渲染，客户端第一次渲染，或者condition为false时走这个。
    test: montor => montor[1] && montor[2],
  }, [visible, sysconfig.Locale, sysconfig.EnableLocalLocale])
}

export default component()(LangIndicator);
