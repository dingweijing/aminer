import { nextAPI } from 'utils';
import { apiBuilder, Action, F, H } from 'utils/next-api-builder';

export async function getCoData({ personId, topn = 20 }) {
    const nextapi = apiBuilder.create(Action.personRelation.GetPersonRelation, 'GetPersonRelation')
        .param({ id: personId, topn });
    return nextAPI({ data: [nextapi.api], type: 'n' });
    // return data;
}
