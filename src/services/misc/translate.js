/**
 * Created by BoGao on 2017/8/29.
 */
import { request } from 'utils';
import { api } from 'consts/api';

export async function translateTerm(term) {
  return request(api.translateTerm.replace(':term', term), { method: 'GET' });
}
