import { nodeBaseURL } from 'consts/api';
import { request } from 'utils';

// const nodeBaseURL = 'http://127.0.0.1:8443'
const api = {
  getLike: `${nodeBaseURL}/api/ncp/getlike?type=timeline`,
  updateLike: `${nodeBaseURL}/api/ncp/like/:id?type=timeline`,
  getData: `${nodeBaseURL}/api/ncp/timeline/search`,
  getSpecialList: `${nodeBaseURL}/api/ncp/timeline/related`,
  // getData: `http://127.0.0.1:8443/api/ncp/timeline/search`,
  getExpert: 'https://innovaapi.aminer.cn/predictor/api/v1/valhalla/experts/news/',
  getExpertAll: 'https://innovaapi.aminer.cn/covid/api/v1/experts/news'
};

export function expertClosure() {
  let expertMap = {}

  const save = (id, res) => {
    const result = res.data.data
    if (!id && Array.isArray(result)) {
      const resultMap = {}
      result.forEach(r => {
        expertMap[r.id] = r.news
        resultMap[r.id] = r.news
      })
      return resultMap
    }
      expertMap[id] = result

    return result
  }


  return {
    async getExpert(id) {
    console.log('id', id)

      if (Array.isArray(id)) { // 请求多个
        // 请求多个时，先分出来现有和没有的，把没有的请求，获得最后的数据然后与现有的合并
        const notExistId = []
        const result = {}

        id.forEach(i => {
          if (expertMap[i]) {
            result[i] = expertMap[i]
          } else {
            notExistId.push(i)
          }
        })

        if (notExistId.length) {
          return request(`${api.getExpertAll}`, {
            method: 'POST',
            data: {
              ids: notExistId,
              kw: '病毒'
            }
          }).then(res => ({ ...save(undefined, res), ...result }))
        }
          return Promise.resolve(result)
      } if (typeof id === 'string') { // 请求单个
        if (expertMap[id]) {
          return Promise.resolve(expertMap[id])
        }
        return request(`${api.getExpert}${id}?kw=病毒`, { method: 'POST' })
        .then(res => save(id, res))
      }
      return Promise.reject()
    },
    clear() {
      expertMap = null
    }
  }
}

export async function getLike() {
  return request(api.getLike);
}

export async function updateLike(params) {
  const { id } = params;
  return request(api.updateLike.replace(':id', id));
}

// 缓存专家下2000条数据
export function getData1() {
  let wholeData = []
  return function res(params) {
    const { classes = [], type = [] } = params
    if (classes.includes('allTopic') && type.includes('allType')) {
      if (!wholeData.length) {
        return request(api.getData, {
          method: 'POST',
          body: params,
        }).then(data => {
          wholeData = data.data.data.res
          return data
        }).catch(e => {
          console.error(e)
          throw e
        })
      }
      return Promise.resolve(wholeData)
    }
    return request(api.getData, {
      method: 'POST',
      body: params,
    });
  }
}

export async function getData(params) {
  return request(api.getData, {
    method: 'POST',
    body: params,
  });
}

export async function getSpecialList(params) {
  return request(api.getSpecialList, {
    method: 'POST',
    body: params,
  });
}
