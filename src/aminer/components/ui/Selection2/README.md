| prop name      | type         | required | description             |
| -------------- | ------------ | -------- | ----------------------- |
| options        | Array\<Opts> | ✅       | 选项（具体见下）        |
| selectedKeys   | Object       | -        | 已经选择的选项,默认为{} |
| onSelectChange | Function     | ✅       | 回调，返回变动的值      |

### Opts:

| prop name | type            | required | description                |
| --------- | --------------- | -------- | -------------------------- |
| label     | string          | -        | 筛选项标题，不写不显示冒号 |
| key       | string          | ✅       | 最终结果中的 key           |
| opts      | Array\<SubOpts> | ✅       | 选项                       |
| single    | boolean         | -        | 是否为单选，默认多选       |

### SubOpts:

| prop name | type   | required | description            |
| --------- | ------ | -------- | ---------------------- |
| label     | string | ✅       | 筛选项标题（英文）     |
| label_zh  | string | ✅       | 筛选项标题(中文)       |
| value     | any    | -        | 选项，不写默认为 label |
