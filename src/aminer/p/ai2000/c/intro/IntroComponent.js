import React, { useMemo, memo } from 'react';
import { component, connect} from 'acore';
import { FM, formatMessage } from 'locales';
import { sysconfig } from 'systems';
import { useImageLazyLoad } from 'utils/hooks';
import {
  ScholarsComponent,
  CountriesComponent,
  OrgsComponent,
  GenderComponent,
  RulesComponent,
  DescComponent,
} from './index';
import styles from './IntroComponent.less';

const { AI2000_Default_Year } = sysconfig;

const IntroComponent = props => {
  useImageLazyLoad();
  const { showMenu, aiYearData, year, isRecent, aiType } = props;
  const y = useMemo(() => (year ? year - 0 : AI2000_Default_Year), [year]);

  const {
    multiple_domains_scholars,
    multiple_domains_orgs,
    domains_topn_orgs,
    domains_gender,
    domains_countries,
  } = aiYearData || {};

  const renderTitle = () => (
    <div className="home_title" id="menu_about">
      <svg className="icon" aria-hidden="true" onClick={showMenu}>
        <use xlinkHref="#icon-menu1" />
      </svg>
      <FM
        id="ai2000.home.title"
        defaultMessage="AI 2000 Most Influential Scholars"
        tagName="h1"
        values={{
          type: isRecent
            ? formatMessage({
              id: 'ai2000.type.recent10',
              defaultMessage: 'in recent 10 years',
            })
            : formatMessage({
              id: 'ai2000.type.history',
              defaultMessage: 'throughout history',
            }),
        }}
      />
    </div>
  );

  return (
    <div className={styles.intro_page}>
      {renderTitle()}
      <div className="home_content">
        <DescComponent isRecent={isRecent} domains_topn_orgs={domains_topn_orgs} />

        {/* // Women in AI */}

        {sysconfig.Locale === 'en-US' && (
          <div className="women_in_ai" id="menu_women">
            <h2>Women in AI</h2>
            <div className="desc">
              <p>
                Among the 2020 AI 2000 scholars, 179 of them are females, corresponding to a 9.7% percentage. 
                The detail of AI 2000 female scholars can be found at the 2020 Women in AI List (
                  <a href="https://www.aminer.cn/women-in-ai" target="_blank" style={{ color: '#56b2b0' }}>https://www.aminer.cn/women-in-ai</a>
                ).
              </p>
              <p>
                In terms of country distribution, the ratio of female AI 2000 scholars in the US reaches 10.3%, 
                which is a little higher than the global average. 
                The UK, Canada, and France have 13-17% of scholars being females, way above the 9.7% average. 
                However, the percentages of female scholars in China and German are only 6.9% and 3.8%, respectively, 
                which are far lower than the global average.
              </p>
              <p>
                At the institution level, both Google and Microsoft have 10 female scholars named as AI 2000 scholars, 
                but the ratio of females in Google is only 6.2%, much below 9.7% (the overall average) and much lower than Microsoft's 12.3%. 
                Both the ratios of MIT and UW are above 18%, 
                close to two times of the average. 
                When it comes to Tsinghua--the only Chinese organization among top 10, 
                this ratio is 12.5%, higher than Stanford's 10.5% and UC Berkeley's and CMU's 7%.
              </p>
              <p>
                Finally, the fields with the most female scholars are Human-Computer Interaction (26%) and Visualization (17%), 
                and the third most fields include Natural Language Processing, Computer Networking, and Theory, 
                all of which have 10% of scholars being females. 
                All other fields have lower female ratios than the overall average and the field that has the largest gender gap is Machine Learning, 
                in which only 2% of scholars are females.
              </p>
            </div>
          </div>
        )}
        {sysconfig.Locale !== 'en-US' && (<div></div>)}
        {/* 2、3、4高引学者 */}
        <ScholarsComponent multiple_domains_scholars={multiple_domains_scholars} />

        {/* 国家分布 */}
        <CountriesComponent aiType={aiType} year={year} domains_countries={domains_countries} />

        {/* 机构分布 */}
        <OrgsComponent
          multiple_domains_orgs={multiple_domains_orgs}
          domains_topn_orgs={domains_topn_orgs}
          aiType={aiType}
          year={year}
        />

        {/* 性别比例 */}
        <GenderComponent domains_gender={domains_gender} />
      </div>

      <RulesComponent y={y} domains_topn_orgs={domains_topn_orgs} />

      <div className="contact" id="menu_contact">
        <FM id="ai2000.side.contact" tagName="h2" />
        <div>
          <FM
            id="ai2000.home.contact"
            tagName="div"
            values={{
              count: (domains_topn_orgs && domains_topn_orgs.length) || '20',
              email: (
                <a className="email" href="mailto:award@aminer.org">
                  {' '}
                  award@aminer.org
                </a>
              ),
            }}
          />
        </div>
      </div>
      {/* {sysconfig.Locale === 'en-US' && <div className="women_in_ai" id="menu_women">
        <FM id="ai2000.side.women_in_ai" tagName="h2" />
        <div>
          <FM
            id="ai2000.home.other"
            tagName="div"
            values={{
              link: (
                <a className="link" href="https://www.aminer.cn/women-in-ai" target="_blank">
                  https://www.aminer.cn/women-in-ai
                  </a>
              ),
            }}
          />
        </div>
      </div>} */}
    </div>
  );
};

export default component(
  connect(({ aminerAI10 }) => ({
    aiYearData: aminerAI10.aiYearData,
  })),
)(memo(IntroComponent));
