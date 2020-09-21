import { nextAPI } from 'utils';
import { apiBuilder, Action, F, H } from 'utils/next-api-builder';

export async function UpdatePersonProfile(payload) {
  const { id, fields } = payload;
  // const opts = [{
  //   operator: 'upsert',
  //   fields: H.createFieldsArray(fields),
  // }];
  const nextapi = apiBuilder.create('personedit.UpdateProfile', 'UpdateProfile')
    .param({ id, fields: H.createFieldsArray(fields) });
  return nextAPI({ data: [nextapi.api] });
}
