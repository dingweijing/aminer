import React from 'react';
import { component, connect } from 'acore';
import { FM } from 'locales';
import { sysconfig } from 'systems';
import { FieldsVote } from 'aminer/p/ai2000/component';

const { AI2000_Vote_ID } = sysconfig;
const RulesComponent = props => {
  const { domains_topn_orgs, y, domainInfo } = props;

  return (
    <div className="rules" id="menu_rules">
      <div className="rules_title">
        <FM id="ai2000.selection.rules" />
      </div>
      <div className="rules_content">
        <div className="rule_name">
          1.{' '}
          <FM
            id="ai2000.sub-field.divisions"
            values={{
              count: (domains_topn_orgs && domains_topn_orgs.length) || '20',
            }}
          />
        </div>
        <div className="rule_exp">
          <FM
            id="ai2000.sub-field.divisions.desc"
            values={{
              count: (domains_topn_orgs && domains_topn_orgs.length) || '20',
            }}
          />
          <div style={{ marginTop: '20px' }}></div>
          <FM id="ai2000.generation.rules.desc" tagName="p" />
        </div>
      </div>
      <div className="rules_content">
        <div className="rule_name">
          2. <FM id="ai2000.generation.rules" />
        </div>
        <div className="rule_exp">
          <FM
            id="ai2000.generation.rules.one"
            tagName="p"
            values={{
              count: (domains_topn_orgs && domains_topn_orgs.length) || '20',
            }}
          />
          {/* <FM id="ai2000.generation.rules.two" tagName="p" /> */}
        </div>
      </div>

      <div className="rules_content">
        <div className="rule_name">
          3. <FM id="ai2000.confs.rules" defaultMessage="About the Top Venues" />
        </div>
        {/* 领域分布 */}
        <div id="awards_by_fields" className="award_desc">
          <div className="award_desc">
            <FM
              id="ai2000.confs.rules.desc"
              tagName="span"
              values={{
                count: (domains_topn_orgs && domains_topn_orgs.length) || '20',
              }}
            />
            {sysconfig.Locale !== 'zh-CN' && <FM
              id="ai2000.confs.rules.desc.special"
              tagName="span"
            />}
          </div>
        </div>
      </div>

      <FieldsVote y={y} vote_id={AI2000_Vote_ID} domainInfo={domainInfo} />
      {/* <div className="rules_content">
          <div className="rule_name">
            4. <FM id="ai10.home.awards.history.title" />
          </div>
          <div className="history" id="menu_previous">
            <Link to="/mostinfluentialscholar">
              <FM
                id="ai2000.bestlist.year"
                defaultMessage="Click to see history list"
                values={{
                  year: '2016',
                }}
              />
            </Link>
            <Link to="/ai10">
              <FM
                id="ai2000.bestlist.year"
                defaultMessage="Click to see history list"
                values={{
                  year: '2018',
                }}
              />
            </Link>
          </div>
        </div> */}
    </div>
  );
};

export default component(
  connect(({ aminerAI10 }) => ({
    domainInfo: aminerAI10.domainInfo,
  })),
)(RulesComponent);
