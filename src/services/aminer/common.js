import { sysconfig } from 'systems';
import { nodeBaseURL, baseURL } from 'consts/api';
import { request, nextAPI } from 'utils';
import { apiBuilder, Action } from 'utils/next-api-builder';


export async function Track(params) {
  const { data } = params;
  const nextapi = apiBuilder.create(Action.tracking.Track, 'Track')
    .param(params);
  return nextAPI({ data: [nextapi.api] });
}
