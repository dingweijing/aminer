/* eslint-disable camelcase */
import { request, nextAPI } from 'utils';
import { sysconfig } from 'systems';
import { plugins } from 'acore';
import { zhCN } from 'locales';
import { baseURL } from 'consts/api';
import { apiBuilder, F, H, Action } from 'utils/next-api-builder';

export async function searchOrg(payload) {
  const { orgNameEn, orgNameZh } = payload;
  const nextapi = apiBuilder.create(Action.org.SearchOrg)
  .addParam({ org_name_en: orgNameEn }, { when: orgNameEn })
  .addParam({ org_name_zh: orgNameZh }, { when: orgNameZh })
  return nextAPI({ data: [nextapi.api], type: 'n' });
}

export async function updateOrg(payload) {
  const { id, orgNameEn, orgNameZh, alias } = payload;
  const nextapi = apiBuilder.create(Action.org.UpdateOrg)
  .param({ id })
  .addParam({ org_name_en: orgNameEn }, { when: orgNameEn })
  .addParam({ org_name_zh: orgNameZh }, { when: orgNameZh || orgNameZh === '' })
  .addParam({ alias }, { when: alias })
  return nextAPI({ data: [nextapi.api], type: 'n' });
}

export async function createOrg(payload) {
  const { orgNameEn, orgNameZh, alias } = payload;
  const nextapi = apiBuilder.create(Action.org.CreateOrg)
  .addParam({ org_name_en: orgNameEn }, { when: orgNameEn })
  .addParam({ org_name_zh: orgNameZh }, { when: orgNameZh || orgNameZh === '' })
  .addParam({ alias }, { when: alias })
  return nextAPI({ data: [nextapi.api], type: 'n' });
}
