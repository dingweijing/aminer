import React, { useCallback } from 'react';
import { component, connect } from 'acore';
import { classnames } from 'utils';
import { FM, formatMessage } from 'locales';
import { Tooltip } from 'antd';
import { Bibtex } from 'aminer/core/pub/widgets';
import { UrlPart, ViewPart } from 'aminer/core/pub/widgets/info/';
import pubHelper from 'helper/pub';
import styles from './PubMiscTagsLine.less';

// * --------------------------------------------
// * Component
// * --------------------------------------------
const PubMiscTagsLine = props => {
  const { className, paper, dispatch, user } = props;

  const onBibtex = useCallback(id => {
    // dispatch({ type: 'aminerSearch/bibtex', payload: { id } })
    //   .then(({ status, data }) => {
    //     console.log('onBibtex', data);
    //     if (status) {
    //       dispatch({
    //         type: 'modal/open',
    //         payload: {
    //           title: formatMessage({ id: 'aminer.paper.bibtex', defaultMessage: 'Bibtex' }),
    //           isLinkLogin: false,
    //           content: <Bibtex bibtex1={data} id={id} />
    //         }
    //       })
    //     }
    //   })
    dispatch({
      type: 'modal/open',
      payload: {
        title: formatMessage({ id: 'aminer.paper.bibtex', defaultMessage: 'Bibtex' }),
        isLinkLogin: false,
        content: <Bibtex id={id} />
      }
    })
  }, [paper]);

  return (
    <div className={classnames(styles.misctags, className)}>
      <span className={classnames(styles.cited, { [styles.zero]: paper.num_citation === 0 })}>
        <FM id="aminer.paper.cited" defaultMessage="Cited by" />
        {/* <Tooltip title={<FM id="aminer.paper.cited" defaultMessage="Cited by" />}>
          <svg className="icon" aria-hidden="true">
            <use xlinkHref={`#icon-baojiaquotation`} />
          </svg>
        </Tooltip> */}
        <FM id='aminer.common.colon' defaultMessage={': '} />
        <strong>{paper.num_citation || 0}</strong>
      </span>
      <span className={styles.split}>|</span>
      <span className={styles.bibtex} onClick={onBibtex.bind(this, paper.id)}>
        <FM id="aminer.paper.bibtex" defaultMessage="Bibtex" />
      </span>
      <span className={styles.split}>|</span>
      {/* <span className={styles.views}>
        <svg className="icon" aria-hidden="true">
          <use xlinkHref="#icon-eye" />
        </svg>
        {paper.num_viewed || 0}
      </span> */}
      <ViewPart paper={paper} />
      <span className={styles.split}>|</span>
      {paper && paper.urls && <UrlPart paper={paper} getPubUrl={pubHelper.getPubUrl} />}
    </div>
  )
}

export default component(connect())(PubMiscTagsLine);
