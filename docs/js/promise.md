### PromiseA+规范
⼀个 `promise` 必须提供⼀个 `then` ⽅法以访问其当前值和原因。

`promise` 的 `then` ⽅法接受两个参数： `promise.then(onFulfilled, onRejected)` 他们都是可选参数，同时他们都是函数，如果 `onFulfilled` 或 `onRejected` 不是函数，则需要忽略他们。

* 如果 `onFulfilled` 是⼀个函数
  * 当 `promise` 执⾏结束后其必须被调⽤，其第⼀个参数为 `promise` 的结果
  * 在 `promise` 执⾏结束前其不可被调⽤
  * 其调⽤次数不可超过⼀次
* 如果 `onRejected` 是⼀个函数
  * 当 `promise` 被拒绝执⾏后其必须被调⽤，其第⼀个参数为 `promise` 的原因
  * 在 `promise` 被拒绝执⾏前其不可被调⽤
  * 其调⽤次数不可超过⼀次
* 在执⾏上下⽂堆栈仅包含平台代码之前，不得调⽤ `onFulfilled` 或 `onRejected`
* `onFulfilled` 和 `onRejected` 必须被作为普通函数调⽤（即⾮实例化调⽤，这样函数内部 `this` ⾮严
格模式下指向 `window`）
* `then` ⽅法可以被同⼀个 `promise` 调⽤多次
  * 当 `promise` 成功执⾏时，所有 `onFulfilled` 需按照其注册顺序依次回调
  * 当 `promise` 被拒绝执⾏时，所有的 `onRejected` 需按照其注册顺序依次回调
* `then` ⽅法必须返回⼀个 `promise` 对象 `promise2 = promise1.then(onFulfilled, onRejected)`;
  * 只要 `onFulfilled` 或者 `onRejected` 返回⼀个值 `x` ，`promise 2` 都会进⼊ `onFulfilled` 状态
  * 如果 `onFulfilled` 或者 `onRejected` 抛出⼀个异常 `e` ，则 `promise2` 必须拒绝执⾏，并返回拒因 `e`
  * 如果 `onFulfilled` 不是函数且 promise1 状态变为已完成， `promise2` 必须成功执⾏并返回相同的值
  * 如果 `onRejected` 不是函数且 promise1 状态变为已拒绝， `promise2` 必须执⾏拒绝回调并返回相同的据因

### Promise实现代码
```js
const PENGDING = "pending";
const FULFILLIED = "fulfillied";
const REJECTED = "rejected";

const isFunction = (val) => typeof val === "function";

class Promise {
  constructor(fn) {
    this.status = PENGDING;
    this.value = undefined;
    this.error = undefined;
    this._resolveTasks = [];
    this._rejectTasks = [];
    fn(this._resolve.bind(this), this._reject.bind(this));
  }

  _resolve(value) {
    const run = (value) => {
      if (this.status !== PENGDING) return;
      if (value instanceof Promise) {
        value.then(run);
      } else {
        this.status = FULFILLIED;
        this.value = value;
        let task;
        while ((task = this._resolveTasks.shift())) {
          task(value);
        }
      }
    };

    setTimeout(() => {
      run(value);
    }, 0);
  }

  _reject(error) {
    const run = (error) => {
      if (this.status !== PENGDING) return;
      if (error instanceof Promise) {
        error.then(null, run);
      } else {
        this.status = REJECTED;
        this.error = error;
        let task;
        while ((task = this._rejectTasks.shift())) {
          task(error);
        }
      }
    };

    setTimeout(() => {
      run(error);
    }, 0);
  }

  then(onFulfillied, onRejected) {
    const { status, value } = this;
    return new Promise((resolveNext, rejectNext) => {
      const doResolved = (value) => {
        if (!isFunction(onFulfillied)) {
          resolveNext(value);
        } else {
          const ret = onFulfillied(value);
          if (ret instanceof Promise) {
            ret.then(resolveNext, rejectNext);
          } else {
            resolveNext(ret);
          }
        }
      };
      const doRejected = (error) => {
        if (!isFunction(onRejected)) {
          rejectNext(error);
        } else {
          const ret = onRejected(error);
          if (ret instanceof Promise) {
            ret.then(resolveNext, rejectNext);
          } else {
            resolveNext(ret);
          }
        }
      };
      switch (status) {
        case PENGDING:
          this._resolveTasks.push(doResolved);
          this._rejectTasks.push(doRejected);
          break;
        case FULFILLIED:
          doResolved(value);
          break;
        case REJECTED:
          doRejected(this.error);
          break;

        default:
          break;
      }
    });
  }

  static catch(onRejected) {
    return this.then(null, onRejected)
  }

  static resolve(value) {
    return new Promise((resolve, reject) => {
      resolve(value);
    });
  }

  static reject(error) {
    return new Promise((resolve, reject) => {
      reject(error);
    });
  }

  static all(list) {
    return new Promise((resolve, reject) => {
      let index = 0;
      const values = [];
      for (let [i, promiseInstance] of list.entries()) {
        this.resolve(promiseInstance).then(
          (res) => {
            values[i] = res;
            if (++index === list.length) {
              resolve(values);
            }
          },
          (error) => {
            reject(error)
          }
        );
      }
    });
  }

  static race(list) {
    return new Promise((resolve, reject) => {
      for (let [i, promiseInstance] of list.entries()) {
        this.resolve(promiseInstance).then((res) => {
          resolve(res);
        });
      }
    });
  }
}
```