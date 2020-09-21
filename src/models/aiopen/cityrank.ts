import { sysconfig } from 'systems';
import { personSearchService } from 'services/aminer/search';
// import { translateService } from 'services/misc';
// import { topicService } from 'services/topic';
import {message} from 'antd'
import { toJSON } from 'lodash';
import {  getRankList,getAuthorList,CityRankMoodEvent} from 'services/aiopen/cityrank'
import cookies from 'utils/cookie';

/* eslint-disable no-param-reassign */

const setIdCookie=(id,poll)=>{
  const pollCityMap=cookies.getCookie('pollCityMap')||{}
  pollCityMap[id]=poll
  console.log(pollCityMap)
  cookies.setCookie('pollCityMap', pollCityMap, '/', 1);
}

let originList=[]

export default {
  namespace: 'cityrank',
  state:{
    list:[],
    starListMap:{}, // 收藏的城市列表
    searchList:[],
    authorList:[]
  },
  reducers:{
    randomSelect(state:any,{payload}:{payload:any}){
      const {key,value}=payload

    },
    search(state:any,{payload}:{payload:any}){
    const {text}=payload
    if(!text){
      state.list=originList
      return;
    }
    const t=text.toLowerCase()
    const searchList=originList&&originList.filter(item=>item.name_zh.includes(text)||item.name.toLowerCase().includes(t)||item.country.includes(t))
    state.list=searchList
    },
    updateState(state:any,{payload}:{payload:any}){
      const {key,value}=payload
      state[key]=value
    },
    pollCity(state:any,{payload}:{payload:any}){
      const {list}=state
      const {id,poll,idx}=payload
      setIdCookie(id,poll)
      if(list.length){
        console.log('idx',idx)
        console.log('list[idx]',list[idx])
        list[idx].mypoll=poll
        state.list=list
      }
    },
    getLocalStorage(state:any,{payload}:{payload:any}){
      const {key,value}:{key:string,value:any}=payload
      const data:(string|null)=localStorage.getItem(key)
      if(data){
        state[key]=toJSON(data)
      }
    },
    toggleStarList(state:any,{payload}:{payload:any}){
      const {id,value}=payload
      const {starListMap}=state
      if(starListMap[id]){
        delete starListMap[id]
      }else{
        starListMap[id]=value
      }
      message.success('ok')
      state.starListMap=starListMap
      // localStorage.setItem('cityStar',JSON.stringify(starListMap))
    }
  },
  effects:{
    *getRankList({ payload }, { call, put }){ // 获取榜单列表
      const {data }= yield call(getRankList,{type:'Top 500'})
      if(data.item){
        yield put({ type: 'updateState', payload: {key:'list',value:data.item} });
        originList=data.item
      }
    },
    *getAuthorList({ payload }, { call, put }){ // 获取榜单列表
      const {id}=payload
      const data= yield call(getAuthorList,{id})
      console.log('data',data)
      /* if(data){
        yield put({ type: 'updateState', payload: {key:'authorList',value:data} });
      } */
    },
    *CityRankMoodEvent({ payload }, { call, put }){ // 获取榜单列表
      const {id,poll,idx}=payload
      const {data}= yield call(CityRankMoodEvent,{id,mood:poll<0?'dislike':'like'})
      yield put({ type: 'pollCity', payload  });
    },
  }
}
