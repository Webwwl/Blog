本文聊聊另一种watcher:`computedWatcher`的实现。
#### 使用方式
```vue
<template>
  <div class="container">
    <div>{{fullname}}</div>
  </div>
</template>

<script>
import child from './components/child'
export default {
  name: 'App',
  data(vm) {
    return {
      firstname: 'klay',
      lastname: 'thompson'
    }
  },
  computed: {
    fullname() {
      return this.firstname + this.lastname
    }
  },
 }
</script>
```
这里定义一个fullname的计算属性，根据`firstname`和`lastname`的值计算值，当这两个值发生变化时fullname会重新计算
#### initState
```js
// core/instance/state.js
export function initState (vm: Component) {
  vm._watchers = []
  const opts = vm.$options
  ...
  if (opts.computed) initComputed(vm, opts.computed)
  ...
}
```
#### initComputed
```js
// core/instance/state.js
function initComputed (vm: Component, computed: Object) {
  // $flow-disable-line
  const watchers = vm._computedWatchers = Object.create(null)
  // computed properties are just getters during SSR
  const isSSR = isServerRendering()

  for (const key in computed) {
    const userDef = computed[key]
    const getter = typeof userDef === 'function' ? userDef : userDef.get
    if (process.env.NODE_ENV !== 'production' && getter == null) {
      warn(
        `Getter is missing for computed property "${key}".`,
        vm
      )
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      )
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef)
    } else if (process.env.NODE_ENV !== 'production') {
      if (key in vm.$data) {
        warn(`The computed property "${key}" is already defined in data.`, vm)
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(`The computed property "${key}" is already defined as a prop.`, vm)
      }
    }
  }
}
```
* 遍历computed对象，根据key生成对应的watcher对象并保存在`vm._computedWatchers`,这里的`computedWatcherOptions = { lazy: true }` 
* 调用defineComputed方法，给vm对象添加key

#### defineComputed
```js
// core/instance/state.js
export function defineComputed (
  target: any,
  key: string,
  userDef: Object | Function
) {
  const shouldCache = !isServerRendering()
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef)
    sharedPropertyDefinition.set = noop
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop
    sharedPropertyDefinition.set = userDef.set || noop
  }
  ...
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
```
这里`typeof userDef === 'function'`且不是服务端渲染，所以会走`sharedPropertyDefinition.get = createComputedGetter(key)`,`sharedPropertyDefinition`就是一个公用的`propertyDescriptor`
```js
const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
}
```
#### createComputedGetter
```js
function createComputedGetter (key) {
  return function computedGetter () {
    const watcher = this._computedWatchers && this._computedWatchers[key]
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate()
      }
      if (Dep.target) {
        watcher.depend()
      }
      return watcher.value
    }
  }
}
```
当getter触发时，根据key拿到对应的watcher，判断watcher依赖的值是否有更新，有则计算值，最后返回watcher的value。
#### evaluate
```js
// core/observer/watcher.js
/**
* Evaluate the value of the watcher.
* This only gets called for lazy watchers.
*/
evaluate () {
    this.value = this.get()
    this.dirty = false
}
```
evaluate方法专门为computedWatcher服务的
```js
// // core/observer/watcher.js
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
这里的`this.getter`就是前面的`userDef`,进行求值时会触发依赖项的依赖收集，以前面的例子来看，`firstname`和`lastname`会将`fullname`对应的watcher收集。当这两个值中任意一个发生变化时就会触发watcher的重新计算。
#### 几个注意的点
##### getter什么时候触发的
Vue通过在Vm实例上定义getter，在getter里面计算watcher的值，那么肯定有`Vm.fullname`这样的取值语句触发getter，这是在哪个地方触发的呢？
1. `render`函数，在mount过程中会执行render函数，里面有`vm.fullname`的求值。
2. 如果没有在页面中使用计算属性，在method中有`this.fullname`也是一样。
![](https://user-gold-cdn.xitu.io/2019/10/26/16e0731c0c2c33d9?w=679&h=408&f=png&s=63900)
##### computedWatcher的update
```js
// core/observer/watcher.js
  update () {
    /* istanbul ignore else */
    if (this.lazy) {
      this.dirty = true
    } else if (this.sync) {
      this.run()
    } else {
      queueWatcher(this)
    }
  }
```
computedWatcher的update方法并不会将当前watcher添加进`queue`,只是将watcher的dirty标记为true，在nextTick时render函数再次执行，再看一遍前面的getter取值
```js
//core/instance/state.js
function createComputedGetter (key) {
  return function computedGetter () {
    const watcher = this._computedWatchers && this._computedWatchers[key]
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate()
      }
      if (Dep.target) {
        watcher.depend()
      }
      return watcher.value
    }
  }
}
```
##### method vs computed
官网中也有描述，computed的功能用method也可以实现，比如我们改写前面的例子
```js
<template>
  <div class="container">
    <div>{{fullname()}}</div>
  </div>
</template>

<script>
import child from './components/child'
export default {
  name: 'App',
  data(vm) {
    return {
      firstname: 'klay',
      lastname: 'thompson'
    }
  },
  methods: {
    fullname() {
      return this.firstname + this.lastname
    }
  },
 }
</script>
```
method虽然实现了功能，但是这里有个问题，无论`fristname`和`lastname`是否变化，求值函数都会执行一遍，假设这个取值过程十分复杂，在依赖的值没有变化时重新计算是没有必要的，这种情况下采用`computed`更合理，`watcher.dirty === false`,不会重新计算
#### 总结

![流程图](https://user-gold-cdn.xitu.io/2019/10/26/16e073776ad913bb?w=2574&h=1474&f=png&s=250132)