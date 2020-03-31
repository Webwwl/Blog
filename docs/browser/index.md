### 什么是同源
浏览器规定: `协议`、`域名`、`端口`都相同属于同源，以下情况都不是同源：
* `https://www.baidu.com` vs `http://www.baidu.com`
* `https://www.baidu.com` vs `https://mail.baidu.com`
* `http://www.baidu.com` &nbsp; vs `http://www.baidu.com:8088` 

### 跨域
当在`www.a.com`发出`www.b.com/xxx`的ajax请求时，即发生了跨域请求，根据浏览器的安全策略这个请求会被block.

### 解决方法
常用的解决方法：
* jsonp
* cors
* 请求转发

#### jsonp
浏览器允许`script`标签加载非同源的脚本，加载完毕即可执行，jsonp就是依托这个特性实现跨越请求： 先在客户端定义好处理数据的回调函数，由服务端返回脚本内容（填入服务端数据执行回调函数 ）。
```js
// 客户端
function clientCb(data) {
  console.log('get data from server:::', data)
}

// script
<script src="https://www.xxx.com/xxx?cb=clientCb"></script>

// 服务端返回的脚本
'clientCb("data from server")'
```
> 缺点： 只支持get类型的跨域请求

#### cors
浏览器在发出cors的请求时会先有一次`预检`请求，类型是`options`，关键的http头信息有：
```
Origin: http://www.xxx.com            // 客户端的origin
Access-Control-Request-Method: PUT    // cors请求类型
```
需要后端配合，在响应头加上以下字段
```
Access-Control-Allow-Origin: http://www.xxx.com  // 设置允许跨域请求的域
Access-Control-Allow-Methods: GET, POST, PUT     // 设置允许跨域的请求类型
```
如果cors请求满足服务端设置的限制即可正常请求，实现跨域。
> 支持get、post、put多种类型的请求

#### 请求转发
跨域请求限制只存在浏览器中，服务端之间的请求没有限制。前端请求同源接口，由后台server转发该请求至目标接口，响应内容原样转发给客户端即可完成跨域请求。
* 本地开发时，需要配置代理规则，实际上就是通过本地的node服务转发请求，以vue-cli为例：
```js
devServer: {
  proxy: {
    '/api': {
      target: 'http://www.xxx.com'  // 目标地址
      ... // 其他配置
    }
  }
}
```
* 部署打包后的静态文件，如果有跨域请求可通过nginx转发
```nginx
location /api {
# proxy_pass  http://www.xxx.com/;  带/的话转发请求不带/api
  proxy_pass  http://www.xxx.com;
}
```