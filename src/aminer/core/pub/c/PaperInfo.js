import React, { useMemo, Fragment } from 'react';
import { Link, component } from 'acore';
import PropTypes from 'prop-types';
import { PaperPackLink } from 'aminer/components/widgets';
import { getProfileUrl } from 'utils/profile-utils';
import { ExpertLink } from 'aminer/components/widgets';
import pubHelper from 'helper/pub';
import { CitedPart, BibtexPart, ViewPart, UrlPart, LabelPart } from 'aminer/core/pub/widgets/info';
import { getPubLabels } from 'aminer/core/pub/utils';
import styles from './PaperInfo.less';

const PresetInfoLine = {
  cited_num: CitedPart,
  // bibtex: BibtexPart,
  // view_num: ViewPart,
  // url: UrlPart,
  // label: LabelPart
};

const PaperInfo = props => {
  const { data, index, showInfoContent, showFields } = props;
  const { lang, authors } = data || {};
  const isZH = lang === 'zh';
  const pages = data && data.pages || {};

  const nameStr = authors && authors.filter(author => author.name).map(author => author.name).join('&');
  const useComma = !/,/g.test(nameStr);

  const names = useMemo(() => {
    return (
      <>
        {authors && authors.length > 0 && authors.slice(0, 5).filter(author => author.name).map((author, _index) => {
          let { name, name_zh, id } = author;
          const authorlink = getProfileUrl(name, id);
          const hasCapReg = /[\u4E00-\u9FA5A-Z]/g;
          if (isZH) {
            [name, name_zh] = [name_zh, name];
          }
          if (name && !hasCapReg.test(name)) {
            name = name.replace(/( |^)[a-z]/g, L => L.toUpperCase());
          }
          const isLast = (_index + 1 === 5) && (_index >= 1);
          return (
            <span key={id || _index}>
              {/* {isLast && 'and '} */}
              {author.id && (
                <ExpertLink author={author}>
                  <Link to={authorlink} className={styles.name}>{name || name_zh}</Link>
                </ExpertLink>
              )}
              {!author.id && `${name || name_zh}`}
              {/* {isLast && '. '} */}
              {isLast ? (authors && authors.length > 5 ? '...' : '. ')
                : (useComma ? ', ' : '; ')}
            </span>
          )
        })}
      </>
    )
  }, [authors]);

  const exponent = useMemo(() => {
    const item = Object.keys(showInfoContent)[0];
    const Component = PresetInfoLine[item];
    const params = showInfoContent[item];
    return (
      <span className="oprs">
        {/* <span className="split">|</span> */}
        <Component paper={data} {...params} />
      </span>

    )
  }, [data]);

  const title = useMemo(() => {
    return (
      <>
        {
          data.title && (
            <Link to={pubHelper.genPubTitle({ id: data.id, title: data.title })}
              className={styles.title}>
              <PaperPackLink data={data}>
                {isZH ? data.title_zh : data.title.replace(/\.+$/, '')}.
              </PaperPackLink>
            </Link>
          )
        }
      </>
    )
  }, [data]);
  
  const venue = useMemo(() => {
    return (
      <>
        {data.venue && data.venue.info && (<i> {data.venue.info.name} </i>)}
        {/* {data.venue && (pages.start || pages.end || !!data.year) && ', '} */}
      </>
    )
  }, [data]);

  const date = useMemo(() => {
    return (
      <>
        {pages.start && `pp. ${pages.start}`}
        {pages.start && pages.end && '-'}
        {pages.end && `${pages.end}`}
        {pages.end && data.year && ', '}
        {!!data.year && data.year > 0 && `${data.year}. `}
      </>
    )
  }, []);

  const renderFields = {
    names, exponent, title, venue, date,
  }

  return (
    <div className={styles.paperInfo}>
      <div>
        {index && (<span className={styles.index}>{index} </span>)}
      </div>
      <div>
        {showFields && showFields.map((n) => <Fragment key={n}>{renderFields[n]}</Fragment>)}
      </div>
    </div>
  )
}

PaperInfo.propTypes = {
  showInfoContent: PropTypes.object,
  showFields: PropTypes.array,
};


PaperInfo.defaultProps = {
  showInfoContent: {
    cited_num: {},
    // bibtex: {}, view_num: {}, url: {}
  },
  showFields: ['names', 'title', 'venue', 'date']
  // showFields: ['names', 'title', 'exponent', 'venue', 'date']
}

export default component()(PaperInfo)
