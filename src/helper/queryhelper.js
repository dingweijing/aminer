// helper methods to process query object.
// query object is: { advanced: { name, org, term }, query }

import strings from 'utils/strings';

// const isEquals = (q1, q2) => true;

const isAdvEquals = (aq1, aq2) => {
  const empty1 = !aq1 || (!aq1.term && !aq1.name && !aq1.org);
  const empty2 = !aq2 || (!aq2.term && !aq2.name && !aq2.org);
  if (!aq1 && !aq2) {
    return true;
  } if (empty1 && empty2) {
    return true;
  } if (!aq1 || !aq2) {
    return false;
  }
  if (aq1.term !== aq2.term || aq1.org !== aq2.org || aq1.name !== aq2.name) {
    return false;
  }
  return true;
};

const isSimpleQueryEquals = (queryString, queryObject) => {
  if (!queryString || queryString === '-') {
    if (!queryObject || !queryObject.query || queryObject.query === '-') {
      return true;
    }
  }
  return queryString === (queryObject && queryObject.query);
};

const adv2string = queryObject => {
  const advanced = queryObject && queryObject.advanced || {};
  return strings.firstNonEmpty(advanced.term, advanced.name, advanced.org);
};

export default {
  // isEquals,
  isAdvEquals,
  isSimpleQueryEquals,
  adv2string,
};
