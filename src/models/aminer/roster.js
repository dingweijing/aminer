import { sysconfig } from 'systems';
import { statsService } from 'services/aminer';


export default {

  namespace: 'roster',

  state: {
    stats: [],
    rosterAward: [],
    recRoster: []
  },

  subscriptions: {},

  effects: {
    * getStats({ payload }, { call }) {
      const { data } = yield call(statsService.getStats);
      if (data) {
        return data;
      }
      return null;
    },
    * getNewStats({ payload }, { call }) {
      const { data } = yield call(statsService.getNewStats);
      if (data) {
        return data.items[0];
      }
      return null;
    },
    * getAwardRosterPersons({ payload }, { call }) {
      const { data } = yield call(statsService.getAwardRosterPersons);
      if (data) {
        return data;
      }
      return null;
    },
    * getRecRoster({ payload }, { call }) {
      const { data } = yield call(statsService.getRecRoster);
      if (data) {
        return data;
      }
      return null;
    },

    * getRosterList({ payload }, { call }) {
      const { data, success } = yield call(statsService.getRosterList, payload)
      if (success) {
        const rosterIds = []
        data.data &&
        data.data.length > 0 &&
        data.data.map(item => {
          rosterIds.push(item.id);
        });
        const dataByNotes = yield call(statsService.getNotesFromRosters, payload={ids: rosterIds} )
        const notesObj = {}
        if (dataByNotes.data){
          dataByNotes.data.items && dataByNotes.data.items.length>0 && dataByNotes.data.items.filter(item => 'note' in item).map((item)=>{notesObj[item.id]= item.note});
          // console.log("notesObj-----",notesObj)
        }
        data.data.map(roster=>{
          // console.log("notesObj[roster.id]----",notesObj[roster.id])
          return roster.note = notesObj[roster.id]
        })
        // console.log("data-dasfddf---------",data)
        return data;
      }
      return false;
    },

  },

  reducers: {

  },

};
