/* eslint-disable no-param-reassign */
import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import { connect, component, withRouter } from 'acore';
import { classnames } from 'utils';
import helper from 'helper';
import { FM, formatMessage } from 'locales';
import { useResizeEffect } from 'helper/hooks';
import { Layout } from 'aminer/layouts';
import { logtime } from 'utils/log';
import { Menu, IntroPage, FieldPage, PositionPage } from './c';
import styles from './index.less';

// Resources

const scholars2019 = [
  { id: '5b20ca63530c706c541a9f4a', title: 'ai10.menu.ai', alias: 'ai', name: 'AI' },
  { id: '5b20cd06530c706c541aa2b1', title: 'ai10.menu.theory', alias: 'theory', name: 'theory' },
  { id: '5b20cf71530c706c541aa64f', title: 'ai10.menu.economics', alias: 'economics', name: 'economics' },
  { id: '5b20d071530c706c541aa80d', title: 'ai10.menu.security', alias: 'security', name: 'security' },
  { id: '5b20d2de530c706c541aac5f', title: 'ai10.menu.hci', alias: 'hci', name: 'HCI' },
  { id: '5b20d4d6530c706c541aaf87', title: 'ai10.menu.visualization', alias: 'visualization', name: 'visualization' },
  { id: '5b20d69a530c706c541ab319', title: 'ai10.menu.ir', alias: 'ir', name: 'IR' },
  { id: '5b20d85d530c706c541ab648', title: 'ai10.menu.ml', alias: 'ml', name: 'machine learning' },
  { id: '5b20da2d530c706c541ab9ab', title: 'ai10.menu.datamining', alias: 'datamining', name: 'data mining' },
  { id: '5b20de1c530c706c541ac11e', title: 'ai10.menu.ke', alias: 'ke', name: 'knowledge engineer' },
  { id: '5b20e0ce530c706c541ac622', title: 'ai10.menu.cv', alias: 'cv', name: 'computer vision' },
  { id: '5b20e321530c706c541ac9c6', title: 'ai10.menu.graphics', alias: 'graphics', name: 'computer graphics' },
  { id: '5b20e5c0530c706c541acdc5', title: 'ai10.menu.nlp', alias: 'nlp', name: 'NLP' },
  { id: '5b20e7bf530c706c541ad07d', title: 'ai10.menu.sr', alias: 'sr', name: 'speech recognition' },
  { id: '5b20e93b530c706c541ad302', title: 'ai10.menu.robot', alias: 'robot', name: 'robot' },
  { id: '5b20eab5530c706c541ad4ff', title: 'ai10.menu.database', alias: 'database', name: 'database' },
  { id: '5b20ec61530c706c541ad77f', title: 'ai10.menu.multimedia', alias: 'multimedia', name: 'multimedia' },
  { id: '5b20edd6530c706c541ad934', title: 'ai10.menu.system', alias: 'system', name: 'system' },
  { id: '5b20ef71530c706c541adb5c', title: 'ai10.menu.recommendation', alias: 'recommendation', name: 'recommendation' },
  { id: '5b20f130530c706c541add84', title: 'ai10.menu.iot', alias: 'iot', name: 'internet of things' },
  { id: '5b20f311530c706c541adf98', title: 'ai10.menu.vr', alias: 'vr', name: 'virtual reality' }
];

const menuData = [
  { tag_id: 'awards_by_fields', id: 'ai10.home.awards.title' },
  { tag_id: 'institutes_of_winners', id: 'ai10.home.institutes.title', },
  { tag_id: 'winners_in_multiple_fields', id: 'ai10.home.multiple.title' },
  { tag_id: 'four_appearances', id: 'ai10.home.multiple.four' },
  { tag_id: 'three_appearances', id: 'ai10.home.multiple.three' },
  { tag_id: 'two_appearances', id: 'ai10.home.multiple.two' },
  { tag_id: 'gender_of_winners', id: 'ai10.home.gender.title' },
  { tag_id: 'media_coverage', id: 'ai10.home.coverage.title' },
];

// Methods

const findIDItem = type => scholars2019.find(scholar => scholar.alias === type || scholar.id === type);

// Components

const AI10Page = props => {
  const { match, location, currentID, ai10_data } = props;
  const { params: { type, position } } = match;
  const { hash = '#awards_by_fields' } = location;

  const awardID = useMemo(() => findIDItem(type), [type]);
  const menuRef = useRef();

  useEffect(() => {
    const { dispatch } = props;
    // console.log('type && awardID', type, awardID, currentID)
    if (!type && !ai10_data) {
      dispatch({ type: 'aminerAI10/getAwardRoster', });
    }
    if (type && awardID && awardID.id !== currentID) {
      dispatch({ type: 'aminerAI10/getAwardRosterTop100', payload: { typeid: awardID.id } });
    }
  }, [type]);

  useResizeEffect(menuRef);

  const pageTitle = useMemo(
    () => (type
      ? `${formatMessage({ id: awardID && awardID.title })} Top100`
      : formatMessage({ id: 'ai10.home.title' }
      )),
    [type]
  );

  const showMenu = useCallback(() => {
    if (!menuRef.current) {
      return;
    }
    if (menuRef.current.style.display === 'block') {
      menuRef.current.style.display = 'none';
    } else {
      menuRef.current.style.display = 'block';
    }
  }, []);


  // -- actions

  const scrollToAnchor = anchorName => {
    if (anchorName) {
      // 找到锚点
      const anchorElement = document.getElementById(anchorName);
      const menuElement = document.getElementById(`to_${anchorName}`);
      const menuContainer = menuElement.parentElement;

      Array.from(menuContainer.children).forEach(item => {
        item.classList.remove('active');
      });

      menuElement.classList.add('active');
      // 如果对应id的锚点存在，就跳转到锚点
      if (anchorElement) {
        anchorElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    }
  }

  // * jump
  if (type && !awardID) {
    helper.routeTo(props, null, { type: '' }, {
      transferPath: [
        { from: '/ai10/:type', to: '/ai10' },
      ],
    });
    return <></>
  }

  return (
    <Layout pageTitle={pageTitle}>
      <article className={styles.wrapper}>
        <section className={styles.article}>
          <div className="scholar_menu" ref={menuRef}>
            <Menu scholars2019={scholars2019} defaultType={awardID && awardID.alias} menuRef={menuRef} />
          </div>
          <section className="scholar_content">

            {!type && (
              <>
                <IntroPage showMenu={showMenu} ai10_data={ai10_data} />
                <div className="menu_fix">
                  <div className="menu_center">
                    <div className="home_menu" id="home_menu">
                      {menuData.map((item, index) => (
                        <a key={item.id} id={`to_${item.tag_id}`}
                          className={classnames({ active: index === 0 })}
                          // href={`#${item.tag_id}`}
                          onClick={() => { scrollToAnchor(`${item.tag_id}`) }}
                        >
                          <FM id={item.id} />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
            {type && !position && (
              <FieldPage
                persons={props.scholarList}
                typeid={awardID.id}
                showMenu={showMenu}
                field={awardID.title}
                alias={awardID.alias}
              />
            )}
            {type && position && (
              <PositionPage
                typeid={awardID.id}
                showMenu={showMenu}
              />
            )}
          </section>
        </section>
      </article>
    </Layout>
  );
};

// SSR时，服务端初次加载页面数据用这个方法。
// 这个例子数据存在model中，model数据会序列化在页面中，在客户端加载时还原到model中。
// 此组件在useEffect中通过判断model中是否有值来再次获取数据。
AI10Page.getInitialProps = async ({ store, isServer, match }) => {
  if (!isServer) { return; }

  logtime('getInitialProps::AI10Page init')

  const { type } = match.params || {};

  // const { params: { type, position } } = match;
  const awardID = findIDItem(type);
  if (!type) {
    await store.dispatch({
      type: 'aminerAI10/getAwardRoster',
    });
  } else if (awardID && awardID.id) {
    await store.dispatch({
      type: 'aminerAI10/getAwardRosterTop100',
      payload: { typeid: awardID && awardID.id }
    });
  }

  logtime('getInitialProps::AI10Page Done')

  const { aminerAI10 } = store.getState();
  return { aminerAI10 };

  // 也可以直接使用下面方式返回。

  // return Promise.resolve({
  //   data: {
  //     ssr: 'http://127.0.0.1:7001',
  //     csr: 'http://127.0.0.1:8000',
  //   },
  // });
};

export default component(withRouter, connect(({ aminerAI10 }) => ({
  ai10_data: aminerAI10.ai10_data,
  scholarList: aminerAI10.scholarList,
  currentID: aminerAI10.currentID, // TODO @xiaoxuan 这是什么？缓存么？为什么用searchmodel来缓存？这东西应该是独立的，不应该和任何其他东西混在一起。我已经提取出独立model
})))(AI10Page);
