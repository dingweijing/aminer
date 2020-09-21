import React, { useMemo } from 'react';
import { component, connect, Link } from 'acore';
import { classnames } from 'utils';
import pubHelper from 'helper/pub';
import { getLangLabel } from 'helper';
import { Hole } from 'components/core';
import { PaperPackLink } from 'aminer/components/widgets';
import { highlight } from 'utils/hooks';
import { PubInfo, PubListZoneType } from 'aminer/components/pub/pub_type';

import styles from './Title.less';

interface Proptypes {
  // dispatch: (config: { type: string; payload: { params: any } }) => Promise<any>;
  paper: PubInfo;
  index: number;
  titleLeftZone?: PubListZoneType;
  titleRightZone?: PubListZoneType;
  isShowPdfIcon?: boolean;
  highlightWords?: string[];
  titleTarget?: string;
  titleLinkDomain?: string | boolean;
  titleLinkQuery?: object;
  onClickTitle?: (paper: PubInfo) => void;
}

const PublicationTitle = (props: Proptypes) => {
  const {
    paper,
    index,
    titleLeftZone = [],
    titleRightZone = [],
    isShowPdfIcon = true,
    highlightWords = [],
    titleTarget = '_blank',
    titleLinkQuery = {},
    titleLinkDomain,
    onClickTitle,
  } = props;
  // TODO paper.lang?

  const { title, title_zh } = paper;
  const title_label = getLangLabel(title, title_zh);
  const ele = (
    <>
      {titleLeftZone && (
        <Hole
          name="PaperList.titleLeftZone"
          fill={titleLeftZone}
          defaults={[]}
          param={{ paper }}
          config={{ containerClass: 'title-left-zone' }}
        />
      )}
      {paper && paper.pdf && isShowPdfIcon && (
        <i className={classnames('fa', 'fa-file-pdf-o', 'pdf-icon')} />
      )}
      <span className="paper-title">
        <PaperPackLink data={paper}>
          <span
            dangerouslySetInnerHTML={{
              __html: highlight(pubHelper.cleanTitle(title_label), highlightWords),
            }}
          />
        </PaperPackLink>
      </span>
    </>
  );

  const hrefDomain = useMemo(() => {
    let str = titleLinkDomain || '';
    if (typeof titleLinkDomain === 'boolean' && titleLinkDomain) {
      str = 'https://www.aminer.cn';
    }
    return str;
  }, []);

  return (
    <div className={styles.title}>
      <div className="title-line">
        {paper.id && !onClickTitle && (
          <a
            href={`${hrefDomain}${pubHelper.genPubTitle({
              id: paper.id,
              title: paper.title,
              ...titleLinkQuery,
            })}`}
            className="title-link"
            target={titleTarget}
          >
            {ele}
          </a>
        )}
        {/* {pzaper.id && !hrefDomain && !onClickTitle && (
          <Link
            to={pubHelper.genPubTitle({ id: paper.id, title: paper.title })}
            className="title-link"
            target={titleTarget}
          >
            {ele}
          </Link>
        )}
        {paper.id && hrefDomain && !onClickTitle && (
          <a
            href={`${hrefDomain}${pubHelper.genPubTitle({
              id: paper.id,
              title: paper.title,
            })}`}
            className="title-link"
            target={titleTarget}
          >
            {ele}
          </a>
        )}z */}
        {!paper.id && !onClickTitle && <span>{ele}</span>}

        {onClickTitle && <span onClick={onClickTitle.bind(null, paper)}>{ele}</span>}

        <Hole
          name="PaperList.titleRightZone"
          fill={titleRightZone}
          defaults={[]}
          param={{ paper, index }}
          config={{ containerClass: 'title-right-zone' }}
        />
      </div>
    </div>
  );
};

export default component(connect())(PublicationTitle);
