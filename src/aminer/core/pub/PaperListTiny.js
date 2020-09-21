import React, { useRef, useEffect, useMemo, Fragment, useState } from 'react';
import { connect, Link, P, component } from 'acore';
import { sysconfig } from 'systems';
import PropTypes from 'prop-types';
import { FM, enUS, formatMessage } from 'locales';
import { classnames } from 'utils';
import { getLangLabel } from 'helper';
import { getProfileUrl } from 'utils/profile-utils';
import { ExpertLink, PaperPackLink, ZoomingImage } from 'aminer/components/widgets';
import smallcard from 'helper/smallcard';
import { PaperMark, SmallCard } from 'aminer/core/search/c/widgets';
import pubHelper from 'helper/pub';
import { Button, Modal } from 'antd';
import { CitedPart, BibtexPart, ViewPart, UrlPart, LabelPart } from './widgets/info';
import { authorInitialCap, getPubLabels } from './utils';
import styles from './PaperListTiny.less';

// TODO there are another PaperList.

const { PubList_Show_Authors_Max = 12 } = sysconfig;
const PresetTitleSize = {
  normal: 18,
};
// const PresetInfoLine = ['cited_num', 'bibtex', 'url', 'view_num'];
const PresetInfoLine = {
  cited_num: CitedPart,
  bibtex: BibtexPart,
  view_num: ViewPart,
  url: UrlPart,
  label: LabelPart,
};

// TODO .... refactor
let timer = null;
let card = null;
let authorHoverTarget = null;
const maxAnalysisLen = 300;

const AnalysisContent = props => {
  const { content } = props;
  if (!content) return <></>;
  if (content.length > maxAnalysisLen) {
    const [showMore, setShowMore] = useState(false);
    const toggleShowMore = () => {
      setShowMore(!showMore);
    };
    return (
      <div className="content">
        {showMore ? content : `${content.slice(0, maxAnalysisLen)}...`}
        <Button type="link" onClick={toggleShowMore} className="showMoreBtn">
          {showMore ? <FM id="aminer.common.less" /> : <FM id="aminer.common.more" />}
        </Button>
      </div>
    );
  }
  return <div className="content">{content}</div>;
};

const PaperListTiny = props => {
  const smallCard = useRef();
  const cid = useRef(props.id || Math.random()).current;
  const { dispatch } = props;
  const { paper, className } = props;
  const { showAuthorCard } = props;
  const {
    titleSize,
    highlightAuthorIDs,
    showInfoContent,
    getPubUrl,
    splitLineStyle,
    end,
    abstractLen,
  } = props;
  const { paperItemStyle, isAuthorsClick, isPaperOuter, onAuthorClick, renderAuthorsFun } = props;
  // console.log('papers', papers);

  const titleFontSize = useMemo(() => {
    if (typeof titleSize === 'string' && titleSize in PresetTitleSize) {
      return PresetTitleSize[titleSize];
    }
    if (typeof titleSize === 'number') {
      return titleSize;
    }
    return PresetTitleSize.normal;
  }, [titleSize]);

  useEffect(() => {
    card = smallcard.init(cid);

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []);

  const cancelUnderline = () => {
    if (!showAuthorCard || onAuthorClick) {
      return;
    }
    authorHoverTarget.classList.remove('underline');
  };

  const infocardShow = (sid, pid, e) => {
    if (!showAuthorCard || onAuthorClick) {
      return;
    }
    if (authorHoverTarget) {
      cancelUnderline();
    }
    authorHoverTarget = e.target;
    authorHoverTarget.classList.add('underline');
    if (card) {
      const target = document.querySelector(`#pid_${pid} #sid_${sid}`);
      card.show(target, sid);
    }
    if (smallCard.current) {
      smallCard.current.cancelHide();
      timer = setTimeout(() => {
        smallCard.current.getData();
      }, 0);
    }
  };

  const infocardHide = () => {
    // smallcard.preventShow();
    if (timer) {
      clearTimeout(timer);
    }
    if (smallCard.current) {
      smallCard.current.tryHideCard();
    }
  };

  const onClickAuthor = e => {
    if (!isAuthorsClick) {
      e.preventDefault();
    }
  };

  const defaultZones = {
    contentLeftZone: [],
    contentRightZone: [({ paper }) => <PaperMark key={5} paper={paper} />],
  };

  const handleAuthor = e => {
    if (onAuthorClick) {
      onAuthorClick(e.target);
    }
  };

  const renderTitle = paper => {
    // TODO paper.lang?
    const locale = sysconfig.Locale;
    const isDefaultLocale = locale === enUS;
    let { title, title_zh } = paper;

    if (!isDefaultLocale) {
      [title, title_zh] = [title_zh, title];
    }
    const ele = (
      <>
        <span className="paper-title">
          <PaperPackLink data={paper}>{title || title_zh}</PaperPackLink>
        </span>
      </>
    );
    return (
      <p className="title-line" style={{ fontSize: titleFontSize }}>
        {paper.id && (
          <Link
            to={pubHelper.genPubTitle({ id: paper.id, title: paper.title })}
            className="title-link"
            target={isPaperOuter ? '_blank' : '_self'}
          >
            {ele}
          </Link>
        )}
        {!paper.id && <span>{ele}</span>}
      </p>
    );
  };

  const renderAuthors = paper => {
    const { authors } = paper;
    if (renderAuthorsFun && typeof renderAuthorsFun === 'function') {
      return renderAuthorsFun(paper);
    }
    // const { pid, sid } = this.state;
    return (
      <div className="authors">
        {authors &&
          authors.length > 0 &&
          authors.slice(0, PubList_Show_Authors_Max).map((author, index) => {
            let { name, name_zh } = author;
            const locale = sysconfig.Locale;
            const isDefaultLocale = locale === enUS;

            if (!isDefaultLocale) {
              [name, name_zh] = [name_zh, name];
            }

            name = authorInitialCap(name || name_zh);

            // const showUnderline = (author.id === sid) && (paper.id === pid);
            const params = {
              id: `sid_${author.id}`,
              className: classnames('author link font-author', {
                highlight: highlightAuthorIDs && highlightAuthorIDs.includes(author.id),
              }),
              to: getProfileUrl(author.name, author.id),
              target: isPaperOuter ? '_blank' : '_self',
              onClick: onClickAuthor,
              onMouseEnter: e => {
                infocardShow(author.id, paper.id, e);
              },
              onMouseLeave: () => {
                infocardHide(author.id, paper.id);
              },
            };

            return (
              <Fragment key={`${author.id}${index}`}>
                {author.id && (
                  <>
                    {isAuthorsClick && !onAuthorClick && (
                      <ExpertLink author={author}>
                        <Link {...params}>{name || name_zh || ''}</Link>
                        {index + 1 !== authors.length && index + 1 < PubList_Show_Authors_Max && (
                          <span className="mr">,</span>
                        )}
                      </ExpertLink>
                    )}
                    {(!isAuthorsClick || onAuthorClick) && (
                      <span
                        {...params}
                        className={classnames('author font-author', {
                          nolink: !isAuthorsClick && !onAuthorClick,
                          link: !isAuthorsClick && onAuthorClick,
                        })}
                        onClick={handleAuthor}
                      >
                        {name || name_zh || ''}
                        {index + 1 !== authors.length && index + 1 < PubList_Show_Authors_Max && (
                          <span className="mr">,</span>
                        )}
                      </span>
                    )}
                  </>
                )}
                {!author.id && (
                  <>
                    {onAuthorClick && (
                      <>
                        <span className="author link" onClick={handleAuthor}>
                          {name || name_zh || ''}
                        </span>
                        {index + 1 !== authors.length && index + 1 < PubList_Show_Authors_Max && (
                          <span className="mr">,</span>
                        )}
                      </>
                    )}
                    {!onAuthorClick && (
                      <>
                        <span className={classnames('author', { nolink: !isAuthorsClick })}>
                          {name || name_zh || ''}
                        </span>
                        {index + 1 !== authors.length && index + 1 < PubList_Show_Authors_Max && (
                          <span className="mr">,</span>
                        )}
                      </>
                    )}
                  </>
                )}
              </Fragment>
            );
          })}
      </div>
    );
  };

  const ModalDescriptor = pprops => {
    const { content, title, abstract } = pprops;
    return (
      <div className={styles.descriptor}>
        <div className="title">{title}</div>
        <div className="content">{content || abstract}</div>
      </div>
    );
  };

  const renderAnalysis = (analysis, abstract) => {
    const [visible, setVisible] = useState(false);
    if (!analysis && !abstract) return <></>;
    const { img, content, agency, content_en, title, title_en = '', link } = analysis || {};
    const linkProps = link ? { href: link, target: '_blank' } : { style: { cursor: 'unset' } };
    return (
      <>
        <div
          className="analysisWrap"
          onClick={() => {
            setVisible(true);
          }}
        >
          {img && (
            <div className="imgWrap">
              <img src={img} className={className} alt="" style={{ cursor: 'zoom-in' }} />
              {/* <span className='timeLineTypeTag'>
              论文解读
            </span> */}
            </div>
          )}
          <div className="analysis">
            {title && (
              <a className={classnames('analysisTitle', { isLink: false })} /* {...linkProps} */>
                {getLangLabel(title_en, title)}
              </a>
            )}
            <AnalysisContent content={getLangLabel(content_en, content || abstract)} />
            {/* <div className="agency">{agency || 'Abstract'}</div> */}
          </div>
        </div>
        <Modal
          visible={visible}
          onCancel={() => {
            setVisible(false);
          }}
          closable={false}
          cancelText="关闭"
          footer={null}
          width="900px"
        >
          <div className={styles.zoomModalWrapper}>
            <img src={img} alt="" className={styles.modalImage} />
            <ModalDescriptor abstract={abstract} content={content} title={title} />
          </div>
          <div className={styles.modalFooter}>
            <Button
              onClick={() => {
                setVisible(false);
              }}
            >
              关闭弹窗
            </Button>
          </div>
        </Modal>
      </>
    );
  };

  const onRef = cardref => {
    smallCard.current = cardref;
  };

  // const infos = Object.keys(showInfoContent)
  const infos = ['cited_num', 'url'];
  if (!paper) {
    return false;
  }
  const { venue, pages, year, analysis, abstract } = paper;

  const { venueName, venueNameAfter } = pubHelper.getDisplayVenue(venue, pages, year);

  return (
    <div
      id={`${cid}_ROOT`}
      className={classnames(styles.aminerPaperList, styles[className], 'aminer-paper-list')}
    >
      <SmallCard onRef={onRef} id={cid} cancelUnderline={cancelUnderline} />
      <div
        key={paper.id}
        style={{ ...paperItemStyle }}
        className={classnames('paper-item', { end: !!end })}
        id={`pid_${paper.id}`}
      >
        <div className="content">
          {renderTitle(paper)}

          {renderAuthors(paper)}

          <div className="venue-line">
            {venueName}
            {venue && <span>{venueNameAfter}</span>}
            {paper && paper.pdf && (
              <span className="pdf-span" onClick={() => window.open(paper.pdf, '_blank')}>
                <i className={classnames('fa', 'fa-file-pdf-o', 'pdf-icon')} />
                PDF下载
              </span>
            )}
          </div>

          <div className="oprs">
            {infos &&
              infos.length > 0 &&
              infos.map((item, i) => {
                // showInfoContent
                const Component = PresetInfoLine[item];
                const params = showInfoContent[item];
                if (item === 'url' || item === 'cited_num') {
                  return false;
                  const pubUrl = params.getPubUrl || getPubUrl;
                  if (!pubUrl(paper.urls)) {
                    return false;
                  }
                  params.getPubUrl = pubUrl;
                }
                if (item === 'label' && getPubLabels(paper).length === 0) {
                  return false;
                }
                return (
                  <Fragment key={item}>
                    {i !== 0 && <span className="split">|</span>}
                    <Component paper={paper} {...params} />
                  </Fragment>
                );
              })}
          </div>
        </div>
        {renderAnalysis(analysis, abstract)}
      </div>
    </div>
  );
};

PaperListTiny.propTypes = {
  getPubUrl: PropTypes.func,
  showAbstract: PropTypes.bool,
  showAuthorCard: PropTypes.bool,
  showInfoContent: PropTypes.object,
  splitLineStyle: PropTypes.string,
  abstractLen: PropTypes.number,
  isPaperOuter: PropTypes.bool,
  isAuthorOuter: PropTypes.bool,
  isAuthorsClick: PropTypes.bool,
};

PaperListTiny.defaultProps = {
  getPubUrl: pubHelper.getPubUrl,
  showAbstract: true,
  showAuthorCard: true,
  showInfoContent: {
    cited_num: {},
    bibtex: {},
    view_num: {},
    url: {},
  },
  splitLineStyle: 'solid',
  abstractLen: 280,
  isPaperOuter: false,
  isAuthorOuter: false,
  isAuthorsClick: true,
};

export default component(connect())(PaperListTiny);

// TODO different from personPaperList.
