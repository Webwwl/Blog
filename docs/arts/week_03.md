> 每周完成一个 ARTS：<br>
* Algorithm: 每周至少做一个 LeetCode 的算法题
* Review: 阅读并点评至少一篇英文技术文章
* Tips: 学习至少一个技术技巧
* Share: 分享一篇有观点和思考的技术文章(一周一篇强度有点大，视情况而定)

<hr>

#### Algorithm
三数之和：[leetcode](https://leetcode-cn.com/problems/3sum/)

* 排序
* 双指针

#### Review
[typescript decorator用法](https://www.typescriptlang.org/docs/handbook/decorators.html#class-decorators)

* 装饰静态方法、属性的时候target是constructor，一般情况下是prototype
> 关注装饰类、方法、属性、参数的用法

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
