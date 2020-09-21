// 自行配置API地址，本文件为样例文件，请复制并生成 .apiconfig.js
const nextAPIURLOnlineProduction = 'https://apiv2.aminer.cn';
const nextAPIURLLocalhost = 'http://localhost:4005';
const nextAPIURLOnlineBeta = 'https://apiv2-beta.aminer.cn';
const nextAPIURLZw = 'https://apikjb.aminer.cn';
const nextAPIURL = process.env.NODE_ENV !== 'production'
  ? // ! 开发模式配置
  // nextAPIURLOnlineBeta
  nextAPIURLOnlineProduction
  // nextAPIURLLocalhost
  // nextAPIURLZw

  : // ! 线上模式配置
  // nextAPIURLOnlineBeta;
  nextAPIURLOnlineProduction;
// nextAPIURLZw;

module.exports = { nextAPIURL }
