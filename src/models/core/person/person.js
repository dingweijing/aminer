/* eslint-disable no-restricted-syntax */
import { F } from 'utils/next-api-builder';
import * as personService from 'services/personService';
import * as newPersonService from 'p/core/person/services/person';
import * as expertBaseService from '@/services/eb/expert-base';

// mode: [list|profile|annotation|super]
const determinPersonSchema = mode => {
  let schema;
  switch (mode) {
    case 'profile':
      schema = F.fields.person_profile
      break;
    case 'annotation':
      schema = F.fields.person_annotation
      break;
    case 'super':
      schema = F.fields.person_super
      break;
    case 'list':
      break;
    case 'smalllist': // used in paper homepage sidebar authors.
      schema = F.fields.person_in_SmallList
      break;
    default:
      schema = F.fields.person_in_PersonList // default list
  }
  return schema
}


export default {
  namespace: 'person',

  state: {},

  subscriptions: {},

  effects: {
    // refactor by bo gao.

    // get person by id.
    * getPerson({ payload }, { call }) {
      const { id, pure, mode } = payload;
      const schema = determinPersonSchema(mode)
      const { success, data } = yield call(newPersonService.get, { ids: [id], schema });
      if (success && data) {
        if (data.succeed && data.items) {
          if (data.items.length > 0) {
            const person = data.items[0];
            if (pure) {
              return person
            }
          }
          // yield put({ type: 'getPersonsSuccess', payload: { person1, person2 } });
        }
      }
      return null
    },

    // get persons by id list.
    * getPersons({ payload }, { call }) {
      const { ids, pure, mode, schema = determinPersonSchema(mode) } = payload; // mode: [list|profile|annotation]

      const { success, data } = yield call(newPersonService.get, { ids, schema });
      if (success && data) {
        if (data.succeed && data.data) {
          if (pure) {
            return data.data;
          }
        }
      }
      return null
    },

    // 获取两个人，返回按照顺序的两人.
    * getPersonPair({ payload }, { call, put }) {
      const { id1, id2, mode, pure } = payload;
      const schema = determinPersonSchema(mode)
      const { success, data } = yield call(newPersonService.get, { ids: [id1, id2], schema });
      if (success && data) {
        if (data.succeed && data.items) {
          let person1;
          let person2;
          for (const person of data.items) {
            if (person && person.id === id1) {
              person1 = person;
            } else if (person && person.id === id2) {
              person2 = person;
            }
          }
          if (pure) {
            return [person1, person2];
          }
          // yield put({ type: 'getPersonsSuccess', payload: { person1, person2 } });
        }
      }
      return null;
      // not success
      // yield put({ type: 'getPersonsSuccess', payload: { person1: null, person2: null } });
    },


    // !----------[... Checking Line by BoGao ...]-----------------------------------------------

    // 根据名字和单位寻找专家列表，带分页。
    * choosePerson({ payload }, { select, call }) {
      const { name, org, offset, size } = payload;
      const { data } = yield call(personService.choosePerson, name, org, offset, size);
      if (data && data.succeed) {
        return data;
      }
      return null;
    },


    // 根据短名是读取人的id。
    * getProfile({ payload }, { select, call }) {
      const { short_name, aid } = payload;
      const { data } = yield call(personService.getProfile, { short_name, aid });
      if (data && data.items && data.items[0]) {
        return data.items[0];
      }
    },

    // 根据url短名是否存在。
    * CheckShortName({ payload }, { select, call }) {
      const { short_name } = payload;
      const { data } = yield call(personService.CheckShortName, { short_name });
      if (data && data.items && data.items[0]) {
        return data.items[0].isExist;
      }
    },

    // 设置profile url短名
    * setShortName({ payload }, { select, call }) {
      const { short_name, real_name, aid } = payload;
      const { data } = yield call(personService.setShortName, { real_name, short_name, aid });
      if (data && data.succeed) {
        return true;
      }
      return false;
    },

    // 设置profile External Links  // api后端已经删除
    // * setExternalLinks({ payload }, { select, call }) {
    //   const { id, links } = payload;
    //   const { data } = yield call(personService.setExternalLinks, { id, links });
    //   if (data && data.succeed) {
    //     return true;
    //   }
    //   return false;
    // },

    // 获取profile External Links
    * getExternalLinks({ payload }, { select, call }) {
      const { ids } = payload;
      const { data } = yield call(personService.getExternalLinks, { ids });
      if (data && data.items && data.items[0] && data.items[0].links) {
        return data.items[0].links;
      }
      return false;
    },

    * addNewExpert({ payload }, { put, call }) {
      const { ebid, expert } = payload;
      const { data } = yield call(personService.addNewExpert, expert);
      if (data && data.items && data.items[0]) {
        const addRes = yield call(expertBaseService.addExpertToEB, {
          payload: {
            aids: data.items,
            ebid: [ebid],
          },
        });
        if (addRes.status || addRes.succeed) {
          return true;
        }
        return false;
      }
      return false;
    },

  },

  reducers: {},

};
