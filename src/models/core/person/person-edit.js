import { F } from 'utils/next-api-builder';
import * as personEditService from 'p/core/person/services/person-edit';
// import * as expertBaseService from '@/services/eb/expert-base';

export default {
  namespace: 'person-edit',

  state: {},
  subscriptions: {},

  effects: {
    // edit person basic info.
    * updatePersonBasic({ payload }, { call }) {
      const { id, fields } = payload;
      const { success, data } = yield call(personEditService.UpdatePersonProfile, { id, fields });
      if (data && data.succeed) {
        return data && data.succeed;
      }
      return null;
    },
  },

  reducers: {},
}
