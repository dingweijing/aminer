import React, { useState, useEffect, useMemo, useRef, lazy } from 'react';
import { FM } from 'locales';
import Scholar from './Scholar';

const ScholarsComponent = props => {
  const { multiple_domains_scholars } = props;

  return (
    <>
      {multiple_domains_scholars && (
        <div id="winners_in_multiple_fields" className="part multiple">
          <FM
            id="ai2000.home.multiple.title"
            defaultMessage="AI 2000 Most Influential Scholars in Multiple Fields"
            tagName="h2"
          />

          {multiple_domains_scholars['5'] && (
            <div id="five_appearances" className="appearances">
              <FM id="ai2000.home.multiple.five" defaultMessage="Five Appearances" tagName="h3" />
              <ul className="multiple_list">
                {multiple_domains_scholars['5'].map((item, index) => (
                  <li className="multiple_item" key={item.person_id}>
                    <Scholar personData={item} />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {multiple_domains_scholars['4'] && (
            <div id="four_appearances" className="appearances">
              <FM id="ai2000.home.multiple.four" defaultMessage="Four Appearances" tagName="h3" />
              <ul className="multiple_list">
                {multiple_domains_scholars['4'].map((item, index) => (
                  <li className="multiple_item" key={item.person_id}>
                    <Scholar personData={item} />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {multiple_domains_scholars['3'] && (
            <div id="three_appearances" className="appearances">
              <FM id="ai2000.home.multiple.three" defaultMessage="Three Appearances" tagName="h3" />
              <ul className="multiples_small_list">
                {multiple_domains_scholars['3'].map((item, index) => (
                  <li className="multiple_item" key={item.person_id}>
                    <Scholar showPos={false} type="small" personData={item} />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {multiple_domains_scholars['2'] && (
            <div id="two_appearances" className="appearances">
              <FM id="ai2000.home.multiple.two" defaultMessage="Two Appearances" tagName="h3" />
              <ul className="multiples_small_list">
                {multiple_domains_scholars['2'].map((item, index) => (
                  <li className="multiple_item" key={item.person_id}>
                    <Scholar showPos={false} type="small" personData={item} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ScholarsComponent;
