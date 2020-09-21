

const geo = [
  { latitude: 30.67, longitude: 104.07 },
  { latitude: 34.76, longitude: 113.65 },
  { latitude: 29.65, longitude: 91.13 },
  { latitude: 43.82, longitude: 87.62 }
]

const cityMap = {
  舟山: { lat: 122.207216, long: 29.985295, id: '1', in_num: 99, out_num: 8 },
  上海: { lat: 121.48, long: 31.22, id: '2', in_num: 99, out_num: 8 },
  齐齐哈尔: { lat: 123.97, long: 47.33, id: '3', in_num: 99, out_num: 8 },

}

const linesData = [
  { fromName: '舟山', toName: '齐齐哈尔', num: 1 },
  { fromName: '上海', toName: '舟山', num: 100 },
]


export { cityMap, geo, linesData }
