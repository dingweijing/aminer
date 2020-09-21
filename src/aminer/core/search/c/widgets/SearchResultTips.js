import React from 'react';
import { Tag } from 'antd';
import { FM, formatMessage, zhCN } from 'locales';
import { formatNumberWithKZero } from 'utils/search-utils'

const SearchResultTips = (props) => {
  const {domain, query, onSelectDomainClick, translate, total, onTranslateDisable} = props;
  
  let domainStatus = 'withoutDomain', translateStatus = 'withoutTranslate', queryStatus = 'withoutQuery';
  const values = { total: formatNumberWithKZero(total) };

  if (query && query.query) {
    queryStatus = 'withQuery';
    values.query = query.query;
  }
  if (domain) {
    domainStatus = 'withDomain';
    values.domain = ` ${formatMessage({id: `aminer.search.filter.field.${domain}` })} `;
  }
  //  else {
  //   values.restrict = (
  //     <span className="restriceChannel" onClick={onSelectDomainClick}>
  //       <FM id={`aminer.search.results.restrict.channel`}/>
  //     </span>
  //   )
  // }
  if (translate) {
    translateStatus = 'withTranslate';
    values.translate = (
      <Tag
        className='filterItem'
        closable={true}
        onClose={onTranslateDisable}
      >{translate}</Tag>
    );
  }

  return <FM id={`aminer.search.results.${queryStatus}.${domainStatus}.${translateStatus}`} values={{...values}} className='tipWrap' />
}

export default SearchResultTips
