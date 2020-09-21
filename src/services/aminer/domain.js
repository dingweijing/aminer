import { baseURL } from 'consts/api';
import { request, nextAPI } from 'utils';
import { apiBuilder, F, H, Action } from 'utils/next-api-builder';
import { sysconfig } from 'systems';

export async function getAllDomains(payload) {
  const { offset = 0, size = 100 } = payload;
  const nextapi = apiBuilder
    .create(Action.domains.all)
    .param({ offset, size })
    .addParam({ views: ['aminer'] }, { when: true })
    .schema({
      domain: [
        {
          display_name: ['cn', 'en'],
        },
        'domain_id',
        'order',
        {
          stats: ['paperCount', 'jconfTotal'],
        },
      ],
    });
  return nextAPI({ data: [nextapi.api] });
}

export async function getDomainInfoAndKeywordTrend(payload) {
  const { sids } = payload;
  const nextapi = apiBuilder.create(Action.domains.GetDomains).addParam({ sids }, { when: sids });
  return nextAPI({ data: [nextapi.api] });
}

export async function getDomainPaperTrend(payload) {
  const { sids } = payload;
  const nextapi = apiBuilder
    .create(Action.domains.GetDomainPaperTrend)
    .addParam({ sids }, { when: sids });
  return nextAPI({ data: [nextapi.api] });
}

export async function getDomainHotTopicAndTopRank(payload) {
  const { sids, topicSize = 20, topSize = 50 } = payload;
  const nextapi = apiBuilder
    .create(Action.domains.GetTopicOfDomain)
    .param({ topicSize, topSize })
    .addParam({ sids }, { when: sids });
  return nextAPI({ data: [nextapi.api] });
}

export async function getTopAuthorsOfDomain(payload) {
  const { sids, topSize = 50, byTime, byMetric } = payload;
  const nextapi = apiBuilder
    .create(Action.domains.GetTopAuthorsOfDomain)
    .param({ topSize, byTime, byMetric })
    .addParam({ sids }, { when: sids })
    .schema({ person: F.fields.domain.topAuthor });
  return nextAPI({ data: [nextapi.api] });
}

// GetTopicOfDomain

export async function PersonDomainsDistrebution(payload) {
  // const { sids, topSize = 50, byTime, byMetric } = payload;
  const nextapi = apiBuilder.create(Action.domains.PersonDomainsDistrebution).param(payload);
  // .addParam({ sids }, { when: sids })
  // .schema({ person: F.fields.domain.topAuthor });
  return nextAPI({ data: [nextapi.api] });
}
