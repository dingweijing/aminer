import { newsUrl } from 'consts/api';
import { request } from 'utils';

export async function searchNews(params) {
  const { word, endDate, page } = params;
  return request(
    `https://api2.newsminer.net/svc/xlore/queryRelatedNews?words=${word}&endDate=${endDate}&size=20&page=${page}`
  );
}

// https://api2.newsminer.net/svc/xlore/queryRelatedNews?words=%E7%89%B9%E6%9C%97%E6%99%AE&startDate=2019-07-14&endDate=2019-08-14&size=20&page=3
