import React, { Fragment } from 'react';
import { Link } from 'acore';
import { sysconfig } from 'systems';
import { FM } from 'locales';
import consts from 'consts';


const iconPath = `${consts.ResourcePath}/sys/aminer/ai10/v1`;

const GenderComponent = props => {
  const { domains_gender } = props;

  const langKey = sysconfig.Locale === 'en-US' ? 'name' : 'name_zh';
  return (
    <div id="gender_of_winners" className="part gender">
      <FM id="ai2000.home.gender.title" defaultMessage="Gender of Winners" tagName="h2" />

      <ul className="list gender_list">
        {domains_gender &&
          domains_gender.map(field => (
            <li key={field.name}>
              <span>{field[langKey]}</span>
              <div className="gender">
                <div className="candidates heads">
                  <div className="left head">
                    <img src={`${iconPath}/male_portrait.png`} alt="" />
                    <span className="label">Male</span>
                    <span className="number">{`${(field.male * 100).toFixed(0)}%`}</span>
                  </div>
                  <div className="rigth head">
                    <span className="label">Female</span>
                    <span className="number">{`${(field.female * 100).toFixed(0)}%`}</span>
                    <img src={`${iconPath}/female_portrait.png`} alt="" />
                  </div>
                </div>
                <div className="lines">
                  <div className="left" style={{ width: `${field.male * 100}%` }} />
                  <div className="right" style={{ width: `${field.female * 100}%` }} />
                </div>
              </div>
            </li>
          ))}
      </ul> 
    </div>
  );
};

export default GenderComponent;
