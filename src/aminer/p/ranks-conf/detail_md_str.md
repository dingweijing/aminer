These metrics are our newly defined indexes that valued relatively different traits of ranking process. You are welcomed to choose whichever index you prefer and looking for the ranking outcome under this specific index.

## H5-index

h5-index is the largest number h such that h articles published in [the past 5 years] have at least h citations each.

Reference: https://scholar.google.com/intl/en/scholar/metrics.html#metrics

## H5-median

h5-median is based on h5-index, but instead measures the median value of citations for the h number of citations.

Reference: https://scholar.google.com/intl/en/scholar/metrics.html#metrics

## tk5-median

TK5-median is defined to quantitively reflect the conference's standard by its top papers. As we can see by its definition, H5-index is easily influenced by the number of papers a conference/journal accept. To exclude this effect and evaluate a conference better, we introduced TK5-median where it takes the top 10 citation papers of a conference in the past 5 years and for each of the 10 papers, calculate its tk5-value by finding all papers that cited it and get an h-index. Then we use the median value of the 10 tk5-values, which is defined as tk5-median, formally TK(A) = top k citation papers of a conference A in the past 5 years

```
TK5-value(X) = h-index(all papers cited X)

Me (S) = the median of a set S

TK5-median(A) = Me ∀ paper (P) ∈ TK5（A）[TK5-value(P)]
```

In the definition, we specifically set K = 10 to acquire a better consequence.

## \*Rising-index

Generally speaking, conference that always remain a highly active status should score better than conference that accept papers with a decreasing yearly citation number. Therefore, we define rising-index to quantitively evaluate the degree of uptrend for a specific conference. It takes the top 100 citation papers of a conference in the recent 5 years and filter out those with a decreasing yearly citation, then set the index as the h5 value of the filtered set. Formally,

```
Raw(A) = top100 citation papers of a conference A in the past 5 years

Yx(P) = Citation of a paper P in year X

Rising(A) = all paper P in conference A that Yi(P) > Yj (P) where i > j

Rising-index(A) = h5-index of the set Rising(A)
```

## Basic Research Creativity Index

For all papers in a conference in the most recent 5 years, we investigated on the organization of a paper’s first author and divided them into groups. For all the organizations that are or part of academic institutions, we viewed them as belonging to the academic community, which more often focused on the basic research fields. Average of these papers’ citation number is taken as Basic Research Creativity Index.

## Applied Research Creativity Index

For all papers in a conference in the most recent 5 years, we researched on the organization of a paper’s first author and divided them into groups. For all the organizations that are part of industrial institutions or companies, we viewed them as belonging to the industrial community, which more often focused on the applied research fields. Average of these papers’ citation number is taken as Applied Research Creativity Index.

Note: These creativity indexes are representations of the current development status of basic research and applied research. Hence comparing them provides a new way of seeing different innovation aspects within a conference/journal. They are different to other metrics as they do not evaluate the conference/journal as a whole.

## How do we get our Radar Map?

Among the 600 conferences and journals, we take the highest value under each of these indexes as the maximum edge of the radar map. Then, we set up the minimum to be slightly above zero, as shown in the graph below. All conferences and journals are drawn by their own values in proportion to the maximum as well as the minimum.

![](https://originalfileserver.aminer.cn/data/ranks/811598235760_.pic.jpg)

If you have any questions, please feel free to contact [aiopen@aminer.cn](aiopen@aminer.cn).

\*我们在期刊会议评价方面提出了新改进与新想法，用户可以根据不同指标的特性，自主选择他们看重的特征，进行期刊会议的排名查看，希望能够给大家更多的参考指南。

## H5 指数

H5 指数是过去五年内该会议的所有文章中，满足有 h 篇文章的引用量不小于 h 的，最大的满足条件的 h 就是这个会议的 H5 指数 例：一个会议近五年有 10 篇文章，它们的引用量分别为 10,8,8,7,6,6,4,3,2,1 那么这个会议的 H5 指数就是 6

参考：https://scholar.google.com/intl/en/scholar/metrics.html#metrics

## H5 中位数

H5 中位数是基于 H5 指数的，它描述的是该会议前[H5 指数]篇文章引用量的中位数 例：同上，因为这个会议的 H5 指数是 6，所以 H5 中位数为 10,8,8,7,6,6 的中位数，即为 7.5

参考：https://scholar.google.com/intl/en/scholar/metrics.html#metrics

## TK5 中位数

TK5 中位数是为了反映一个会议引用数最高的那些文章的质量如何。我们发现，H5 指数很容易会被一个会议的文章数量所影响。例如：会议 A 共有 1000 篇引用量不小于 20 的文章，则其 H5 指数为 20；会议 B 共有 10 篇引用量大于 10000 的文章，然而其 H5 指数仅为 10。在这种情况下，仅凭借 H5 指数断定会议水平的优劣是不科学的，所以我们提出了 TK5 中位数来解决这个问题。 TK5 中位数的定义是：找出一个近 5 年会议引用量最高的 K 篇文章（这里我们取 K=10）并得到这 K 篇文章的具体被引列表，也就是分别都有谁引用了这 K 篇文章。 根据得到的 K 篇文章的 K 个全引用列表，分别用每一篇文章的引用列表中每篇文章的 citation 指数基于 H 指数计算模型进行计算，得到 K 个 H 指数。我们把这 K 个数的中位数就叫做 TK5 中位数。公式化表达为：

TK5(A) = A 会议最近 5 年引用量最高的 K 篇文章

Me(S)= S 集合中的中位数

TK5-value(X) = 【所有引用了文章 X 的文章】的 H 指数

TK5-median（A）= Me ∀P∈TK5（A）[TK5-value（P）]

## \*上升指数

理论上来说，一个文章表现得更加活跃的会议比一个引用量年年降低的会议要优秀。我们选取了每个会议近五年来引用量前 100 名的文章，筛选出它们之中每年引用量都在上升的文章，将这些论文命名为 rising paper（上升论文）。对于每个会议筛选出来的上升论文算出一个总的 H5 指数，作为上升指数。公式化表达为：

```
Raw(A) = A 会议近五年的引用量前 100 的文章集合

Yx(P) = 文章 P 在年 X 的被引用量

Rising(A) = 所有 A 会议中满足【Yi(P) > Yj (P), 任意 i > j】的文章 P 的集合

Rising-index(A) = Rising(A)集合的 H5 指数
```

## 基础研究创新指数

对于每个期刊/会议中近五年的全部论文，我们统计了其第一作者所在的机构。选取机构属于学术界的论文集合，将这一集合中的引用量平均值作为基础研究创新指数。

## 应用研究创新指数

对于每个期刊/会议中近五年的全部论文，我们统计了其第一作者所在的机构。选取机构属于产业界的论文集合，将这一集合中的引用量平均值作为基础研究创新指数。注：这两个创新指数分别体现学术界和产业界两个方向的研究创新情况，其比较结果对于学术界以及产业界的创新研究现状具有一定的参考价值。

## 雷达图计算方法

在 600 个期刊会议中，我们找出每一个指数下的最高值，作为雷达图该维度的最大值，并设定一个大于零的最小值（如下图），其余指标按比例显示在雷达图上。

![](https://originalfileserver.aminer.cn/data/ranks/821598235770_.pic.jpg)

如果您有任何疑问欢迎联系：aiopen@aminer.cn
