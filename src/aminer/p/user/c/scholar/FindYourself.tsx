import React, { useEffect, useState, useRef } from 'react';
import { component, connect, FormCreate } from 'acore';
import consts from 'consts';
import { classnames } from 'utils';
import { Pagination, Tooltip } from 'antd';
import { PaginationProps } from 'antd/lib/pagination';
import { FormComponentProps } from 'antd/lib/form/Form';
import { FM, formatMessage } from 'locales';
import { Spin } from 'aminer/components/ui';
import { ProfileInfo } from 'aminer/components/person/person_type';
import { PopPerson } from 'aminer/components/pops';
import { IUserInfo } from 'aminer/components/common_types';
import SearchPerson from './SearchPerson';
import BindProfile from './BindProfile';
import CreateProfile from './CreateProfile';
import styles from './FindYourself.less';

interface IPropTypes extends FormComponentProps {
  dispatch: (config: { type: string; payload?: object | boolean }) => Promise<any>;
  results: ProfileInfo[];
  pagination?: PaginationProps;
  setIsFind: () => void;
  loading: boolean;
  userinfo: IUserInfo;
}

const schema = [
  'id',
  'name',
  'name_zh',
  'avatar',
  'bind',
  { profile: ['affiliation', 'affiliation_zh', 'position', 'position_zh'] },
  {
    indices: ['hindex', 'pubs', 'citations'],
  },
];

const FindYourself: React.FC<IPropTypes> = props => {
  const { dispatch, results, pagination, form, setIsBind, loading, userinfo } = props;
  const [tempProfile, setTempProfile] = useState<ProfileInfo | null>();
  const [isCreate, setIsCreate] = useState(false);

  const callSearch = values => {
    // const { searchObj, ...params } = values;
    setTempProfile(null);
    const params = form.getFieldsValue();
    // console.log('....params', a);
    const { name, affiliation, keyword } = params;

    const object = {
      // query: { query: name, advanced: { name: keyword, org: affiliation, term: name } },
      query: { query: keyword, advanced: { name, org: affiliation, term: keyword } },
      schema,
      include: [],
      ...values,
    };

    dispatch({ type: 'expertSearch/search', payload: object });
  };

  useEffect(() => {
    if (results) {
      onClickCard(results[0]);
    }
  }, [results]);

  const onPageChange = (current: number, pageSize: number | undefined) => {
    const cur_pagination = { current, pageSize };
    callSearch({ pagination: cur_pagination });
  };

  const onClickCard = (profile: ProfileInfo) => {
    setTempProfile(profile);
    setIsCreate(false);
  };

  const onChangeCreate = () => {
    setIsCreate(true);
    setTempProfile(null);
  };

  return (
    <div className={classnames(styles.findYourself, 'find-yourself')}>
      <div className="tips">
        <FM id="aminer.user.bind.tip" />
      </div>
      <div className="search_part">
        <div className="search_person">
          <SearchPerson onSearch={callSearch} form={form} userinfo={userinfo} />
        </div>
        {/* <span className="explain_btn">
          <Tooltip
            overlayClassName="bind_explain_tooltip"
            placement="topLeft"
            title={formatMessage({ id: 'aminer.user.binded.explain' })}
          >
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#icon-wenhao" />
            </svg>
          </Tooltip>
        </span> */}
        {/* TODO 接新的 创建 profile */}
        {/* <div className="create_profile">
          <button type="button" className="create_show_btn" onClick={onChangeCreate}>
            <FM id="aminer.user.bind.find.create" />
          </button>
        </div> */}
      </div>

      {!!results?.length && (
        // <p className="find_title">
        //   <FM id="aminer.user.bind.findyourself" />
        // </p>
        <p className="search_tip">
          <FM id="aminer.user.bind.search.tip" />
        </p>
      )}
      <div className="find_result">
        <div className="left">
          <Spin loading={loading} />
          <div className="person_list">
            {!!results?.length &&
              results.map(person => {
                const { bind } = person;
                return (
                  <div
                    className={classnames('person_item', {
                      highlight: tempProfile?.id === person?.id,
                    })}
                    key={person.id}
                  >
                    <PopPerson
                      onClickCard={onClickCard}
                      key={person.id}
                      profile={person}
                      isAuthorClick={false}
                      cardBottomZone={
                        bind
                          ? [
                              () => (
                                <div
                                  className="certified_image"
                                  style={{
                                    backgroundImage: `url(${consts.ResourcePath}/sys/aminer/certified.png)`,
                                  }}
                                ></div>
                              ),
                            ]
                          : []
                      }
                    />
                  </div>
                );
              })}
            {!results?.length && !loading && (
              <div className="empty_content">
                <p>
                  <FM id="aminer.user.bind.find.empty"></FM>
                </p>
                <img src={`${consts.ResourcePath}/sys/aminer/find_empty.png`} alt="" />
              </div>
            )}
          </div>
          {pagination && !!pagination.total && (
            <div className="pagination">
              <Pagination
                current={pagination.current}
                defaultCurrent={1}
                defaultPageSize={pagination.pageSize}
                total={pagination.total}
                onChange={onPageChange}
              />
            </div>
          )}
        </div>
        <div className="right">
          {tempProfile && !isCreate && <BindProfile profile={tempProfile} setIsBind={setIsBind} />}
          {!tempProfile && isCreate && <CreateProfile setIsBind={setIsBind} />}
        </div>
      </div>
    </div>
  );
};

export default component(
  FormCreate(),
  connect(({ expertSearch, loading }) => ({
    loading: loading.effects['expertSearch/search'],
    results: expertSearch.results,
    pagination: expertSearch.pagination,
    query: expertSearch.query,
  })),
)(FindYourself);
