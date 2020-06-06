> 每周完成一个 ARTS：<br>
* Algorithm: 每周至少做一个 LeetCode 的算法题
* Review: 阅读并点评至少一篇英文技术文章
* Tips: 学习至少一个技术技巧
* Share: 分享一篇有观点和思考的技术文章(一周一篇强度有点大，视情况而定)

<hr>

#### Algorithm
深度优先遍历&广度优先遍历
```JS
function DFS(root) {
  if (!root) return
  console.log(root.value)
  const children = root.children
  if (Array.isArray(children) && children.length) {
    for(const child of children) {
      DFS(child)
    }
  }
}

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