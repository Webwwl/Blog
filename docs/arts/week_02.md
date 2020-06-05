> 每周完成一个 ARTS：<br>
* Algorithm: 每周至少做一个 LeetCode 的算法题
* Review: 阅读并点评至少一篇英文技术文章
* Tips: 学习至少一个技术技巧
* Share: 分享一篇有观点和思考的技术文章(一周一篇强度有点大，视情况而定)

<hr>

#### Algorithm
深度优先遍历&广度优先遍历
```JS
function BFS(root) {
  const queue = []
  queue.push(root)
  while(queue.length) {
    const node = queue.shift()
    console.log(node.value)
    if (node.children && node.children.length) {
      node.children.forEach(item => queue.push(item))
    }
  }
}
```

* 求和转化为求差
* map的key是array的值， value是array的索引

#### Review
[一篇关于Vue使用的建议的文章](https://medium.com/@hohanga/vue-best-practices-templates-and-variables-99cc7e1fd42b)

> 读起来没啥难度，内容偏水

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
本周无文章