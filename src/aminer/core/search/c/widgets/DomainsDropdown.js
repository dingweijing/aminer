import React, { useState, useEffect, useMemo } from 'react';
import { Input, Button, Form, Icon, Radio, Menu, Dropdown, Checkbox } from 'antd';
import { FM, formatMessage } from 'locales';
import { isEqual } from 'lodash';
import { classnames } from 'utils';
import styles from './DomainsDropdown.less';

let lastSelectedDomains = [];
const DomainsDropdown = (props) => {
  const { domainsTreeData, setSelectedDomains, selectedDomains, onSubmit, searchOnDomainDropdownBlur, className, advancedBoxVisible, inputBoxRef } = props;
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleVisibleChange = visible => {
    setDropdownVisible(visible);
  }

  const handleMenuClick = e => {
    if (e.key === 'domainAll') {
      setSelectedDomains([])
    } else {
      setSelectedDomains([e.key])
    }
    handleVisibleChange(false)
    if (inputBoxRef && inputBoxRef.current && inputBoxRef.current.input) {
      inputBoxRef.current.input.focus();
      if (inputBoxRef.current.input.value) {
        let preValue = inputBoxRef.current.input.value;
        inputBoxRef.current.input.value = '';
        inputBoxRef.current.input.value = preValue;
      }
    }
  };

  // const domainNames = useMemo(() => {
  //   return selectedDomains.map(item => formatMessage({id: `aminer.search.filter.field.${item}`})).join('、');
  // }, [selectedDomains])

  const domainNames = selectedDomains.map(item => formatMessage({id: `aminer.search.filter.field.${item}`})).join('、');

  useEffect(() => {
    lastSelectedDomains = selectedDomains;
  }, [])

  useEffect(() => {
    if (searchOnDomainDropdownBlur && !dropdownVisible && !isEqual(lastSelectedDomains, selectedDomains)) {
      lastSelectedDomains = selectedDomains;
      onSubmit();
    }
  }, [searchOnDomainDropdownBlur, dropdownVisible, selectedDomains])

  const onDomainChange = (values) => {
    setSelectedDomains(values);
  }

  const domains = useMemo(() => {
    return (
      // <Checkbox.Group onChange={setSelectedDomains}> 
        <Menu onClick={handleMenuClick}>
          <Menu.Item key='domainAll'>
            {formatMessage({id: `aminer.search.filter.field.ALL`})}
          </Menu.Item>
          <Menu.Divider />
          {domainsTreeData && !!domainsTreeData.length && domainsTreeData.map(domain => (
            <Menu.Item key={domain.key}>
              {/* <Checkbox value={domain.key}> */}
                <div className='domainText'>
                  {formatMessage({id: `aminer.search.filter.field.${domain.key}`})}
                </div>
              {/* </Checkbox> */}
            </Menu.Item>
          ))}
        </Menu>
      // </Checkbox.Group>
    )
  }, [domainsTreeData])

  return (
    <div className={classnames(styles.domainsDropdown, styles[className])}>
      <Checkbox.Group onChange={onDomainChange} value={selectedDomains} > 
        <Dropdown 
          overlay={domains} 
          placement="bottomRight" 
          key="advanceSearchBoxDomainSelect" 
          trigger={['click']}
          visible={dropdownVisible}
          onVisibleChange={handleVisibleChange}
          overlayClassName={classnames('domainDropDownContent', className)}
        >
          <Button className={classnames('domainBtn', (advancedBoxVisible && 'domainBtnOnAdvance'))} title={domainNames || 'All Fields'}>
            <div className='domainBtnText'>{domainNames || formatMessage({id: 'aminer.search.filter.field.ALL'})}</div>
            <div className='dropdownIcon'>
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-arrowbar" />
              </svg>
            </div>
          </Button>
        </Dropdown>
      </Checkbox.Group>
    </div>
  )
}

export default DomainsDropdown
