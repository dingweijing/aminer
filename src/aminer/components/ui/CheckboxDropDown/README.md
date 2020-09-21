| prop name   | type          | required | description        |
| ----------- | ------------- | -------- | ------------------ |
| options     | Array<Opts>   | ✅       | 下拉框中的选项     |
| onChange    | Function      | ✅       | 回调，返回变动的值 |
| checkedKeys | Array<String> | -        | 选中的值           |

### Opts:

| prop name | type   | required | description        |
| --------- | ------ | -------- | ------------------ |
| label     | string | ✅       | 最终结果中的 key   |
| value     | string | ✅       | 最终结果中的 value |
