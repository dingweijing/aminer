/* eslint-disable camelcase */
import { request, nextAPI } from 'utils';
import { sysconfig } from 'systems';
import { plugins } from 'acore';
import { zhCN } from 'locales';
import { baseURL } from 'consts/api';
import { apiBuilder, F, H, Action } from 'utils/next-api-builder';

export async function searchVenue(payload) {
  const { venueNameEn, venueNameZh } = payload;
  const nextapi = apiBuilder.create(Action.venue.SearchVenue)
  .addParam({ venue_name_en: venueNameEn }, { when: venueNameEn })
  .addParam({ venue_name_zh: venueNameZh }, { when: venueNameZh })
  return nextAPI({ data: [nextapi.api], type: 'n' });
}

export async function updateVenue(payload) {
  const { id, venueNameEn, venueNameZh, alias } = payload;
  const nextapi = apiBuilder.create(Action.venue.UpdateVenue)
  .param({ id })
  .addParam({ venue_name_en: venueNameEn }, { when: venueNameEn })
  .addParam({ venue_name_zh: venueNameZh }, { when: venueNameZh || venueNameZh === '' })
  .addParam({ alias }, { when: alias })
  return nextAPI({ data: [nextapi.api], type: 'n' });
}

export async function createVenue(payload) {
  const { venueNameEn, venueNameZh, alias } = payload;
  const nextapi = apiBuilder.create(Action.venue.CreateVenue)
  .addParam({ venue_name_en: venueNameEn }, { when: venueNameEn })
  .addParam({ venue_name_zh: venueNameZh }, { when: venueNameZh || venueNameZh === '' })
  .addParam({ alias }, { when: alias })
  return nextAPI({ data: [nextapi.api], type: 'n' });
}
