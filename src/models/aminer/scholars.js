/* eslint-disable no-param-reassign */

import { sysconfig } from 'systems';
import { scholarsService, statsService } from 'services/aminer';
import { takeLatest } from 'utils/helper';

export default {

  namespace: 'scholars',

  state: {
    topList: [],
    ids: [],
    realid: ''
  },

  subscriptions: {},

  effects: {

    * getRosterAwardOverview({ payload }, { call }) {
      const { data } = yield call(scholarsService.getRosterAwardOverview, payload);
      if (data) {
        return data;
      }
      return null;
    },

    * getAwardRosterPersons({ payload }, { call }) {
      const { data } = yield call(scholarsService.getAwardRosterPersons, payload);
      if (data) {
        return data;
      }
      return null;
    },


    * following({ payload }, { put, call }) {
      const { id } = payload;
      const { status } = yield call(scholarsService.followSocial, { pid: id });

      yield put({
        type: 'changeFollow',
        payload: { id }
      });
    },

    * unfollow({ payload }, { put, call }) {
      const { id } = payload;
      const { status } = yield call(scholarsService.unfollowSocial, { pid: id });
      yield put({
        type: 'changeFollow',
        payload: { id }
      });
    },

    * voteup({ payload }, { put, call }) {
      const { tid, id, is_upvoted } = payload;
      // const { is_upvoted } = this.state.topList[id]
      if (!is_upvoted) {
        const { status } = yield call(scholarsService.voteSocial, {
          id: tid, aid: id, oper: 'up'
        });
      } else {
        const { status } = yield call(scholarsService.unvoteSocial, {
          id: tid, aid: id, oper: 'up'
        });
      }

      yield put({
        type: 'addvote',
        payload: { id }
      });
    },

    * votedown({ payload }, { put, call }) {
      const { tid, id, is_downvoted } = payload;
      // const { is_downvoted } = state.topList[id]
      if (!is_downvoted) {
        const { status } = yield call(scholarsService.voteSocial, {
          id: tid, aid: id, oper: 'down'
        });
      } else {
        const { status } = yield call(scholarsService.unvoteSocial, {
          id: tid, aid: id, oper: 'down'
        });
      }

      yield put({
        type: 'redvote',
        payload: { id }
      });
    }
  },

  reducers: {
    changeRid(state, { payload: { rid } }) {
      state.realid = rid;
    },

    changeFollow(state, { payload: { id } }) {
      const { is_following } = state.topList[id];
      if (!is_following) {
        state.topList[id].num_followed += 1;
      } else {
        state.topList[id].num_followed -= 1;
      }
      state.topList[id].is_following = !is_following;
    },

    addvote(state, { payload: { id } }) {
      const { is_upvoted } = state.topList[id];
      state.topList[id].is_downvoted = false;
      state.topList[id].is_upvoted = !is_upvoted;
      if (!is_upvoted) {
        state.topList[id].num_upvoted += 1;
      } else {
        state.topList[id].num_upvoted -= 1;
      }
    },

    redvote(state, { payload: { id } }) {
      if (state.topList[id].is_upvoted) {
        state.topList[id].num_upvoted -= 1;
        state.topList[id].is_upvoted = false;
      }
      state.topList[id].is_downvoted = !state.topList[id].is_downvoted;
    }
  }
};
