/**
 * Created by bogao on 2017/09/13.
 * Refactor by Elivoa, 2019-07-01. - use Hooks.
 */
import React, { useMemo, useState } from 'react';
import { component, renderChildren, withRouter } from 'acore';
import { Layout as LayoutComponent } from 'antd';
import { sysconfig } from 'systems';
import { theme, plugins } from 'themes';
import { Hole, ErrorBoundary } from 'components/core';
import { Modal as AModal } from 'aminer/components/widgets';
import { ImgViewer as AImg } from 'aminer/components/widgets';
import LazyHeader from 'aminer/layouts/header/Header';
import { PageControl } from 'aminer/components/common';
import { Helmet } from 'umi';
import { classnames } from 'utils';

import styles from './index.less';

// const LayoutPlugins = plugins(P.ALL_PLACES); // Accept all plugins.

const { Sider, Content, Footer } = LayoutComponent;

const debug = require('debug')('aminer:engine');

const TheLayout = props => {
  const {
    // switches
    showHeader = sysconfig.Layout_ShowHeader,
    showFooter = theme.Layout_ShowFooter,
    showSidebar = sysconfig.Layout_HasSideBar,
    // showNavigator = getDefaultShowNavi(), // p: LayoutParam > theme > config.
    showFeedback = sysconfig.GLOBAL_ENABLE_FEEDBACK,
    headerFixed,
    fixAdvancedSearch = false, // TODO use localStorage to cache user habits.

    // blocks
    navigator,
    // sider, // sidebar = theme.sidebar,
    sider = theme.sidebar,
    footer = theme.footer,

    // props
    rootClassName,
    contentClass,
    classNames = ['defaultLayoutSkin'],
    skin = theme.skin || 'theme',

    // funcs
    dispatch,
    query,
    onSearch,
    forceShowSearchBox,

    // zones
    logoZone,
    searchZone = theme.searchZone,
    infoZone,
    rightZone,
    covidHeader,
    disableAdvancedSearch,

    // children
    children,

    // * aminer special
    headerSize = 'normal',
    showSearch = theme.Layout_ShowHeaderSearch,
    showNav = theme.Layout_ShowHeaderNav,

    className, // todo nouse.
    pageHeaderFixed,
    showAdvanceFilterIcon,
    autoScale,
    autoScaleWidth = '1200',
  } = props;

  // Header options
  const headerOptions = {
    key: 'header',
    rightZone,
    headerSize,
    className,
    showHeader,
    showSearch,
    showNav,
    query,
    covidHeader,
    pageHeaderFixed,
    showAdvanceFilterIcon,
  };

  // -----  title  ---------------------------------------------------------------

  const { pageTitle, pageSubTitle, pageUniqueTitle, pageDesc, pageKeywords } = props;
  // pageUniqueTitle 0529 目的：格式统一
  const title = useMemo(() => {
    if (pageUniqueTitle) {
      return `${pageUniqueTitle}-${pageSubTitle || sysconfig.PageTitle}`;
    }
    const t = pageTitle
      ? `${pageTitle}-${pageSubTitle || 'AMiner'}`
      : pageSubTitle
        ? `${sysconfig.PageTitle}-${pageSubTitle}`
        : sysconfig.PageTitle;
    return typeof t === 'string' ? t : t(sysconfig.Locale);
  }, [pageTitle, pageSubTitle, pageUniqueTitle]);

  const desc = pageDesc || sysconfig.PageDesc;

  // -----  header  ---------------------------------------------------------------

  const headerBlock = useMemo(
    () =>
      showHeader && (
        <div className={styles.headerPlaceholder}>
          <LazyHeader {...headerOptions} />
        </div>
      ),
    [showHeader, headerOptions],
  );

  // -----  render  ---------------------------------------------------------------
  return (
    <LayoutComponent
      className={classnames('mainlayout', styles.layout, styles[className], rootClassName)}
    >
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <meta name="keywords" content={pageKeywords} />
        {autoScale && (
          <meta
            id="viewport"
            name="viewport"
            content={`width=${autoScaleWidth}`}
            data-react-helmet="true"
          />
        )}
        {!autoScale && (
          <meta
            id="viewport"
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=yes"
          />
        )}
      </Helmet>

      {headerBlock}

      {/* -------- Main Content -------- */}
      <Content
        className={classnames('layout-body', styles.contentWarp, {
          [styles.contentWidth]: sysconfig.SYSTEM !== 'adata',
        })}
      >
        {/* -------- Left Side Bar -------- */}
        {/* {showSidebar && (
          <Sider className="" collapsedWidth={40} collapsed={false} collapsible
            trigger={null}
            breakpoint="xs" width="auto"
          >
            <Hole fill={sider} />
          </Sider>
        )} */}

        <AModal requireLogin visibility />
        <AImg visibility />
        {/*  <BackTop /> */}

        <PageControl />

        {/* -------- Main Content -------- */}

        <Content className={classnames('layout-content', styles.content, contentClass)}>
          {sysconfig.SYSTEM === 'adata' && showSidebar && (
            <Sider
              className="layout-sider"
              collapsedWidth={40}
              collapsed={false}
              collapsible
              trigger={null}
              breakpoint="xs"
              width="auto"
            >
              <Hole fill={sider} />
            </Sider>
          )}
          {renderChildren(children)}
        </Content>
      </Content>

      {/* -------- Footer -------- */}
      {showFooter && <Hole fill={footer} param={{ className }} />}
    </LayoutComponent>
  );
};

const Layout = component()(TheLayout);

// --------------------------
// Empty Layout
// --------------------------

const TheEmptyLayout = props => {
  const { pageTitle, pageSubTitle, pageDesc, pageKeywords, children } = props;

  // -----  title  ---------------------------------------------------------------
  const title = useMemo(() => {
    const t =
      pageTitle ||
      (pageSubTitle ? `${sysconfig.PageTitle} | ${pageSubTitle}` : sysconfig.PageTitle);
    return typeof t === 'string' ? t : t(sysconfig.Locale);
  }, [pageTitle, pageSubTitle]);

  let desc = pageDesc || sysconfig.PageDesc;
  desc = desc.slice(0, 170);

  const keywords = pageKeywords ? `${pageKeywords}` : sysconfig.PageKeywords || '';

  // console.log('desc', desc)
  // console.log('keywords', keywords)

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="keywords" content={keywords} />
        <meta name="description" content={desc} />
      </Helmet>
      <ErrorBoundary>{renderChildren(children)}</ErrorBoundary>
    </>
  );
};

const EmptyLayout = component()(TheEmptyLayout);

export { Layout, EmptyLayout };
