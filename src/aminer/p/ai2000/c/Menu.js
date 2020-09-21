import React, { useState, useMemo, useEffect } from 'react';
import { classnames } from 'utils';
import { withRouter, connect, component } from 'acore';
import helper from 'helper';
import { sysconfig } from 'systems';
import { FM, formatMessage } from 'locales';
import { Checkbox } from 'antd';
import { SideMenu } from 'aminer/components/widgets';
import styles from './Menu.less';

const getDeafultTypeInfo = (value, key, list) => {
  let index;
  for (let i = 0; i < list.length; i += 1) {
    if (list[i][key] === value) {
      index = i;
    }
  }
  if (index || index === 0) {
    return list[index];
  }
  return null;
};

const Menu = props => {
  const { dispatch, domainList, defaultType, menuRef, year, isRecent, specialTypes } = props;
  const { isMultiDomain } = props;
  const { selectDomains, setSelectDomains } = props;

  const nameLang = sysconfig.Locale === 'en-US' ? 'name' : 'name_zh';

  const onSelect = key => {
    const { clientWidth } = document.body;

    if (clientWidth <= 768) {
      menuRef.current.style.display = 'none';
    }

    if (key === defaultType) {
      if (key === 'multi-domains') {
        helper.routeTo(
          props,
          null,
          { type: key },
          {
            transferPath: [
              { from: '/ai/:type', to: '/ai' },
              { from: '/ai/year/:year/:type', to: '/ai/year/:year' },

              { from: '/ai2000/:type', to: '/ai2000' },
              { from: '/ai2000/year/:year/:type', to: '/ai2000/year/:year' },
            ],
          },
        );
      }
      return;
    }

    if (key && !defaultType) {
      helper.routeTo(
        props,
        null,
        { type: key },
        {
          transferPath: [
            { from: '/ai2000/year/:year', to: '/ai2000/year/:year/:type' },
            { from: '/ai2000', to: '/ai2000/:type' },

            { from: '/ai/year/:year', to: '/ai/year/:year/:type' },
            { from: '/ai', to: '/ai/:type' },
          ],
        },
      );
    } else if (key && defaultType) {
      helper.routeTo(
        props,
        null,
        { type: key },
        {
          removeParams: ['name', 'pid'],
          transferPath: [
            // { from: '/ai2000/year/:year/:type/:position', to: '/ai2000/year/:year/:type' },
            // { from: '/ai/year/:year/:type/:position', to: '/ai/year/:year/:type' },
            // { from: '/ai2000/:type/:position', to: '/ai2000/:type' },
          ],
        },
      );
    } else {
      helper.routeTo(
        props,
        null,
        { type: key },
        {
          removeParams: ['name', 'pid'],
          transferPath: [
            { from: '/ai/:type', to: '/ai' },
            { from: '/ai/year/:year/:type', to: '/ai/year/:year' },

            { from: '/ai2000/:type', to: '/ai2000' },
            { from: '/ai2000/year/:year/:type', to: '/ai2000/year/:year' },
          ],
        },
      );
    }
  };

  const defaultTypeInfo = useMemo(() => {
    return getDeafultTypeInfo(defaultType, 'alias', domainList);
  }, [defaultType]);

  const siderList = useMemo(
    () =>
      domainList.map(item => ({
        title: `${item[nameLang]}`,
        // sub: item.total,
        key: item.alias,
        id: item.id,
      })),
    [domainList, nameLang],
  );

  const onChange = key => {
    // e.stopPropagation();
    const { id } = getDeafultTypeInfo(key, 'alias', domainList) || {};
    if (!id) {
      return;
    }
    const temp = [...selectDomains];
    const index = temp.indexOf(id);
    if (index === -1) {
      temp.push(id);
    } else {
      temp.splice(index, 1);
    }
    // if (temp.length === 0) {
    //   // setIsMultiDomain(false);
    // } else {
    // }
    setSelectDomains(temp);
    // console.log('e', key, getDeafultTypeInfo(key, 'alias', domainList));
  };

  const selectMulti = () => {
    // if(key === '')
    // setIsMultiDomain(!isMultiDomain);
    // if (defaultTypeInfo && defaultTypeInfo.id) {
    //   setSelectDomains([defaultTypeInfo.id]);
    // }
  };

  const menuLeftZone = isMultiDomain
    ? [
        ({ values }) => {
          const { id } = values || {};
          return <Checkbox checked={selectDomains.includes(id)} key={11} />;
        },
      ]
    : [];

  return (
    <div>
      <h3
        className={classnames(styles.positionTitle, {
          [styles.active]: defaultType === 'qa',
        })}
        onClick={() => {
          onSelect('qa');
        }}
      >
        <span>Q & A</span>
      </h3>
      <h3
        className={classnames(styles.positionTitle, {
          [styles.active]: defaultType === 'position',
        })}
        onClick={() => {
          onSelect('position');
        }}
      >
        {/* <span>Check your position</span> */}
        <FM id="ai2000.position.check" defaultMessage="Check your position" />
      </h3>

      <h3
        className={classnames(styles.positionTitle, {
          [styles.active]: defaultType === 'multi-domains',
        })}
        // onClick={selectMulti}
        onClick={() => {
          onSelect('multi-domains');
        }}
      >
        {defaultType !== 'multi-domains' && (
          <FM id="ai2000.domains.multi" defaultMessage="Multi domains" />
        )}
        {defaultType === 'multi-domains' && (
          <FM id="ai2000.domains.multi.cancel" defaultMessage="Cancel multi domains" />
        )}
      </h3>
      <SideMenu
        leftZone={menuLeftZone}
        className="ai10"
        list={siderList}
        onChangeSide={isMultiDomain ? onChange : onSelect}
        selected={defaultType}
        showSelectClass={!isMultiDomain}
      />
    </div>
  );
};

export default component(withRouter, connect())(Menu);
