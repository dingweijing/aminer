/*
 * @Author: your name
 * @Date: 2019-12-03 10:26:43
 * @LastEditTime: 2019-12-03 15:33:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /aminer2c/src/services/conference.js
 */
import { request, nextAPI } from 'utils';
import { apiBuilder, F, H, Action } from 'utils/next-api-builder';
import { api } from 'consts/api';

// 5de5ceff930831a1477c599c

export async function InsertArticle(payload) {
  const nextapi = apiBuilder
    .create(payload.id ? 'confs.UpdateConfArticle' : Action.conference.InsertArticle, 'InsertArticle')
    .param(payload);

  return nextAPI({ data: [nextapi.api] });
}

export async function GetArticlesByConfID(payload) {
  const { id } = payload;
  const nextapi = apiBuilder
    .create(Action.conference.GetArticlesByConfID, 'GetArticlesByConfID')
    .param({ id });

  return nextAPI({ data: [nextapi.api] });
}

export async function DeleteArticle(payload) {
  const { id, pid } = payload;
  const nextapi = apiBuilder
    .create(Action.conference.DeleteArticle, 'DeleteArticle')
    .param({ id, articles: [{ id: pid }] });

  return nextAPI({ data: [nextapi.api] });
}

export async function AuthorsVote(payload) {
  const { aid, pid, index } = payload;
  const nextapi = apiBuilder
    .create(Action.conference.AuthorsVote, 'AuthorsVote')
    .param({
      pid, vote_person_id: aid, index
    });

  return nextAPI({ data: [nextapi.api] });
}
export async function GetUsrVoted(payload) {
  const { pid, index } = payload;
  const nextapi = apiBuilder
    .create(Action.conference.GetUsrVoted, 'GetUsrVoted')
    .param({
      pid, index
    });

  return nextAPI({ data: [nextapi.api] });
}
