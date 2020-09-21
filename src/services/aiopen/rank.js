import { apiBuilder, Action } from 'utils/next-api-builder';
import { request, nextAPI } from 'utils';
import { d, rankList, mixList, dataArr } from './mockdata'

const temp = [
  {
    id: '5e15dc2d8ca974263c1c1798',
    name: 'TKDD',
    vote_id: '5e15dc2d8ca974263c1c1799'
  },
  {
    id: '5e15dc2d8ca974263c1c179a',
    name: 'ICDM',
    vote_id: '5e15dc2d8ca974263c1c179b'
  },
  {
    id: '5e15dc2d8ca974263c1c179c',
    name: 'SDM',
    vote_id: '5e15dc2d8ca974263c1c179d'
  }
]

export function getRankTree(params) {
  const nextapi = apiBuilder.create(Action.aiopen.ListMagicRankings).param(params);
  return nextAPI({ data: [nextapi.api] });
  /*   return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(d)
      }, 1500)
    }) */
}

// 获取当前节点的子节点
export function getRankChildren(params) {
  const { parentId } = params
  return new Promise((resolve, reject) => {
    const fakeData = temp.map(item => ({ ...item, id: item.id + parentId }))
    setTimeout(() => {
      resolve(fakeData)
    }, 1000)
  })
}


export async function getDomainTree(params) {
  const nextapi = apiBuilder.create(Action.aiopen.NewListDomains).param(params);
  return nextAPI({ data: [nextapi.api] });
}

// 获取首页几个list
export function getRankList(params) {
  return new Promise((resolve, reject) => {
    resolve(rankList)
  })
}


// 获取混合查询list
export function getMixList(params) {
  const nextapi = apiBuilder.create(Action.aiopen.GetDomainTopScholars).param(params);
  return nextAPI({ data: [nextapi.api] })
  // return new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     resolve(mixList)
  //   }, 1500)
  // })
}

// 获取混合查询list
export function getWorldMapData(params) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(dataArr)
    }, 1500)
  })
}

// 获取AI 2000 领域列表
export function getDomainList(params) {
  const nextapi = apiBuilder.create(Action.aiopen.GetListDomains).param(params);
  return nextAPI({ data: [nextapi.api] });
}

// 用户关注功能
export function personFollow(params) {
  const nextapi = apiBuilder.create(Action.aiopen.PersonFollow).param(params);
  return nextAPI({ data: [nextapi.api] })
}

// 获取scholars 被关注信息
export function followedScholars(params) {
  const nextapi = apiBuilder.create(Action.aiopen.FollowedScholars).param(params)
  return nextAPI({ data: [nextapi.api] })
}

// 用户取消关注
export function personUnFollow(params) {
  const nextapi = apiBuilder.create(Action.aiopen.PersonUnFollow).param(params)
  return nextAPI({ data: [nextapi.api] })
}
