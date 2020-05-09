在Vue中，Watcher是个很重要的概念，一共有三种Watcher，renderWatcher，userWatcher，computedWatcher,之前的文章有提到renderWatcher，主要是生成视图，本文聊下userWatcher
#### 使用方式
```vue
<template>
  <div class="container">
    <div class="a">{{msg.name}}</div>
    <button @click="handleClick">click</button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      msg: 'hello'
    }
  },
  watch: {
    msg(nv, ov) {
        console.log('user watch emit', nv, ov)
      }
  },
  methods: {
    handleClick() {
      this.msg = this.msg === 'hello' ? 'world' : 'hello'
    }
  }
}
</script>
```
这里定义了一个watcher，当this.msg变化时会触发回调,参数是当前值和旧值。
#### watcher初始化
```js
// core/instance/init.js
initLifecycle(vm)
initEvents(vm)
initRender(vm)
callHook(vm, 'beforeCreate')
initInjections(vm) // resolve injections before data/props
initState(vm)
initProvide(vm) // resolve provide after data/props
callHook(vm, 'created')
```
#### initState
```js
// core/instance/state.js
export function initState (vm: Component) {
  vm._watchers = []
  const opts = vm.$options
  if (opts.props) initProps(vm, opts.props)
  if (opts.methods) initMethods(vm, opts.methods)
  if (opts.data) {
    initData(vm)
  } else {
    observe(vm._data = {}, true /* asRootData */)
  }
  if (opts.computed) initComputed(vm, opts.computed)
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch)
  }
}

```
#### initWatch
```js
// // core/instance/state.js
function initWatch (vm: Component, watch: Object) {
  for (const key in watch) {
    const handler = watch[key]
    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i])
      }
    } else {
      createWatcher(vm, key, handler)
    }
  }
}
```
> 可以看到，watch是支持传入回调函数数组的
#### createWatcher
```js
function createWatcher (
  vm: Component,
  expOrFn: string | Function,
  handler: any,
  options?: Object
) {
  if (isPlainObject(handler)) {
    options = handler
    handler = handler.handler
  }
  if (typeof handler === 'string') {
    handler = vm[handler]
  }
  return vm.$watch(expOrFn, handler, options)
}
```
> watch支持对象配置，handler是回调函数。
#### Vue.$watch
```js
// 
Vue.prototype.$watch = function (
    expOrFn: string | Function,
    cb: any,
    options?: Object
  ): Function {
    const vm: Component = this
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {}
    options.user = true
    const watcher = new Watcher(vm, expOrFn, cb, options)
    if (options.immediate) {
      cb.call(vm, watcher.value)
    }
    return function unwatchFn () {
      watcher.teardown()
    }
  }
}
```
1. `options.immediate`为true时回调函数会立即执行一次。
2. $watch返回一个函数，执行该函数可以取消watch
#### new Watcher
```js
// core/observer/watcher.js
export default class Watcher {
  vm: Component;
  expression: string;
  cb: Function;
  id: number;
  deep: boolean;
  user: boolean;

  constructor (
    vm: Component,
    expOrFn: string | Function,
    cb: Function,
    options?: ?Object,
    isRenderWatcher?: boolean
  ) {
    this.vm = vm
    if (isRenderWatcher) {
      vm._watcher = this
    }
    vm._watchers.push(this)
    // options
    if (options) {
      this.deep = !!options.deep
      this.user = !!options.user
      this.computed = !!options.computed
      this.sync = !!options.sync
      this.before = options.before
    } else {
      this.deep = this.user = this.computed = this.sync = false
    }
    ...

    // parse expression for getter
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn)
      ...
    }
    if (this.computed) {
      this.value = undefined
      this.dep = new Dep()
    } else {
      this.value = this.get()
    }
  }

  /**
   * Evaluate the getter, and re-collect dependencies.
   */
  get () {
    pushTarget(this)
    let value
    const vm = this.vm
    try {
      value = this.getter.call(vm, vm)
    } catch (e) {
      if (this.user) {
        handleError(e, vm, `getter for watcher "${this.expression}"`)
      } else {
        throw e
      }
    } finally {
      // "touch" every property so they are all tracked as
      // dependencies for deep watching
      if (this.deep) {
        traverse(value)
      }
      popTarget()
      this.cleanupDeps()
    }
    return value
  }

```
这里结合debug看下

![](https://user-gold-cdn.xitu.io/2019/10/24/16dfdd01fdf44fb7?w=702&h=640&f=png&s=133092)

`expOrFn`是字符串'msg'，会走`this.getter = parsePath(expOrFn)`,返回一个函数,然后执行`this.get()`, 接着`value = this.getter.call(vm, vm)`,来看下getter的值。
#### parsePath
```js
// core/utils/lang.js
const bailRE = /[^\w.$]/
export function parsePath (path: string): any {
  if (bailRE.test(path)) {
    return
  }
  const segments = path.split('.')
  return function (obj) {
    for (let i = 0; i < segments.length; i++) {
      if (!obj) return
      obj = obj[segments[i]]
    }
    return obj
  }
}
```
parsePath对key进行解析，我们传入的值是`msg`,返回一个函数，在watch的get方法中调用，入参`obj = vm`,第一个循环中`obj = obj[segments][i]`触发了`vm.msg`的getter，收集依赖，即当前的`userWatch`(这部分流程需要熟悉Vue的响应式实现）
#### 当值改变时
```js
handleClick() {
  this.msg = this.msg === 'hello' ? 'world' : 'hello'
}
```
改变`this.msg`时会触发对应的setter，遍历依赖依次更新，`msg`这个key对应的依赖项有两个，一个`renderWatch`和一个`userWatch`,可以debug看下。

![](https://user-gold-cdn.xitu.io/2019/10/24/16dfdd01fed05b50?w=802&h=610&f=png&s=142532)

watcher更新时会调用`run()`
#### run
```js
// core/observer/watcher.js
run () {
    if (this.active) {
      this.getAndInvoke(this.cb)
    }
  }
```
#### getAndInvoke
```js
// core/observer/watcher.js
getAndInvoke (cb: Function) {
    const value = this.get()
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      const oldValue = this.value
      this.value = value
      this.dirty = false
      if (this.user) {
        try {
          cb.call(this.vm, value, oldValue)
        } catch (e) {
          handleError(e, this.vm, `callback for watcher "${this.expression}"`)
        }
      } else {
        cb.call(this.vm, value, oldValue)
      }
    }
  }
```
getAndInvoke中拿到当前值和旧值，如果是`userWatch`会执行`cb.call(this.vm, value, oldValue)`,也就是我们的回调函数

### 总结
userWatcher的初始化发生在`beforeCreate`和`created`之前，new一个Watcher实例并将其添加进对应的key的依赖数组中，当监听的值发生变化时触发watcher的更新，执行回调函数。

下一篇聊下computed的实现