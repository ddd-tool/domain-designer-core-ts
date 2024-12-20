# 领域设计器核心库

## 关于 api 命名

- 保留前缀，对后缀进行缩写，函数名尽量保持在 8 个字母内

- 多个单词能保持同一个意思时，选择使用频次高的

## 关于 LinkType

- Association: 关联关系。默认实线连线，表示稳定的关系，从一个节点到下一个节点

- Dependency: 依赖关系。虚线连线，表示弱依赖关系。

- Aggregation: 聚合关系。空心菱形箭头连线，表示从部分组成整体（部分可单独存在）

- Composition: 组合关系。实心菱形箭头连线，表示从部分组成整体（部分不可单独存在，没有整体就没有部分）
