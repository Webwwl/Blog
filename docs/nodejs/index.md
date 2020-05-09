#### 使用方式
```javascript
// index.js
const moduleA = require('./moduleA')
console.log('moduleA:::', moduleA)  // hello world

// moduleA.js
module.exports = 'hello world'
```

#### 实现原理
node读取定义的模块并用一层function包裹，通过函数参数的形式注入`require`、`module`、 `module.exports`、`__dirname`、`__filename`
```js
const path = require('path')
const fs = require('fs')
const vm = require('vm')

const wrapper = [
  '(function(require, module, exports){',
  '})'
]

const modules = {}

function __require__(p) {
  const filepath = path.resolve(__dirname, p)
  if (modules[filepath]) return modules[filepath]

  const fileContent = fs.readFileSync(filepath, 'utf-8')
  const finalContent = wrapper[0] + fileContent + wrapper[1]

  const module = {
    exports: {}
  }

  const script = new vm.Script(finalContent, {
    filename: 'index.js'   // stack filename
  })

  const result = script.runInThisContext()
  result(__require__, module, module.exports)
  modules[filepath] = module.exports
  return module.exports
}

global.__require__ = __require__
```