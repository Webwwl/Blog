Vue的一大特点就是数据驱动，视图根据数据渲染，当数据发生变化时视图也跟着变化，今天来看看vue的数据驱动是如何实现的。

#### Object.defineProperty
`Object.defineProperty`可以给对象的值添加`getter`和`setter`, 对象的取值和修改都可以被侦测到，vue的响应式就基于这个方法实现的。
```js
// 源数据
const data = {
  name: 'wwl'
}

// 将数据变成响应式
observer(data)

function observer(data) {
  const keys = Object.keys(data)
  for(const key of keys) {
    defineReactive(data, key, data[key])
  }
}

function defineReactive(data, key, value) {
  Object.defineProperty(data, key, {
    // getter
    get() {
      return value
    },
    // setter
    set(newValue) {
      if (newValue !== value) {
        value = newValue
      }
    }
  })
}
```
#### Dep
现在我们已经完成了对数据的侦测，数据肯定是要被组件消费的，数据需要知道自己被哪些组件用到，即在`getter`中将对应的组件作为依赖收集起来，相应的当数据发生变化时通知对应的依赖。这里可以用一个`Dep`类管理依赖。
```js
class Dep {
  constructor() {
    this.subs = []
  }

  // 添加依赖
  addDep() {
    const watcher = Dep.target
    if (!this.subs.includes(watcher)) {
      this.subs.push(watcher)
    }
  }

  // 通知所有依赖更新
  notify() {
    for (const watcher of this.subs) {
      watcher.update()
    }
  }
}
```
#### watcher
模拟视图这块
```js
class Watcher {
  constructor(data) {
    this.data = data
  }
  // 模拟Dom的生成
  update() {
    const html = `<div>${data.name}</div>`
    console.log('get html:::', html)
  }
}
```

#### 完整代码
```js
class Dep {
  constructor() {
    this.subs = []
  }

  // 添加依赖
  addDep() {
    const watcher = Dep.target
    if (!this.subs.includes(watcher)) {
      this.subs.push(watcher)
    }
  }

  // 通知所有依赖更新
  notify() {
    for (const watcher of this.subs) {
      watcher.update()
    }
  }
}

class Watcher {
  constructor(data) {
    this.data = data
  }
  // 模拟Dom的生成
  update() {
    const html = `<div>${data.name}</div>`
    console.log('get html:::', html)
  }
}

// 源数据
const data = {
  name: 'wwl'
}

// 将数据变成响应式
observer(data)

// 创建watcher并与Dep.target建立联系
const renderWatcher = new Watcher(data)
Dep.target = renderWatcher

renderWatcher.update() // 触发getter

setTimeout(() => data.name = 'wwl2', 1000) // 触发setter

function observer(data) {
  const keys = Object.keys(data)
  for (const key of keys) {
    defineReactive(data, key, data[key])
  }
}

function defineReactive(data, key, value) {
  const dep = new Dep()
  Object.defineProperty(data, key, {
    // getter
    get() {
      // 收集依赖
      dep.addDep()
      return value
    },
    // setter
    set(newValue) {
      if (newValue !== value) {
        value = newValue
        // 通知依赖更新
        dep.notify()
      }
    }
  })
}
```
上面实现了一个乞丐版的vue响应式，Vue的响应式实现总体思路差不多，及收集依赖和通知依赖更新，需要注意的是Vue对Array类型的特殊处理，一般来说`pop, push, shift, unshift, splice, sort, reverse`这些方法会导致数组值发生变化，Vue内部对这些方法做了代理，举个`pop`的例子
```js
// 缓存原始的方法
const originPop = Array.prototype.pop

Array.prototype.pop = function (...rest) {
  // 保证值的变化
  originPop.apply(this, rest)
  // 让依赖更新
  renderWatcher.update()
}
```
#### 最后放一张Vue官网的图
![vue响应式原理](https://cn.vuejs.org/images/data.png)