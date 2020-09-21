export {
  获取Domains列表,
}

const 获取Domains列表 = [
    {
        "action": "aiglobal.NewListDomains",
        "parameters": {
            "year": 2019,
            // types 可填"All Areas","AI 2000","Jconf",之后若有其他分类会陆续添加
            "types": [
                "All Areas",
            ],
            // page_type 可选scholars(对应学者列表的页面),rankings(对应现在要写的树形rankings页面)
            "page_type": "rankings"
        }
    }
]
// 详细说明：
// 1 NewListDomains 要替换掉原有的aiglobal.ListDomains
// 2 types 合法选项["All Areas","AI 2000","Jconf"]
// 在学者列表页面中，types填["AI 2000"]
// 在rankings页面中，左边domains树形列表若选"Areas"，则填["All Areas"],若选"Conferences and Journals"则填["Jconf"]
// 3 page_type 合法选项["scholars","rankings"],此字段用于区分读取字段，两个页面所需字段集合不同
// 4 year 目前默认填2019即可
