import React, { useEffect, useState, useMemo } from 'react';
import { connect, component, Link } from 'acore';
import { FM } from 'locales';
import { Layout } from 'aminer/layouts';
import { Input, Radio, message } from 'antd';
import styles from './addfield.less';

const { Search } = Input;
// Components
const years = [
  '2009',
  '2010',
  '2011',
  '2012',
  '2013',
  '2014',
  '2015',
  '2016',
  '2017',
  '2018',
  '2019',
];

const AddFieldPage = props => {
  const [selectValue, setSelectValue] = useState([]);
  const [selects, setSelects] = useState([]);
  const [fieldsArr, setFieldsArr] = useState([]);
  const [searchWords, setSearchWords] = useState([]);
  const { dispatch } = props;

  // useEffect(() => {
  //   dispatch({
  //     type: 'aminerAI10/getAddFields',
  //     payload: {
  //       query: 'AAAI',
  //     },
  //   }).then(data => {
  //     if (data) {
  //       const arr = fieldsArr.push(data);
  //       setFieldsArr(arr);
  //     }
  //   });
  // }, []);

  const getAddFields = value => {
    dispatch({
      type: 'aminerAI10/getAddFields',
      payload: {
        query: value,
      },
    }).then(data => {
      if (data) {
        if (data.length === 0) {
          message.info('无结果');
          return;
        }
        const arr = [...fieldsArr];
        arr.push(data);
        setFieldsArr(arr);
      }
    });
  };

  const changeSelect = (arr_index, index) => {
    const arr = [...selects];
    if (arr[arr_index] === index) {
      arr[arr_index] = '';
      setSelects(arr);
    } else {
      arr[arr_index] = index;
      setSelects(arr);
    }
  };

  const onChange = e => {
    setSelectValue(e.target.value);
  }

  const onSearchField = value => {
    if (searchWords.includes(value)) {
      return;
    }
    const words = [...searchWords];
    words.push(value);
    setSearchWords(words);
    getAddFields(value);
    setSelectValue('');
  };

  return (
    <Layout pageTitle="添加领域">
      <article className={styles.fieldPage}>
        <Search
          placeholder="input search text"
          enterButton="Search"
          value={selectValue}
          // size="large"
          onChange={onChange}
          onSearch={onSearchField}
          // onPressEnter={onSearchField}
        />
        {fieldsArr &&
          fieldsArr.map((fields, arr_index) => (
            <div className="each_field" key={fields[0].name}>
              {fields && fields.length > 0 && (
                <div className="table_box">
                  <p className="search_word">搜索词：{searchWords[arr_index]}</p>
                  <ul className="fields_list">
                    <li className="field_item field_head">
                      <span className="name">领域名称</span>
                      <span className="total_count">论文总数</span>
                      <span className="years">
                        {years.map(item => (
                          <span key={item} className="year_count">
                            {item || ''}
                          </span>
                        ))}
                      </span>
                    </li>
                    {fields.map((field, index) => {
                      const { pub_count, pub_count_yearly, name } = field;
                      return (
                        <li className="field_item" key={`${name}${pub_count}`}>
                          <span className="radio">
                            <Radio
                              checked={selects[arr_index] === index}
                              onChange={() => {
                                changeSelect(arr_index, index);
                              }}
                            />
                          </span>
                          <span className="name">{name}</span>
                          <span className="total_count">{pub_count}</span>
                          <span className="years">
                            {years.map(item => (
                              <span key={item} className="year_count">
                                {pub_count_yearly[item] || ''}
                              </span>
                            ))}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          ))}
      </article>
    </Layout>
  );
};

export default component(connect())(AddFieldPage);
