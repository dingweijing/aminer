

const localSelections = {
  province: [
    '全部', '北京', '上海'
  ],
  industry: [
    '全部', '行业1', '行业2'
  ],
  type: [
    { name: '请选择排序方式', value: '' },
    { name: '按成立时间', value: '+start_time' },
    { name: '按公司规模', value: '-start_time' }]
}


const menu = [
  { title: '创新公司', href: '#', id: 'aiopen.company.menu1' },
  { title: '产业巨头', href: '#', id: 'aiopen.company.menu2' },
]

export {
  localSelections, menu
}
