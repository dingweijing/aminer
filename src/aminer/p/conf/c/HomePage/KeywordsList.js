// getSchedule

import React, { useEffect, useState } from 'react';
import { Checkbox, Button } from 'antd';
import { page, connect } from 'acore';
import { classnames } from 'utils';
import { formatMessage, FM } from 'locales';
import { Spin } from 'aminer/components/ui';
import styles from './KeywordsList.less';

let offset = 10,
  max = 1000;

const KeywordsList = props => {
  const [keywordList, setKeywords] = useState([]);
  const [originalKeywordList, setOriginalKeywordList] = useState();
  const [checkedKey, setCheckedKey] = useState(['existed', 'calculated']);

  const {
    keywordsModel,
    showDropDown = true,
    showLegend = false,
    showMenu = () => {},
    SetOrGetViews,
  } = props;

  // getPubByKey 不需要了，key存到models中
  const { keywords_loading, dispatch, confInfo, filters, isMobileClickMenu } = props;

  useEffect(() => {
    setKeywords(
      (keywordsModel &&
        keywordsModel
          .filter(keyword => {
            return !isBadKey.includes(keyword.keywords.toLocaleLowerCase());
          })
          .slice(0, offset)) ||
        [],
    );
    setOriginalKeywordList(
      (keywordsModel &&
        keywordsModel
          .filter(keyword => {
            return !isBadKey.includes(keyword.keywords.toLocaleLowerCase());
          })
          .slice(0, max)) ||
        [],
    );
  }, [keywordsModel]);

  useEffect(() => {
    if (props.keywords) {
      // like tab 是上层传递的
      setKeywords(props.keywords && props.keywords.slice(0, offset));
      setOriginalKeywordList(
        props.keywords
          .filter(keyword => {
            return !isBadKey.includes(keyword.keywords.toLocaleLowerCase());
          })
          .slice(0, max),
      );
    }
  }, [props.keywords]);

  // const getKeywords = () => {
  //   if (props.keywords) {
  //     // like tab 是上层传递的
  //     setKeywords(props.keywords.slice(0, offset));
  //     const newData = [];
  //     // if (!isBadKey.includes(props.keywords.toLocaleLowerCase())){
  //     // }
  //     // props.keywords.filters(keyword => {
  //     //   !isBadKey.includes(keyword.toLocaleLowerCase());
  //     // });
  //     setOriginalKeywordList(
  //       props.keywords
  //         .filter(keyword => {
  //           return !isBadKey.includes(keyword.keywordswords.toLocaleLowerCase());
  //         })
  //         .slice(0, max),
  //     );
  //   } else {
  //     // index tab 在这里发请求
  //     dispatch({
  //       type: 'aminerConf/GetKeywords',
  //       payload: { conf_id: confInfo.id },
  //     }).then(result => {
  //       setKeywords(
  //         (result &&
  //           result
  //             .filter(keyword => {
  //               return !isBadKey.includes(keyword.keywordswords.toLocaleLowerCase());
  //             })
  //             .slice(0, offset)) ||
  //           [],
  //       );
  //       setOriginalKeywordList(
  //         (result &&
  //           result
  //             .filter(keyword => {
  //               return !isBadKey.includes(keyword.keywordswords.toLocaleLowerCase());
  //             })
  //             .slice(0, max)) ||
  //           [],
  //       );
  //     });
  //   }
  // };

  // useEffect(() => {
  //   getKeywords();
  // }, []);

  const updateKeywords = key => {
    SetOrGetViews('click', dispatch, confInfo.id);
    dispatch({
      type: 'aminerConf/setSysTrack',
      payload: {
        type: 'conf_system',
        target_type: confInfo.short_name,
        target_name: 'left_keywords',
        payload: JSON.stringify(key),
      },
    });
    isMobileClickMenu && showMenu();
    if (filters.keywords !== key) {
      dispatch({ type: 'aminerConf/clearFilters' });
    }
    dispatch({ type: 'aminerConf/updateFilters', payload: { keywords: key } });
  };

  // const checkboxOptions = [
  //   {
  //     label: formatMessage({
  //       id: 'aminer.conf.keywords.existed',
  //       defaultMessage: '论文关键词',
  //     }),
  //     value: 'existed',
  //   },
  //   {
  //     label: formatMessage({
  //       id: 'aminer.conf.keywords.calculated',
  //       defaultMessage: '论文关键词',
  //     }),
  //     value: 'calculated',
  //   },
  // ];

  const onChange = checkedValues => {
    let check = checkedValues;
    if (checkedValues && checkedValues.length === 0) {
      check = checkedKey[0] === 'existed' ? ['calculated'] : ['existed'];
    }
    setCheckedKey(check);
    if (check.length === 2) {
      setKeywords(originalKeywordList.slice(0, keywordList.length));
    }
    if (check.length === 1) {
      const k = check[0] === 'existed' ? 'k' : 'e';
      setKeywords(originalKeywordList.filter(keyword => keyword[k]).slice(0, keywordList.length));
    }
  };

  const parseType = () => (checkedKey.length === 2 ? 'all' : checkedKey[0]);

  const seeMoreKey = () => {
    SetOrGetViews('click', dispatch, confInfo.id);
    dispatch({
      type: 'aminerConf/setSysTrack',
      payload: {
        type: 'conf_system',
        target_type: confInfo.short_name,
        target_name: 'left_keywords',
        payload: JSON.stringify('More'),
      },
    });
    if (keywordList.length < originalKeywordList.length) {
      if (checkedKey.length === 2) {
        setKeywords(originalKeywordList.slice(0, keywordList.length + offset));
      } else {
        const k = checkedKey[0] === 'existed' ? 'k' : 'e';
        setKeywords(
          originalKeywordList.filter(keyword => keyword[k]).slice(0, keywordList.length + offset),
        );
      }
    }
  };

  const onCollapse = () => {
    SetOrGetViews('click', dispatch, confInfo.id);
    dispatch({
      type: 'aminerConf/setSysTrack',
      payload: {
        type: 'conf_system',
        target_type: confInfo.short_name,
        target_name: 'left_keywords',
        payload: JSON.stringify('Collapse'),
      },
    });
    setKeywords(keywordList.slice(0, offset));
  };

  return (
    <div className={styles.keywords} id="keywords_list">
      <div className="keywords_list">
        {showLegend && (
          <div className="keywords_legend">
            <div>
              <svg className="icon">
                <use xlinkHref="#icon-key" />
              </svg>
              <FM id="aminer.conf.keywords.legend" default="Keywords" />
            </div>
          </div>
        )}

        {/* {showDropDown && (
          <div className="allType">
            <div className="all">
              <Checkbox.Group options={checkboxOptions} onChange={onChange} value={checkedKey} />
            </div>
            {false && showDropDown && (
              <a className="ant-dropdown-link" onClick={expandSelect.bind()}>
                <svg className="icon" aria-hidden="true">
                  <use xlinkHref="#icon-shouqi" />
                </svg>
              </a>
            )}
          </div>
        )} */}
        <Spin loading={keywords_loading} size="small" />
        <div className="keyword-down-list">
          {keywordList &&
            keywordList.map((keyword, index) => {
              return (
                keyword?(<div
                  key={`${keyword.keywords}_${index}`}
                  className={classnames(
                    { active: filters&&keyword&&(filters.keywords === keyword.keywords) },
                    'innerKey',
                  )}
                  onClick={updateKeywords.bind(null, keyword.keywords)}
                >
                  <span>
                    {keyword.keywords} ({keyword.n || keyword.w})
                  </span>
                </div>):null
              );
            })}
          {/* {keywordList &&
            keywordList.map((keyword, index) => {
              {
                if (isBadKey.includes(keyword.keywordswords.toLocaleLowerCase())) {
                  return false;
                }
              }
              const { k = 0, e = 0 } = keyword;
              const keywordType = parseType();
              return (
                <div
                  key={`${keyword.keywordswords}_${index}`}
                  className={classnames(
                    { active: filters.keywords === keyword.keywordswords },
                    'innerKey',
                  )}
                  onClick={updateKeywords.bind(null, keyword.keywordswords)}
                >
                  <label
                    className={classnames('keywordLabel', {
                      existed: keywordType === 'existed' || (keywordType === 'all' && k > e),
                      calculated: keywordType === 'calculated' || (keywordType === 'all' && e > k),
                    })}
                  />
                  <span>
                    {keyword.keywordswords} ({keyword.n || keyword.w})
                  </span>
                </div>
              );
            })} */}
          <div className="filterControll">
            <span>
              {keywordList && keywordList.length >= offset * 2 && (
                <Button type="link" onClick={onCollapse} className="expandBtn">
                  <svg className="expandIcon" aria-hidden="true">
                    <use xlinkHref="#icon-subtraction" />
                  </svg>
                  {formatMessage({ id: 'aminer.conf.session.collapse' })}
                </Button>
              )}
            </span>
            <span>
              {(keywordList && keywordList.length) <
                (originalKeywordList && originalKeywordList.length) && (
                <Button type="link" onClick={seeMoreKey} className="expandBtn">
                  <svg className="expandIcon" aria-hidden="true">
                    <use xlinkHref="#icon-add" />
                  </svg>
                  {formatMessage({
                    id: 'aminer.common.more',
                    defaultMessage: 'More',
                  })}
                </Button>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page(
  connect(({ loading, aminerConf }) => ({
    keywords_loading: loading.effects['aminerConf/GetKeywords'],
    filters: aminerConf.filters,
    isMobileClickMenu: aminerConf.isMobileClickMenu,
    keywordsModel: aminerConf.KeywordsList,
  })),
)(KeywordsList);

const isBadKey = [
  'learning',
  'robustness',
  'networks',
  'adversarial',
  'via',
  'representations',
  'neural',
  'training',
  'generalization',
  'unsupervised',
  'generative',
  'deep',
  ': learning',
  'variational',
  'deep networks',
  'off-policy',
  'learned',
  'exploration',
  'understanding',
  'federated',
  'uncertainty',
  'quantization',
  'embeddings',
  'ensembles',
  'structured',
  'regularization',
  'discovery',
  'search',
  'equivariant',
  'generation',
  'convergence',
  'features',
  'learning of',
  'learn',
  'fast',
  'video',
  'based',
  'vium',
];

// {
//   /* <div
//   className={styles.open}
//   onClick={() => {
//     setCollapse(true);
//   }}
// >
//   <svg className={styles.mobileFilterIcon} aria-hidden="true">
//     <use xlinkHref="#icon-menu2" />
//   </svg>
// </div> */
// }

// {showLegend && (
//   <div className="keywords_legend">
//     <div>
//       <svg className="icon">
//         <use xlinkHref="#icon-key" />
//       </svg>
//       <FM id="aminer.conf.keywords.legend" default="Keywords" />
//     </div>
//     {btnVisible && (
//       <div
//         className="mobile_device"
//         onClick={() => {
//           setCollapse(false);
//         }}
//       >
//         收起
//       </div>
//     )}
//   </div>
// )}
