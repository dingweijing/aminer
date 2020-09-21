import { nodeBaseURL, baseURL } from 'consts/api';
import { request, nextAPI } from 'utils';
import { apiBuilder, F, H, Action } from 'utils/next-api-builder';

export async function listTopic(params) {
  const nextapi = apiBuilder.create('mustreading.getHomeData').param(params);
  return nextAPI({ data: [nextapi.api], type: 'n' });
}

export async function setLikeTopicById(params) {
  const nextapi = apiBuilder.create('mustreading.LikeTopicById')
    .param(params);
  return nextAPI({ data: [nextapi.api], type: 'n' });
}

export async function setUnLikeTopicById(params) {
  const nextapi = apiBuilder.create('mustreading.UnLikeTopicById')
    .param(params);
  return nextAPI({ data: [nextapi.api], type: 'n' });
}

export async function getHottestTopic(params) {
  const nextapi = apiBuilder.create('mustreading.GetTopics').param(params);
  return nextAPI({ data: [nextapi.api], type: 'n' });
}
