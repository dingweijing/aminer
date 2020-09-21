import React, { useState, useEffect, useMemo } from 'react';
import { component, connect, withRouter } from 'acore';
import { classnames } from 'utils';
import { FM } from 'locales';
import { parseUrlParam } from 'helper';
import consts from 'consts';
import { Tooltip } from 'antd';
import { Loading } from 'components/ui';
import PropTypes from 'prop-types';
import { MustReadReason } from 'aminer/core/pub/widgets/info';
import { PaperInsight } from './index';
import { PaperKeywords, PaperAbstract } from 'aminer/core/pub/c';
import styles from './PaperAnalysis.less';

const PaperAnalysis = props => {
  const { id, dispatch, size, loading, fundloading } = props;
  const [pdfInfo, setPdfInfo] = useState(props.pdfInfo);
  const [sciteInfo, setSciteInfo] = useState({});
  const [fundingInfo, setFundingInfo] = useState({});
  
  useEffect(() => {
    if (id) {
      dispatch({
        type: 'pub/getPDFInfoByPIDs',
        payload: { ids: [id] }
      }).then((data) => {
        setPdfInfo(data);
      })
    }
  }, [id])


  const { anchor } = parseUrlParam(props, {}, ['anchor']);
  useEffect(() => {
    anchor && scrollToAnchor(anchor);
  }, [anchor]);

  const scrollToAnchor = anchorName => {
    if (anchorName) {
      const anchorElement = document.getElementById(anchorName);
      if (anchorElement) {
        anchorElement.scrollIntoView({
          behavior: 'instant',
        });
      }
    }
  };

  useEffect(() => {
    if (props.pdfInfo && !id) {
      setPdfInfo(props.pdfInfo);
    }
  }, [props.pdfInfo])

  const { structured_summary = {}, reference_links, participants, headline, summary, keywords, sections = {}, top_statements, metadata, findings } = pdfInfo || {};
  const { Introduction, Methods, Results, Conclusion } = structured_summary;
  const { work } = sections;
  let funding = sections && sections.funding || findings;
  const { table_captions, tables_url, abstract } = metadata || {};
  const smallBlock = useMemo(() => {
    if (size === 'small') {
      return (
        <>
          {abstract && <PaperAbstract abstract={abstract} />}
          {headline && <PaperInsight text={headline} />}
          {keywords && keywords.length > 0 && (
            <>
              <div id="keywords" className={classnames(styles.title, styles.keyTitle)}>
                <FM id="aminer.search.placeholder.keywords" defaultMessage="Keywords" />
              </div>
              <PaperKeywords showHead={false} list={keywords} />
            </>
          )}
        </>
      )
    }
    return null;
  }, [pdfInfo])

  const getScholarScite = (query, sid) => {
    sciteInfo.loadId = sid;
    setSciteInfo({ ...sciteInfo })
    dispatch({
      type: 'pub/getScholarScite',
      payload: { query }
    }).then((info) => {
      sciteInfo[sid] = info;
      sciteInfo.loadId = sid;
      setSciteInfo({ ...sciteInfo })
    })
  }

  const getScholarFunding = (query, sid) => {
    fundingInfo.loadId = sid;
    setFundingInfo({ ...fundingInfo })
    dispatch({
      type: 'pub/getScholarFunding',
      payload: { query }
    }).then((info) => {
      fundingInfo[sid] = info || [];
      fundingInfo.loadId = sid;
      setFundingInfo({ ...fundingInfo })
    })
  }

  const listClass = classnames('list', { 'noDotList': size === 'small' });

  if (!pdfInfo || (!pdfInfo.id || !pdfInfo.headline)) {
    return (
      <div className={styles.paperAnalysis}>
        <p className={styles.noResultTip}>
          <FM id='aminer.conf.nodata' />
        </p>
      </div>
    )
  }


  return (
    <div className={styles.paperAnalysis}>
      {smallBlock}
      {Introduction && Introduction.length > 0 && (
        <>
          <div id="introduction" className={styles.title}><FM id="aminer.paper.mrt.introduction" defaultMessage="Introduction" /></div>
          <ul className={listClass}>
            {Introduction.map((n, m) => <li key={m} dangerouslySetInnerHTML={{ __html: n && n.replace(/href/g, 'key') }} />)}
          </ul>
        </>
      )}
      {top_statements && top_statements.length > 0 && (
        <>
          <div id="highlights" className={styles.title}>
            <FM id="aminer.paper.highlights" defaultMessage="Highlights" />
          </div>
          <ul className={listClass}>
            {top_statements.map((n, m) => <li key={m} dangerouslySetInnerHTML={{ __html: n && n.replace(/href/g, 'key') }} />)}
          </ul>
        </>
      )}
      {Methods && Methods.length > 0 && (
        <>
          <div id="methods" className={styles.title}><FM id="aminer.paper.analysis.methods" defaultMessage="Methods" /></div>
          <ul className={listClass}>
            {Methods.map((n, m) => <li key={m} dangerouslySetInnerHTML={{ __html: n && n.replace(/href/g, 'key') }} />)}
          </ul>
        </>
      )}
      {Results && Results.length > 0 && (
        <>
          <div id="results" className={styles.title}><FM id="aminer.search.results" defaultMessage="Results" /></div>
          <ul className={listClass}>
            {Results.map((n, m) => <li key={m} dangerouslySetInnerHTML={{ __html: n && n.replace(/href/g, 'key') }} />)}
          </ul>
        </>
      )}
      {Conclusion && Conclusion.length > 0 && (
        <>
          <div id="conclusion" className={styles.title}><FM id="aminer.paper.analysis.conclusion" defaultMessage="Conclusion" /></div>
          <ul className={listClass}>
            {Conclusion.map((n, m) => <li key={m} dangerouslySetInnerHTML={{ __html: n && n.replace(/href/g, 'key') }} />)}
          </ul>
        </>
      )}

      {summary && summary.length > 0 && (
        <>
          <div id="summary" className={styles.title}><FM id="aminer.paper.summary" defaultMessage="Summary" /></div>
          <ul className={listClass}>
            {summary.map((n, m) => <li key={m} dangerouslySetInnerHTML={{ __html: n && n.replace(/href/g, 'key') }} />)}
          </ul>
        </>
      )}

      {table_captions && table_captions.length > 0 && (
        <>
          <div id="table_captions" className={styles.title}>
            <FM id="aminer.paper.analysis.table" defaultMessage='Tables' />
          </div>
          <ul className={listClass}>
            {table_captions.map((n, m) => <li key={m}>Table{m + 1}: {n.caption}</li>)}
          </ul>
          {tables_url && <a target="_blank" href={tables_url} className={listClass}
            title="Download tables as Excel">Download tables as Excel</a>}
        </>
      )}

      {/* {structured_content && structured_content.length > 0 && (
        <>
          <div id="structured_content" className={styles.title}>
            <FM id='aminer.paper.analysis.maintext' defaultMessage='Main text' />
          </div>
          <div className={listClass}>
            {structured_content.map((n, m) => {
              return (
                <div key={m}>
                  <h2>{n.heading}</h2>
                  {n.content && (
                    <ul>{
                      n.content.map((text) => {
                        return <li dangerouslySetInnerHTML={{ __html: text && text.replace(/href/g, 'key') }} />
                      })}</ul>
                  )}<ul></ul>
                </div>
              )
            })}
          </div>
        </>
      )} */}
      {work && work.length > 0 && (
        <>
          <div id="work" className={styles.title}>
            <FM id='aminer.paper.analysis.Relatedwork' defaultMessage='Related work' />
          </div>
          <ul className={listClass}>
            {work.map((n, m) => <li key={m} dangerouslySetInnerHTML={{ __html: n && n.replace(/href/g, 'key') }} />)}
          </ul>
        </>
      )}

      {funding && funding.length > 0 && (
        <>
          <div id="funding" className={styles.title}>
            <FM id="aminer.paper.funding" defaultMessage="Funding" />
          </div>
          <ul className={listClass}>
            {funding.map((n, m) => <li key={m} dangerouslySetInnerHTML={{ __html: n && n.replace(/href/g, 'key') }} />)}
          </ul>
        </>
      )}

      {participants && participants.length > 0 && (
        <>
          <div id="participants" className={styles.title}>
            <FM id="aminer.paper.object" defaultMessage="Study subjects and analysis" />
          </div>
          <div className={listClass}>
            {participants.map(({ participant, number, context }, m) => {
              return (
                <div key={m}>
                  <div>{participant}: {number}</div>
                  <div dangerouslySetInnerHTML={{ __html: context && context.replace(/href/g, 'key') }} />
                  <br />
                </div>
              )
            })}
          </div>
        </>
      )}

      {reference_links && reference_links.length > 0 && (
        <>
          <div id="reference" className={styles.title}>
            <FM id="aminer.paper.Reference" defaultMessage="Reference" />
          </div>
          <ul className={classnames(listClass, { 'specList': size === 'small' })}>
            {reference_links.map(({ entry, scholar_url, oa_query, scite, id }, m) => {
              let newText = entry && entry.replace(`[${m + 1}]`, '');
              newText = newText && newText.replace(`${m + 1}. `, '');
              const { supporting, mentioning, contradicting, doi } = sciteInfo[id] || {};
              const findingAll = fundingInfo[id];
              let linkParems = {};
              if (doi) {
                linkParems = { target: '_blank', title: 'scite.ai', href: `https://scite.ai/reports/${doi}` }
              }
              return (
                <li key={m} className='refItem'>
                  <div>{newText}</div>
                  {scholar_url && (
                    <a title='Google Scholar' href={scholar_url} target='_blank' className='gslink'>
                      <img alt='Google Scholar' src={`${consts.ResourcePath}/sys/aminer/icon/gscholar_icon.png`} />
                    </a>
                  )}

                  {oa_query && (
                    <a title='Locate open access version' href={oa_query} target='_blank' className='gslink'>
                      <img alt='Locate open access version' src={`${consts.ResourcePath}/sys/aminer/icon/oa_icon.png`} />
                    </a>
                  )}

                  {scite && (
                    <>
                      {/* <img alt="Scite tallies" title='Scite tallies' onClick={getScholarScite.bind(this, newText, id)}
                        src={`${consts.ResourcePath}/sys/aminer/icon/scite.png`} /> */}
                      {loading && (id === sciteInfo.loadId) && <Loading fatherStyle='loading' />}
                      {(supporting || mentioning || contradicting) && (
                        <a {...linkParems} className='sciteTip'>
                          <span className={classnames('smallBox', 'green')} />{supporting}
                          <span className={classnames('smallBox', 'block')} />{mentioning}
                          <span className={classnames('smallBox', 'orange')} />{contradicting}
                        </a>
                      )}
                      {
                        sciteInfo[id] && (!supporting && !mentioning && !contradicting) &&
                        <span className='noDataTip'>No Results</span>
                      }
                    </>
                  )}
                  <img title="Findings" alt='Findings' onClick={getScholarFunding.bind(this, newText, id)} src={`${consts.ResourcePath}/sys/aminer/icon/scholarcy-icon.png`} />
                  {findingAll && findingAll.length > 0 && (
                    <ul>{findingAll.map((n, m) => <li key={m}>{n}</li>)}</ul>
                  )}
                  {
                    findingAll && findingAll.length === 0 &&
                    <span className='noDataTip'>No Results</span>
                  }
                  {fundloading && (id === fundingInfo.loadId) && <Loading fatherStyle='loading' />}
                </li>
              )
            })}
          </ul>
        </>
      )
      }
    </div >
  )
}

PaperAnalysis.propTypes = {
  size: PropTypes.string,
}

PaperAnalysis.defaultProps = {
  size: 'normal', // small, normal
}

export default component(connect(({ loading }) => ({
  loading: loading.effects['pub/getScholarScite'],
  fundloading: loading.effects['pub/getScholarFunding'],
})), withRouter)(PaperAnalysis)
