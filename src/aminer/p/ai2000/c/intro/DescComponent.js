import React from 'react';
import { FM, formatMessage } from 'locales';

const DescComponent = props => {
  const { domains_topn_orgs, isRecent } = props;

  return (
    <div className="home_desc">
      <p>
      <FM
        id="ai2000.home.desc"
        tagName="div"
        values={{
          type: isRecent
            ? formatMessage({
              id: 'ai2000.type.recent10',
              defaultMessage: 'in the last 10 years',
            })
            : formatMessage({
              id: 'ai2000.type.history',
              defaultMessage: 'throughout history',
            }),
          home: (
            <a href="/" target="_blank">
              AMiner.cn
            </a>
          ),
        }}
      />
      </p>
     <p>
     <FM
        id="ai2000.home.desc1"
        tagName="div"
        values={{
          count: (domains_topn_orgs && domains_topn_orgs.length) || '20',
          type: isRecent
            ? formatMessage({
              id: 'ai2000.type.last10',
              defaultMessage: 'in the last 10 years',
            })
            : formatMessage({
              id: 'ai2000.type.history',
              defaultMessage: 'throughout history',
            }),
        }}
      />
     </p>
      
      <p>
      <FM
        id="ai2000.home.desc2"
        tagName="div"
        values={{
          un1: (
            <a
              className="un1"
              target="_blank"
              rel="noopener noreferrer"
              href="https://newsletter.eecs.berkeley.edu/2017/04/berkeley-cs-faculty-among-the-most-influential-in-their-fields/"
            >
              <FM id="ai2000.home.desc2.un1" />
            </a>
          ),
        }}
      />
      </p>

      <p>
      <FM
        id="ai2000.home.desc3"
        tagName="div"
        values={{
          america_num: 1123,
          china_num: 174,
          eu_number: 231,
          profile1: (
            <a className="un1" href="/profile/53f4ba75dabfaed83977b7db" target="_blank">
              Yoshua Bengio
            </a>
          ),
          profile2: (
            <a className="un1" href="/profile/53f48d34dabfaea7cd1d19d1" target="_blank">
              Andrew Y. Ng
            </a>
          ),
          profile3: (
            <a className="un1" href="/profile/53f4727edabfaeecd6a3b1a8" target="_blank">
              Alex J. Smola
            </a>
          ),
        }}
      />
      </p>
      
      
    </div>
  );
};

export default DescComponent;
