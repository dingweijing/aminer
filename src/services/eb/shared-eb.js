import { apiBuilder, F, H, Action } from 'utils/next-api-builder';
import { nextAPI } from 'utils';
import { sysconfig } from 'systems';

export async function getShareEB({ system }) {
  const nextapi = apiBuilder.create(Action.expertbase.getShareEB, 'getShareEB')
    .param({ system });
  return nextAPI({ data: [nextapi.api] });
}

export async function getGlobalEB(payload) {
  const { offset, size } = payload;
  const filters = { terms: { is_public: [true] } };
  const nextapi = apiBuilder.create(Action.expertbase.getGlobalEB, 'getGlobalEB')
    .param({ filters, offset, size })
    .schema(F.fields.eb.forTree);
  return nextAPI({ data: [nextapi.api] });
}

export async function getGlobalEBFull(payload) {
  const { offset, size } = payload;
  const filters = { terms: { is_public: [true] } };
  const nextapi = apiBuilder.create(Action.expertbase.getGlobalEB, 'getGlobalEB')
    .param({ filters, offset, size })
    .schema(F.fields.eb.full);
  return nextAPI({ data: [nextapi.api] });
}

export async function platformGetSharedEBs(payload) {
  const { system } = payload;
  const nextapi = apiBuilder.create(Action.expertbase.PlatformGetSharedEBs, 'PlatformGetSharedEBs')
    .param({ system })
    .schema(F.fields.eb.full);
  return nextAPI({ data: [nextapi.api] });
}

export async function migrateOldRoster(payload) {
  const { system, id } = payload;
  const data = [{
    action: 'expertbase.MigrateOldRoster',
    parameters: [{ system, id }],
  }];
  return nextAPI({ data });
}

// TODO 这个api需要修改，等做好了改
export async function getPersonInfo() {
  const nextapi = apiBuilder.create('expertbase.GetLatestExpertbaseBuyerInfo', '')
    .param({ size: 1, offset: 0 })
    .schema({
      expertbase_buyer: ['name', 'email', 'tel', 'company', 'department', 'remarks', 'position',
        'created_time', 'updated_time'],
    });
  return nextAPI({ data: [nextapi.api] });
}

export async function savePersonInfo(payload) {
  const { data } = payload;
  const {
    name, tel, email, company, department, position, remarks, ebid, eb_name,
  } = data;
  const opts = [{
    fields: H.createFieldsArray({
      name,
      tel,
      email,
      company,
      department,
      position,
      remarks,
      ebid,
      eb_name,
    }),
  }];
  const nextapi = apiBuilder.create('expertbase.AlterExpertbaseBuyerInfo', '')
    .param({ opts });
  return nextAPI({ data: [nextapi.api] });
}

export async function addSharedEB({ ebid }) {
  if (ebid) {
    const type = sysconfig.Add_ShareEB_To_Person ? 'person' : 'system';
    const nextapi = apiBuilder.create('expertbase.AddSharedEB', '')
      .param({ ebids: [ebid], type });
    console.log('l;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;')
    const resp = nextAPI({ data: [nextapi.api] });
    console.log('l;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;', resp)
    return resp
  }
  return null;
}

// add by gb
export async function removeSharedEB({ ebid }) {
  if (ebid) {
    const nextapi = apiBuilder.create('expertbase.RemoveSharedEB', '')
      .param({ ebids: [ebid] });
    return nextAPI({ data: [nextapi.api] });
  }
  return null;
}

export async function UpdateShareExperBaseByID(payload) {
  const { data } = payload;
  const {
    id, name, name_zh, desc, desc_zh, is_public, report_link, price, tags,
  } = data;
  const opts = [{
    operator: 'upsert',
    fields: H.createFieldsArray({
      id,
      name,
      name_zh,
      desc,
      desc_zh,
      is_public,
      report_link,
      price,
      tags,
    }),
  }];
  const nextapi = apiBuilder.create(Action.expertbase.Alter, 'Alter')
    .param({ opts });
  return nextAPI({ data: [nextapi.api] });
}

export async function getGlobalEbByFilter(payload) {
  const nextapi = apiBuilder.create(Action.expertbase.getGlobalEB, 'getGlobalEB')
    .param(payload)
    .schema(F.fields.eb.full);
  return nextAPI({ data: [nextapi.api] });
}

export async function getExpertbaseOrder(payload) {
  const { ids } = payload;
  const nextapi = apiBuilder.create('expertbase.GetExpertbaseOrderStats', '')
    .param({ ids });
  return nextAPI({ data: [nextapi.api] });
}

export async function createEbOrder(payload) {
  const { ebInfo } = payload;
  const { ebid, eb_name, email, name, price, stats } = ebInfo;
  const opts = [{
    fields: H.createFieldsArray({
      ebid,
      stats,
      eb_name,
      email,
      price,
      buyer_name: name,
    }),
  }];
  const nextapi = apiBuilder.create('expertbase.AlterExpertbaseOrder', '')
    .param({ opts });
  return nextAPI({ data: [nextapi.api] });
}

export async function getSectionPerson(payload) {
  const { id, size } = payload;
  const nextapi = apiBuilder.create('expertbase.search.GetExpertbasePersonPreviewInfo', '')
    .param({ size, searchType: 'all', dims: { eb: [id] } })
    .schema({ person: F.fields.person_in_PersonList });
  return nextAPI({ data: [nextapi.api] });
}

export async function updateStats(payload) {
  const { ids } = payload;
  const nextapi = apiBuilder.create('expertbase.UpdateStats', '')
    .param({ ids });
  return nextAPI({ data: [nextapi.api] });
}

export async function getEbOrders(payload) {
  const nextapi = apiBuilder.create('expertbase.GetExpertbaseOrder', 'getEbOrders')
    .param({ size: 1000, offset: 0 })
    .schema(F.fields.eb.fullOrder);
  return nextAPI({ data: [nextapi.api] });
}
