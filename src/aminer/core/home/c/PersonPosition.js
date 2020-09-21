import React from 'react';
import { SearchNameBox } from 'aminer/core/search/c/control';
import { getLocale } from 'locales';

const PersonPosition = props => {
  const { to = '', icon, placeholder } = props;
  const searchPersonAward = (aid, profile) => {
    const { id, name } = profile;
    window.open(to ? `${to}?id=${id}&lang=${getLocale()}` : `/ai2000/position?pid=${id}&name=${name}`);
  };
  return <SearchNameBox searchProfileAward={searchPersonAward} icon={icon} placeholder={placeholder} />;
};

export default PersonPosition;
