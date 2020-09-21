// Created by BoGao on 2019-15-17
// Component/Page Wrapper
import { injectIntl } from 'umi';

// parameter only alow HOC funcs.
const wrapper = (...hocs) => page => {
  let result = page;
  for (let i = hocs.length - 1; i >= 0; i -= 1) {
    if (hocs[i]) {
      result = hocs[i](result);
    }
  }
  result = injectIntl(result);
  return result;
}

const page = wrapper;
const component = wrapper;

export { page, component }
