/**
 *  File Created by BoGao on 2017-06-04;
 *  Moved form aminer-web, on 2017-06-04;
 */
import { personService } from 'services/person';
import { searchService } from 'services/aminer';
import { sysconfig } from 'systems';

const {
  Profile_Interests_Show_Percent = 0.95,
  Profile_Interests_Early_Year = 1850,
  Profile_Interests_Latest_Year = 2025,
} = sysconfig;

export default {
  namespace: 'visResearchInterest',
  sizePerPageByAll: 100,

  state: {
    researchInterest: null,
    oldResearchInterest: null,
    personInterests: null,
    interest_display: 5,
    is_new_data: false,
  },

  subscriptions: {
    // setup({ dispatch, history }) {},
  },

  effects: {
    *getInterestVisData({ payload }, { call, put }) {
      const { personId } = payload;
      const data = yield call(personService.getInterestVisDatass, personId);
      yield put({ type: 'getInterestVisDataSuccess', payload: { data } });
      // return true;
    },

    *GetPersonInterestsByYear({ payload }, { call, put }) {
      yield put({ type: 'resetResearchInterest' });
      const { data } = yield call(searchService.Get, payload);

      if (data && data.errors) {
        return false;
      }
      const calc_data =
        data && data.data && data.data.data && calcInterestYearsData(data.data.data);
      let interests;
      if (calc_data) {
        interests =
          data &&
          data.data &&
          data.data.data &&
          data.data.data.map((item, index) => {
            return {
              key: item.t,
              // values: item.year,
              values: calc_data[index],
            };
          });
      }

      yield put({ type: 'getInterestsByYearDataSuccess', payload: { data: interests } });

      if (calc_data) {
        return calc_data;
      }
      return false;
    },

    *GetPersonInterests({ payload }, { call, put }) {
      const { data } = yield call(searchService.Get, payload);
      yield put({
        type: 'setPersonInterestsInfo',
        // payload: { data: data && data.data },
        payload: {
          data: data && data.data && data.data.data,
          display: data && data.data && data.data.num,
          is_new_data: data && !data.errors, // 有 errors 为 false
        },
      });
    },

    *UpdatePersonInterests({ payload }, { call, put }) {
      const { data } = yield call(searchService.UpdatePersonInterests, payload);
      if (data && data.succeed) {
        return true;
      }
      return false;
    },

    *UpdatePersonInterestsOrder({ payload }, { call, put }) {
      const { data } = yield call(searchService.UpdatePersonInterestsOrder, payload);
      if (data && data.data && data.data[0] && data.data[0].succeed) {
        return true;
      }
      return false;
      // yield put({
      //   type: 'setTrack',
      //   payload: { data: data && data.data, req: payload && payload.data },
      // });
    },

    *ResetInterests({ payload }, { call, put }) {
      const { data } = yield call(searchService.ResetInterests, payload);
      if (data && data.succeed) {
        return true;
      }
      return false;
    },

    *Calculation({ payload }, { call, put }) {
      const { data } = yield call(searchService.Calculation, payload);
      return data && data.data;
    },

    *SetScore({ payload }, { call, put }) {
      const { data } = yield call(searchService.SetScore, payload);
      if (data && data.succeed) {
        return true;
      }
      return false;
    },
  },

  reducers: {
    getInterestVisDataSuccess(state, { payload: { data } }) {
      const interests = data && data.data && data.data.interests;
      state.oldResearchInterest = {
        interests: interests && interests.slice(0, 5),
      };
    },
    getInterestsByYearDataSuccess(state, { payload: { data } }) {
      state.researchInterest = {
        interests: data,
      };
    },
    resetResearchInterest(state) {
      state.researchInterest = null;
    },
    setPersonInterestsInfo(state, { payload: { data, display, is_new_data } }) {
      state.personInterests = data;
      state.interest_display = display;
      state.is_new_data = is_new_data;
    },
    setPersonInterests(state, { payload: { data } }) {
      state.personInterests = data;
    },
    setPersonInterestDisplay(state, { payload: { display_num } }) {
      state.interest_display = display_num;
    },
    addPersonInterests(state, { payload }) {
      const interests = [...state.personInterests];
      interests.unshift(payload);
      state.personInterests = interests;
    },
    delPersonInterests(state, { payload }) {
      const { index } = payload;
      const interests = [...state.personInterests];
      interests.splice(index, 1);
      state.personInterests = interests;
    },
    moveInterestToTop(state, { payload }) {
      const { index } = payload;
      const interests = [...state.personInterests];
      const temp = interests.splice(index, 1);
      interests.unshift(temp[0]);
      state.personInterests = interests;
    },
    exchangeInterestsOrder(state, { payload }) {
      const { move1, move2 } = payload;
      const interests = [...state.personInterests];
      const temp = interests[move1];
      interests[move1] = interests[move2];
      interests[move2] = temp;
      state.personInterests = interests;
    },
  },
};

const checkOriginalDataLength = data => {
  if (!data || !data[0] || data[0].length === 0) {
    return false;
  }
  const year_length = data[0].length;
  for (let i = 1; i < data.length; i += 1) {
    if (data[i].length !== year_length) {
      return false;
    }
  }
  return true;
};

const deleteUnreliableData = data => {
  const temp = [...data];
  for (let i = 0; i < temp.length; i += 1) {
    for (let j = 0; j < temp[i].length; j += 1) {
      if (
        temp[i][j][0] < Profile_Interests_Early_Year ||
        temp[i][j][0] > Profile_Interests_Latest_Year
      ) {
        // 1850 2025
        temp[i].splice(j, 1);
      }
    }
  }
  return temp;
};

const calcInterestYearsData = data => {
  let maxLength = (data && data[0] && data[0].length) || 0;
  let fullLine = data && data[0] && data[0].year || [];
  let year_temp = data.map(item => {
    if (item && item.year && item.year.length > maxLength) {
      maxLength = item.year.length;
      fullLine = item.year;
    }
    return item.year || '';
  });

  year_temp.forEach((item, index) => {
    if (!item) {
      year_temp[index] = fullLine && fullLine.map(i => [i[0], 0]);
    }
  });
  year_temp = deleteUnreliableData(year_temp);

  if (!checkOriginalDataLength(year_temp)) {
    return null;
  }
  if (!year_temp || year_temp.length === 0) {
    return null;
  }
  let year_data_transpose = year_temp[0].map((item, index) => year_temp.map(t => t[index]));

  let interest_total = 0;
  const years = year_data_transpose.map(item => item[0][0]);
  const years_map = year_data_transpose.reduce((res, cur) => {
    const year = cur[0][0];
    const sum = cur.reduce((total, cur_num) => total + cur_num[1], 0);
    interest_total += sum;
    res[year] = sum;
    return res;
  }, {});

  const now_year = new Date().getFullYear();
  const latest_year = years[years.length - 1];
  const max_year = Math.min(now_year - 1, latest_year + 2);

  let calc_early_year = years[0];
  const year_interval = years[years.length - 1] - years[0];
  if (year_interval > 10) {
    calc_early_year = getPrecentYear({
      years,
      years_map,
      total: interest_total,
      pre: Profile_Interests_Show_Percent,
    });
  }

  let min_year = Math.max(years[0] - 3, calc_early_year - 3);

  let calc_slice_year_index;
  if (years.includes(min_year)) {
    calc_slice_year_index = years.indexOf(min_year);
  } else {
    calc_slice_year_index = years.indexOf(calc_early_year);
  }

  while (years.includes(min_year)) {
    min_year -= 1;
  }

  year_data_transpose = year_data_transpose.slice(calc_slice_year_index);

  const calc_data = calcInterestsData({
    transpose_data: year_data_transpose,
    years,
    min_year,
    max_year,
  });
  return calc_data;
};

const getPrecentYear = ({ years, years_map, total, pre }) => {
  let cur_year = years[0];
  let cur_total = 0;
  const fiducial = total * (1 - pre);

  for (let i = 0; i < years.length; i += 1) {
    cur_total += years_map[years[i]];
    if (cur_total > fiducial) {
      break;
    }
    cur_year = years[i];
  }
  return cur_year;
};

const calcInterestsData = ({ transpose_data, years, min_year, max_year }) => {
  const years_data = [...transpose_data];
  if (!years.includes(min_year)) {
    years_data.unshift(Array(transpose_data[0].length).fill([min_year, 0]));
  }
  years_data.push(Array(transpose_data[0].length).fill([max_year, 0]));

  return years_data[0].map((item, index) => years_data.map(t => t[index]));
};
