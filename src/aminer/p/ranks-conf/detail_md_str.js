const md = `
*These metrics are our newly defined indexes that valued relatively different traits of ranking process. You are welcomed to choose whichever index you prefer and looking for the ranking outcome under this specific index.

## H5 Index

H5-index is the largest number h such that h articles published in [the past 5 years] have at least h citations each.

Reference: https://scholar.google.com/intl/en/scholar/metrics.html#metrics

## H5 Median

h5-median is based on h5-index, but instead measures the median value of citations for the h number of citations.

Reference: https://scholar.google.com/intl/en/scholar/metrics.html#metrics

## *TK5 Index

TK5 Index is defined to quantitively reflect the conference's standard by its top papers. As we can see by its definition, H5-index is easily influenced by the number of papers a conference/journal accept. To exclude this effect and evaluate a conference better, we introduced TK5-median where it takes the top 10 citation papers of a conference in the past 5 years and for each of the 10 papers, calculate its tk5-value by finding all papers that cited it and get an h-index. Then we use the median value of the 10 tk5-values, which is defined as tk5-median, formally
TK(A) = top k citation papers of a conference A in the past 5 years

![](https://originalfileserver.aminer.cn/data/ranks/tk5.png)


In the definition, we specifically set K = 10 to acquire a better consequence.

## *Rising Index
Generally speaking, conference that always remain a highly active status should score better than conference that accept papers with a decreasing yearly citation number. Therefore, we define rising-index to quantitively evaluate the degree of uptrend for a specific conference. It takes the top 100 citation papers of a conference in the recent 5 years and filter out those with a decreasing yearly citation, then set the index as the h5 value of the filtered set. Formally,

![](https://originalfileserver.aminer.cn/data/ranks/rising.png)


## *Basic Research Creativity Index

For all papers in a conference in the most recent 5 years, we investigated on the organization of a paper’s first author and divided them into groups. For all the organizations that are or part of academic institutions, we viewed them as belonging to the academic community, which more often focused on the basic research fields. Average of these papers’ citation number is taken as Basic Research Creativity Index.

## *Applied Research Creativity Index

For all papers in a conference in the most recent 5 years, we researched on the organization of a paper’s first author and divided them into groups. For all the organizations that are part of industrial institutions or companies, we viewed them as belonging to the industrial community, which more often focused on the applied research fields. Average of these papers’ citation number is taken as Applied Research Creativity Index.

Note: These creativity indexes are representations of the current development status of basic research and applied research. Hence comparing them provides a new way of seeing different innovation aspects within a conference/journal. They are different to other metrics as they do not evaluate the conference/journal as a whole.

## How do we get our Radar Map?

Among the 600 conferences and journals, we take the highest value under each of these indexes as the maximum edge of the radar map. Then, we set up the minimum to be slightly above zero, as shown in the graph below. All conferences and journals are drawn by their own values in proportion to the maximum as well as the minimum.

![](https://originalfileserver.aminer.cn/data/ranks/811598235760_.pic.jpg)

If you have any questions, please feel free to contact [aiopen@aminer.cn](aiopen@aminer.cn).
`

const md_zh = `

*我们在期刊会议评价方面提出了新改进与新想法，用户可以根据不同指标的特性，自主选择他们看重的特征，进行期刊会议的排名查看，希望能够给大家更多的参考指南。

## H5指数
H5指数是过去五年内该会议的所有文章中，满足有h篇文章的引用量不小于h的，最大的满足条件的h就是这个会议的H5指数 例：一个会议近五年有10篇文章，它们的引用量分别为10,8,8,7,6,6,4,3,2,1 那么这个会议的H5指数就是6


参考：https://scholar.google.com/intl/en/scholar/metrics.html#metrics


## H5 中位数

H5 中位数是基于 H5 指数的，它描述的是该会议前[H5 指数]篇文章引用量的中位数 例：同上，因为这个会议的 H5 指数是 6，所以 H5 中位数为 10,8,8,7,6,6 的中位数，即为 7.5

参考：https://scholar.google.com/intl/en/scholar/metrics.html#metrics

## *TK5指数
TK5指数是为了反映一个会议引用数最高的那些文章的质量如何。我们发现，H5指数很容易会被一个会议的文章数量所影响。例如：会议A共有1000篇引用量不小于20的文章，则其H5指数为20；会议B共有10篇引用量大于10000的文章，然而其H5指数仅为10。在这种情况下，仅凭借H5指数断定会议水平的优劣是不科学的，所以我们提出了TK5中位数来解决这个问题。 TK5中位数的定义是：找出一个近5年会议引用量最高的K篇文章（这里我们取K=10）并得到这K篇文章的具体被引列表，也就是分别都有谁引用了这K篇文章。 根据得到的K篇文章的K个全引用列表，分别用每一篇文章的引用列表中每篇文章的citation指数基于H指数计算模型进行计算，得到K个H指数。我们把这K个数的中位数就叫做TK5中位数。
公式化表达为：

![](https://originalfileserver.aminer.cn/data/ranks/tk5_zh.png)

## *上升指数
理论上来说，一个文章表现得更加活跃的会议比一个引用量年年降低的会议要优秀。我们选取了每个会议近五年来引用量前100名的文章，筛选出它们之中每年引用量都在上升的文章，将这些论文命名为rising paper（上升论文）。对于每个会议筛选出来的上升论文算出一个总的H5指数，作为上升指数。
公式化表达为：

![](https://originalfileserver.aminer.cn/data/ranks/rising_zh.png)

## *基础研究创新指数
对于每个期刊/会议中近五年的全部论文，我们统计了其第一作者所在的机构。选取机构属于学术界的论文集合，将这一集合中的引用量平均值作为基础研究创新指数。

## *应用研究创新指数
对于每个期刊/会议中近五年的全部论文，我们统计了其第一作者所在的机构。选取机构属于产业界的论文集合，将这一集合中的引用量平均值作为基础研究创新指数。
注：这两个创新指数分别体现学术界和产业界两个方向的研究创新情况，其比较结果对于学术界以及产业界的创新研究现状具有一定的参考价值。

## 指标图计算方法
在600个期刊会议中，我们找出每一个指数下的最高值，作为指标图该维度的最大值，并设定一个大于零的最小值，其余指标按比例显示在指标图上（如下图）。

![](https://originalfileserver.aminer.cn/data/ranks/821598235770_.pic.jpg)

如果您有任何疑问欢迎联系：aiopen@aminer.cn
`

export { md_zh, md }

/*

Raw(A) = A会议近五年的引用量前100的文章集合

Yx(P) = 文章P在年X的被引用量

Rising(A) = 所有A会议中满足【Yi(P) > Yj (P), 任意i > j】的文章P的集合

Rising-index(A) = Rising(A)集合的H5指数 */
