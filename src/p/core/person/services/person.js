import { nextAPI } from 'utils';
import { apiBuilder, Action, F, H } from 'utils/next-api-builder';

// getPersoni will fetch person by ids using new search api.
// export async function get(payload) {
//   const { ids, schema } = payload;

//   const nextapi = apiBuilder.create('person.get', '')
//     .param({ ids })
//     .schema({ person: schema || F.fields.person_profile });
//   // H.filtersToQuery(nextapi, filters);
//   return nextAPI({ data: [nextapi.api] });
// }

export async function get(payload) {
  const { ids, schema } = payload;

  const nextapi = apiBuilder.create('personapi.get', '')
    .param({ ids })
    .schema({ person: schema || F.fields.person_profile });
  return nextAPI({ data: [nextapi.api] });
}
