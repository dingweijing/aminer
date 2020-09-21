import { request } from 'utils';
import { api } from 'consts/api';

export async function suggest(query) {
  return request(api.searchSuggest.replace(':query', query), { method: 'GET' });
}

export async function nameSuggest(query) {
  return request(api.searchNameSuggest.replace(':query', query), { method: 'GET' });
}
