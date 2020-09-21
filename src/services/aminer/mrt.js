/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-09 12:40:00
 * @LastEditTime: 2019-08-29 14:58:31
 * @LastEditors: Please set LastEditors
 */
import { baseURL } from 'consts/api';
import { request, nextAPI } from 'utils';
import { apiBuilder, F, H, Action } from 'utils/next-api-builder';
import { sysconfig } from 'systems';

export async function createPaperMRT(payload) {
  const { publication_id, data_source } = payload;
  const nextapi = apiBuilder.create(Action.masterreadingtree.CreateMrt)
    .addParam({ publication_id }, { when: publication_id  })
    .addParam({ data_source }, { when: data_source  });
  return nextAPI({ data: [nextapi.api] });
}

export async function getPaperMRTById(payload) {
  const { ids } = payload;
  const nextapi = apiBuilder.create(Action.masterreadingtree.GetMrtByIDs)
    .addParam({ ids }, { when: ids  });
  return nextAPI({ data: [nextapi.api] });
}

export async function addPaperMRTSponsor(payload) {
  const { id } = payload;
  const nextapi = apiBuilder.create(Action.masterreadingtree.AddSponsor)
    .addParam({ id }, { when: id  });
  return nextAPI({ data: [nextapi.api] });
}

// TODO: check again
export async function getPaperMRTBySponsors(payload) {
  const { sponsors, pagination = {} } = payload;
  const current = pagination.current || 1;
  const pageSize = pagination.pageSize || 20;
  const nextapi = apiBuilder.create(Action.masterreadingtree.GetMrtBySponsors)
    .param({
      offset: (current - 1) * pageSize,
      size: pageSize,
    })
    .addParam({ sponsors });
  return nextAPI({ data: [nextapi.api] });
}

export async function createMRTUserEdit(payload) {
  const { tree_id, edit_data } = payload;
  const nextapi = apiBuilder.create(Action.masterreadingtree.CreateOrUpdateMrtUserEdit)
    .addParam({ tree_id }, { when: tree_id  })
    .addParam({ edit_data }, { when: edit_data  });
  return nextAPI({ data: [nextapi.api] });
}

export async function getMRTUserEdit(payload) {
  const { tree_id } = payload;
  const nextapi = apiBuilder.create(Action.masterreadingtree.getMRTUserEdit)
    .addParam({ tree_id }, { when: tree_id  });
  return nextAPI({ data: [nextapi.api] });
}

export async function addOrCancelMRTLike(payload) {
  const { id, like } = payload;
  const nextapi = apiBuilder.create(Action.masterreadingtree.AddOrCancelLike)
    .param({
      like
    })
    .addParam({ id }, { when: id  });
  return nextAPI({ data: [nextapi.api] });
}

export async function getMrtCompleted(payload) {
  const { pagination, sorts } = payload;
  const nextapi = apiBuilder.create(Action.masterreadingtree.GetMrtCompleted)
    .param({
      offset: pagination && (pagination.current - 1) * pagination.pageSize || 0,
      size: pagination && pagination.pageSize || 20,
    })
    .addParam({ sorts }, { when: sorts});
  return nextAPI({ data: [nextapi.api] });
}

export async function getMrts(payload) {
  const { pagination, sorts, filters, fields } = payload;
  const nextapi = apiBuilder.create(Action.masterreadingtree.GetMrtByConditions)
    .param({
      offset: pagination && (pagination.current - 1) * pagination.pageSize || 0,
      size: pagination && pagination.pageSize || 20,
    })
    .addParam({ sorts }, { when: sorts })
    .addParam({ filters }, { when: filters })
    .addParam({ fields }, { when: fields });
  return nextAPI({ data: [nextapi.api] });
}

export async function addMrtClickNum(payload) {
  const { id } = payload;
  const nextapi = apiBuilder.create(Action.masterreadingtree.AddClickNum)
    .addParam({ id }, { when: id  });
  return nextAPI({ data: [nextapi.api] });
}

export async function getMrtByPaperIDs(payload) {

  const { ids } = payload;
  const nextapi = apiBuilder.create(Action.masterreadingtree.GetMrtByPublicationIDs)
    .addParam({ ids }, { when: ids  });
  return nextAPI({ data: [nextapi.api] });
}
