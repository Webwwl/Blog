> 每周完成一个 ARTS：<br>
* Algorithm: 每周至少做一个 LeetCode 的算法题
* Review: 阅读并点评至少一篇英文技术文章
* Tips: 学习至少一个技术技巧
* Share: 分享一篇有观点和思考的技术文章(一周一篇强度有点大，视情况而定)

<hr>

#### Algorithm
给定不同面额的硬币 coins 和一个总金额 amount。编写一个函数来计算可以凑成总金额所需的最少的硬币个数。如果没有任何一种硬币组合能组成总金额，返回 -1。
```js
function calcMinCount(coins, n) {
  const f = []
  // 已知条件
  f[0] = 0
  const len = coins.length
  for(let i = 1; i <= n; i++) {
    f[i] = Infinity
    for(let j = 0; j < len; j++) {
      if (i - coins[j] >= 0) {
        f[i] = Math.min(f[i], f[i - coins[j]] + 1)
      }
    }
  }
  if (f[n] === Infinity) return -1
  return f[n]
}
```
动态规划问题，抓住几个重点
1. 递归思想明确树形思维模型：找到问题终点，思考倒退的姿势，往往可以帮助你更快速地明确状态间的关系
2. 结合记忆化搜索，明确状态转移方程
3. 递归代码转化为迭代表达（这一步不一定是必要的，1、2本身为思维路径，而并非代码实现。若你成长为熟手，2中分析出来的状态转移方程可以直接往循环里塞，根本不需要转换）。
> 第三步的递归转迭代是因为动态规划是从终止条件开始，逐步推导出f(n),与递归思路相反。

#### Review
[使用TypeScript的好处](https://exploringjs.com/tackling-ts/ch_why-typescript.html)

* 静态检查
* 函数参数类型确定，增加可读性
* 代码提示更加友好
* 让重构更加安全
* 可以使用新的语言特性，编译成低版本js

#### Tip
实现flat:
```js
Array.prototype.myFlat = function(depth = 0, ret = []) {
  if (depth <= 0) return ret.concat(this)
  const arr = this
  const len = arr.length
  for(let i = 0; i < len; i++){
    if (Array.isArray(arr[i])) {
      ret = ret.concat(flat(arr[i], depth - 1))
    } else {
      ret.push(arr[i])
    }
  }
  return ret
}
```
#### Share
[Vue响应式原理分析](http://www.wuwenliang.xyz/blog/vue/)