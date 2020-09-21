
// const isDateWithinDays = (date, days) => {
//   var now = new Date();
//   var TwoDaysAgo = new Date();

//   //获取当前时间的毫秒数
//   var nowMilliSeconds = now.getTime();
//   //用获取毫秒数 减去两天的毫秒数 赋值给TwoDaysAgo对象（一天有86400000毫秒）
//   TwoDaysAgo.setTime(nowMilliSeconds - (2 * 86400000));

//   //通过赋值后的TwoDaysAgo对象来得到 两天前的 年月日。这里我们将日期格式化为20180301的样子。
//   //格式化日，如果小于9，前面补0
//   var day = ("0" + TwoDaysAgo.getDate()).slice(-2);
//   //格式化月，如果小于9，前面补0
//   var month = ("0" + (TwoDaysAgo.getMonth() + 1)).slice(-2);
//   //拼装完整日期格式
//   var getToday = TwoDaysAgo.getFullYear() + (month) + (day);
//   alert(getToday);  //20180227

// }

// export { isDateWithin }
