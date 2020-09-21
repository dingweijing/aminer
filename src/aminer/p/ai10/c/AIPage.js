import React, { useEffect, useState, memo } from 'react';
import { FM } from 'locales';
import consts from 'consts';
import { sysconfig } from 'systems';
import { useImageLazyLoad } from 'utils/hooks';
import { wget } from 'utils/request';
import { Scholar } from './index';
import styles from './AIPage.less';

const { PlaceImagePath } = sysconfig;

const version = 'v1';
const orgPath = `${consts.ResourcePath}/sys/aminer/ai10/orgs/${version}`;
const iconPath = `${consts.ResourcePath}/sys/aminer/ai10/${version}`;

const dataurl = `${consts.ResourcePath}/data/ai10/v2.0/ai10data.json`;

const IntroPage = props => {
  useImageLazyLoad();
  const { showMenu, ai10_data } = props;
  if (!ai10_data) {
    return false;
  }

  return (
    <div className={styles.intro_page}>
      <div className="home_title">
        <svg className="icon" aria-hidden="true" onClick={showMenu}>
          <use xlinkHref="#icon-menu1" />
        </svg>
        <FM id="ai10.home.title" defaultMessage="AI-10 Most Influential Scholars" tagName="h1" />
      </div>

      <div className="home_content">
        <FM
          id="ai10.home.desc"
          defaultMessage={
            "The AMiner Most Influential Scholar Annual List in Artificial Intelligence (AI) names the world's top-cited research scholars from the fields of AI. The list is conferred in recognition of outstanding technical achievements with lasting contribution and impact to the research community. In 2018, the winners are among the most-cited scholars whose paper was published in the top venues of their respective subject fields between 2007 and 2017. Recipients are automatically determined by a computer algorithm deployed in the AMiner system that tracks and ranks scholars based on citation counts collected by top-venue publications. In specific, this list aims to find the most cited AI scholars in the top venues.If you have any comments, suggestions, or corrections to make, please feel free to contact us at"
          }
          tagName="div"
          values={{
            email: (
              <a className="email" href="mailto:award@aminer.org">
                {' '}
                award@aminer.org
              </a>
            ),
          }}
        />

        <div id="awards_by_fields" className="part awards">
          <FM id="ai10.home.awards.title" defaultMessage="Awards By Fields" tagName="h2" />
          <div className="award_desc">
            <FM
              id="ai10.home.awards.desc"
              defaultMessage="The 2018 list covers the 21 fields in the table below which also contains the top venues of each field."
            />
            <FM
              id="ai10.home.awards.contact"
              defaultMessage="(If you want to suggest the other fields, please contact us at {email})"
              values={{
                email: (
                  <a className="email" href="mailto:award@aminer.org">
                    {' '}
                    award@aminer.org
                  </a>
                ),
              }}
            />
          </div>

          <ul className="list award_list">
            {ai10_data.fields2017 &&
              ai10_data.fields2017.map((field, i) => (
                <li key={i} className="award_item">
                  <FM
                    id={ai10_data.awards[i].id}
                    defaultMessage={ai10_data.awards[i].defaultMessage}
                  />
                  <div className="desc" dangerouslySetInnerHTML={{ __html: field.desc }} />
                </li>
              ))}
          </ul>
        </div>

        <div id="institutes_of_winners" className="part institutes">
          <FM id="ai10.home.institutes.title" defaultMessage="Awards By Fields" tagName="h2" />
          <div className="desc">
            <FM
              id="ai10.home.institutes.desc"
              defaultMessage="The research institutes that have the most award winners in each field."
            />
          </div>

          <ul className="all_institutes_list">
            {ai10_data.institutions2017 &&
              ai10_data.institutions2017.map((institution, index) => (
                <li className="org" key={index}>
                  <div className="img_box">
                    {/* <img data-src={`${orgPath}${institution.url}`} src={PlaceImagePath} alt={institution.aff} /> */}
                    <img src={`${orgPath}${institution.url}`} alt={institution.aff} />
                  </div>
                  <p className="winner">{`${institution.winner} Winners`}</p>
                  <div className="mask">
                    <span className="number">{index + 1}</span>
                    <div className="texts">
                      <p className="top10">{`${institution.top10} |  Top 10`}</p>
                      <hr />
                      <p className="top100">{`${institution.top100} | Top 100`}</p>
                    </div>
                  </div>
                </li>
              ))}
          </ul>

          <ul className="list institutes_list">
            {ai10_data.fields2017 &&
              ai10_data.fields2017.map((field, i) => (
                <li key={i} className="institutes_item">
                  <FM
                    id={ai10_data.awards[i].id}
                    defaultMessage={ai10_data.awards[i].defaultMessage}
                  />
                  <ul className="single_institution">
                    {field.institution &&
                      field.institution.map((item, index) => (
                        <li className="org" key={index}>
                          <div className="img_box">
                            <img
                              data-src={`${orgPath}${item.img}`}
                              src={PlaceImagePath}
                              alt={item.name}
                            />
                          </div>
                          <p className="winner">{`${item.winners} Winners`}</p>
                          <div className="mask">
                            <span className="number">{index + 1}</span>
                            <div className="texts">
                              <p className="top10">{`${item.top10} Top 10`}</p>
                              <hr />
                              <p className="top100">{`${item.top100} Top 100`}</p>
                            </div>
                          </div>
                        </li>
                      ))}
                  </ul>
                </li>
              ))}
          </ul>
        </div>

        <div id="winners_in_multiple_fields" className="part multiple">
          <FM
            id="ai10.home.multiple.title"
            defaultMessage="Winners in Multiple Fields"
            tagName="h2"
          />
          <div className="desc">
            <FM
              id="ai10.home.multiple.desc"
              defaultMessage="Scholars may be named the AMiner most influential AI scholars in multiple sub-fields."
            />
          </div>
          <div id="four_appearances" className="appearances">
            <FM id="ai10.home.multiple.four" defaultMessage="Four Appearances" tagName="h3" />
            <ul className="multiple_list">
              {ai10_data.four_appearances &&
                ai10_data.four_appearances.map((item, index) => (
                  <li className="multiple_item" key={index}>
                    <Scholar person={item} />
                  </li>
                ))}
            </ul>
          </div>
          <div id="three_appearances" className="appearances">
            <FM id="ai10.home.multiple.three" defaultMessage="Three Appearances" tagName="h3" />
            <ul className="multiples_small_list">
              {ai10_data.three_appearances &&
                ai10_data.three_appearances.map((item, index) => (
                  <li className="multiple_item" key={index}>
                    <Scholar type="small" person={item} />
                  </li>
                ))}
            </ul>
          </div>
          <div id="two_appearances" className="appearances">
            <FM id="ai10.home.multiple.two" defaultMessage="Two Appearances" tagName="h3" />
            <ul className="multiples_small_list">
              {ai10_data.two_appearances &&
                ai10_data.two_appearances.map((item, index) => (
                  <li className="multiple_item" key={index}>
                    <Scholar type="small" person={item} />
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <div id="gender_of_winners" className="part gender">
          <FM id="ai10.home.gender.title" defaultMessage="Gender of Winners" tagName="h2" />
          <div className="desc">
            <FM
              id="ai10.home.gender.desc"
              defaultMessage="The female-to-male ratio is counted in every sub-fields."
            />
          </div>

          <ul className="list gender_list">
            {ai10_data.fields2017 &&
              ai10_data.fields2017.map((field, i) => (
                <li key={i}>
                  <FM
                    id={ai10_data.awards[i].id}
                    defaultMessage={ai10_data.awards[i].defaultMessage}
                  />
                  <div className="gender">
                    <div className="candidates heads">
                      <div className="left head">
                        <img src={`${iconPath}/male_portrait.png`} alt="" />
                        <span className="label">Male</span>
                        <span className="number">{field.gender.male}</span>
                      </div>
                      <div className="rigth head">
                        <span className="label">Female</span>
                        <span className="number">{field.gender.female}</span>
                        <img src={`${iconPath}/female_portrait.png`} alt="" />
                      </div>
                    </div>
                    <div className="lines">
                      <div className="left" style={{ width: field.gender.male }} />
                      <div className="right" style={{ width: field.gender.female }} />
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>

        <div id="media_coverage" className="part coverage">
          <FM id="ai10.home.coverage.title" defaultMessage="Media Coverage" tagName="h2" />
          <div className="desc">
            <FM
              id="ai10.home.coverage.desc"
              defaultMessage="Selected media coverages about AMiner Most Influential Scholar Award are listed below."
            />
          </div>
          <ul className="coverage_list">
            <li>
              National University of Singapore (NUS) News:&nbsp;
              <a
                target="_blank"
                href="https://www.comp.nus.edu.sg/news/news-media/2928-2019-crystal-centre-2/index.html"
              >
                AI - Most Influential Scholars
              </a>
            </li>
            <li>
              University of Pittsburgh News:&nbsp;
              <a target="_blank" href="http://sci.pitt.edu/news/03-12-2019-2/">
                Professor Peter Brusilovsky Wins AMiner Most Influential Scholar Award
              </a>
            </li>
            <li>
              IPB, University of Bonn News:&nbsp;
              <a
                target="_blank"
                href="https://www.ipb.uni-bonn.de/2019/03/2019-03-11-cyrill-stachniss-received-aminer-top-10-most-influential-scholar-award-2007-2017/"
              >
                Cyrill Stachniss Receives AMiner TOP 10 Most Influential Scholar Award (2007-2017)
              </a>
            </li>
          </ul>
          <p className="contact">
            <FM
              id="ai10.home.coverage.contact"
              defaultMessage="If you want to suggest the other fields, please contact us at  award@aminer.org ."
              values={{ email: <a href="mailto:award@aminer.org">award@aminer.org</a> }}
            />
          </p>
        </div>
      </div>
    </div>
  );
};

export default (memo(IntroPage));
