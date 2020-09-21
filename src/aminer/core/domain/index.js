import React, { useEffect, useState } from 'react';
import { Input } from 'antd';
import { page, connect, Link } from 'acore';
import { Layout } from 'aminer/layouts';
import { FM, formatMessage } from 'locales';
import { Loading } from 'components/ui';
import { FieldList } from './c';
import styles from './index.less';

const { Search } = Input;
const DomainPage = props => {
  const { dispatch, domains, loading } = props;
  const [domainDisplay, setDomainDisplay] = useState(domains || []);
  useEffect(() => {
    if (!domains) {
      dispatch({
        type: 'domain/getAllDomains',
        payload: {
          offset: 0,
          size: 100,
        },
      });
    }
  }, []);

  useEffect(() => {
    if (domains) {
      setDomainDisplay(domains);
    }
  }, [domains]);

  const onDomainSearch = e => {
    if (!domains) return [];
    const value = e.target.value;
    let regex = new RegExp(
      value
        .trim()
        .split(' ')
        .filter(item => item !== '')
        .join('|'),
      'gi',
    );
    let newDomainDisplay = domains.filter(item => {
      if (item.display_name) {
        const { cn, en } = item.display_name;
        return regex.test(cn) || regex.test(en);
      }
      return false;
    });
    setDomainDisplay(newDomainDisplay);
  };

  return (
    <Layout
      classNames={styles.layout}
      pageTitle={formatMessage({ id: 'aminer.channel.list' })}
      pageDesc="AMiner将科学文献按学科进行分类，为用户提供基于学科领域的搜索和数据分析服务。在每个学科内，可检索该学科论文、学者，查看学科研究趋势、热门关键词、主要期刊会议等。"
      pageKeywords="AMiner，学科，领域，学术搜索，数据分析，学术排行，人工智能，AI搜索"
    >
      <article className={styles.article}>
        <div className={styles.loadingWrap}>
          {loading && <Loading fatherStyle={styles.loading} />}
        </div>
        <section className="top">
          <h2>Channel,</h2>
          {/* <div className="desc">
            一览经典必读，站在巨人的肩膀上。小脉根据不同主题为你推荐论文必读清单。
            为了对抗蔓延全球的新冠肺炎疫情，开放而全面的数据资源可以帮助研究者、官员、医疗工作者和普通民众更深入地了解病毒和疫情。我们自疫情发端即致力于收集来自世界各地各种类型的相关开放数据，并保持持续更新。数据集的范围包括疫情、科研、知识图谱、媒体信息等各方面。可以通过下面的表格查找和下载相关数据集。
          </div> */}
        </section>
        <section className="content">
          {domains && !!domains.length && (
            <>
              <h1 className="list_title">
                <div className="title_left">
                  <span className="list">
                    <FM id="aminer.channel.list" />
                  </span>
                </div>
                <div className="title_right">
                  <Search
                    placeholder={formatMessage({
                      id: 'aminer.channel.search.placeholder',
                      defaultMessage: 'Input channel name',
                    })}
                    // onSearch={value => console.log(value)}
                    onChange={onDomainSearch}
                    // style={{ width: 200 }}
                    className="channel_search"
                    allowClear
                  />
                </div>
              </h1>
              <div className="list_desc">
                <div>
                  <FM id="aminer.channel.list.desc1" />{' '}
                </div>
                <div>
                  <FM id="aminer.channel.list.desc2" />{' '}
                </div>
              </div>
              <div>
                <FieldList fields={domainDisplay} />
              </div>
            </>
          )}
        </section>
      </article>
    </Layout>
  );
};

DomainPage.getInitialProps = async ({ isServer, store }) => {
  if (!isServer) {
    return;
  }

  await store.dispatch({
    type: 'domain/getAllDomains',
    payload: {
      offset: 0,
      size: 100,
    },
  });

  const { domain } = store.getState();
  return { domain };
};

export default page(
  connect(({ loading, domain }) => ({
    loading: loading.effects['domain/getAllDomains'],
    domains: domain.domains,
  })),
)(DomainPage);
