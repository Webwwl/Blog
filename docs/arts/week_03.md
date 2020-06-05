> 每周完成一个 ARTS：<br>
* Algorithm: 每周至少做一个 LeetCode 的算法题
* Review: 阅读并点评至少一篇英文技术文章
* Tips: 学习至少一个技术技巧
* Share: 分享一篇有观点和思考的技术文章(一周一篇强度有点大，视情况而定)

<hr>

#### Algorithm
两数之和：[leetcode](https://leetcode-cn.com/problems/two-sum/)

* 求和转化为求差
* map的key是array的值， value是array的索引

#### Review
[一篇关于Vue使用的建议的文章](https://medium.com/@hohanga/vue-best-practices-templates-and-variables-99cc7e1fd42b)

> 读起来没啥难度，内容偏水

#### Tip
节流&防抖:
```js
function debounce(fn, delay) {
  let timer
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay);
  }
}

function throttle(fn, delay) {
  let timer
  return function (...args) {
    if (timer) return
    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, delay);
  }
}
```

#### Share
本周无文章
