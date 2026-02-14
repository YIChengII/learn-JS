const port = 8085

const net = require('net')
const { receiveMessageOnPort } = require('worker_threads')

// 简单的HTTP的服务器
var message = []

const server = net.createServer(socket => {
  socket.on('data', data => { // 服务器收到数据
    var lines = data.toString().split('\r\n') // 手动解析HTTP协议
    var firstLine = lines.shift()// 删除并且返回数组第一个元素 改变原数组
    var [method, url] = firstLine.split(' ')

    console.log(socket.remoteAddress, method, url)
    //    TCP连接可以读到远程地址，    请求方法

    // console.log(method, url)
    console.log(data.toString())
    if (url == '/message-board') { // 这个是路由分发！
      socket.write('HTTP/1.1 200 OK\r\n') // write方法只能接字符串
      socket.write('Data: ' + new Date().toISOString() + '\r\n')
      socket.write('Content-Type: text/html; charset=UTF-8\r\n')
      // HTTP 规定：  
      // 每一行必须以 \r\n 结尾

      // socket.write('Content-Length: 20\r\n')
      // 最终就是跳转到这个地址  example/message.html?name=zhang&message=helloworld
      // <form method="GET" 根据这个message发起请求
      socket.write('\r\n')
      // 这个是访问字段的，字段如果没有的话，那么就不会访问
      socket.write(`
          <form method="GET" action="/leave-message"> 
            <p>Name: <input type="text" name="name"></p>
            <p>Message:<br><textarea name="message"></textarea></p>
            <p><button type="submit">Send</button></p>
          </form>
        `)
      for (var m of message) {
        socket.write(`
          <fieldset>
            <legend>${m.name}</legend>
            ${m.message}
          </fieldset>
          `)
      }
      // socket.write('' + new Date())
      socket.end()
    } else if (url.startsWith('/leave-message')) { // startsWith是判断字符串是否以某个字串开头
      var [path, query] = url.split('?')
      var msg = parseQuery(query)
      message.push(msg)
      // 注意301，302 都是跳转专用的状态码
      // 面试题：301和302有什么区别呢？
      socket.write('HTTP/1.1 302 Found\r\n') // write方法只能接字符串
      socket.write('Data: ' + new Date().toISOString() + '\r\n')
      socket.write('Location: /message-board\r\n')// 这个头表示让浏览器跳转到这个地址
      // socket.write('Content-Type: text/html; charset=UTF-8\r\n')
      socket.write('\r\n')
      socket.end()
    } else if (url == '/red') {
      socket.write('HTTP/1.1 200 OK\r\n') // write方法只能接字符串
      socket.write('Data: ' + new Date().toISOString() + '\r\n')
      socket.write('Content-Type: text/html; charset=UTF-8\r\n')
      // socket.write('Content-Length: 20\r\n')
      socket.write('\r\n')
      socket.write('' + new Date())
      socket.end()
    } else if (url == '/aa.css') {
      socket.write('HTTP/1.1 200 OK\r\n') // write方法只能接字符串
      socket.write('Data: ' + new Date().toISOString() + '\r\n')
      socket.write('Content-Type: text/html; charset=UTF-8\r\n')
      // socket.write('Content-Length: 20\r\n')
      socket.write('\r\n')
      socket.write('html {background: red; }')
      socket.end()
    } else {
      socket.write('HTTP/1.1 200 OK\r\n') // write方法只能接字符串
      socket.write('Data: ' + new Date().toISOString() + '\r\n')
      socket.write('Content-Type: text/html; charset=UTF-8\r\n')
      // socket.write('Content-Length: 20\r\n')
      socket.write('\r\n')
      socket.write('<h1>it works!</h1>' + new Date())
      socket.end()
    }
  })
  socket.on('error', () => {
    socket.end()
  })
})

server.listen(port, () => {
  console.log('server listening on port', port)
}) // 等的是端口就绪
//让操作系统在 port 这个端口上监听 TCP 连接


// 将一个形如a=1&b=xxx&c=uuu的查询字符串转换成一个对象
function parseQuery(query) {
  var obj = {}
  var pairs = query.split('&')
  for (var pair of pairs) {
    var [name, value] = pair.split('=')
    obj[name] = value
  }
  return obj
}


var req = new XMLHttpRequest();
req.open("GET", "example/data.txt", false);
req.send(null);
console.log(req.responseText)


function dl(url, f) {
  var xhr = new XMLHttpRequest()
  xhr.open('GET', '/')
  xhr.addEventListener('load', e => {
    f(xhr.responseText) // 逻辑没有写死，可以由调用者自行决定
  })
  xhr.send()
}

function dl(url, f) {
  var xhr = new XMLHttpRequest()
  xhr.open('GET', url)
  xhr.setRequestHeader('Accept', 'application/json')
  xhr.addEventListener('load', e => {
    f(xhr.responseText) // 逻辑没有写死，可以由调用者自行决定
  })
  xhr.send()
}

function dl(url, type, f) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url); // 我们要采用什么方法把东西运到哪里，url：地址
  // 根据传入的 type 设定 Accept 头
  // 比如传入 'text/plain', 'text/html' 或 'application/json'
  xhr.setRequestHeader('Accept', type);
  xhr.addEventListener('load', e => {
    if (xhr.status < 400) {
      f(xhr.responseText);
    } else {
      console.error('请求失败：' + xhr.status);
    }
  });
  xhr.send();  // 只有调用了这个方法，浏览器才会真正连接服务器，把请求头和数据发送出去
}


xhr.setRequestHeader(名称, 值)
// 注意： 它必须在 open() 之后、send() 之前调用。如果你在 open() 
// 之前调用，浏览器会报错，因为此时“包裹”还没准备好，没地方贴标签。


// 这种封装方式叫做远程过程调用

var reuslt = getWeather('0571')

function getWeather(code) {
  var xhr = new XMLHttpRequest()

  xhr.open('GET', 'https:www.weather.cn/query' + code, false)

  xhr.send()

  var result = JSON.parse(xhr.responseText)

  return result
}


// 在服务端上面调用函数

// 这个接近于rpc调用
function getWeather(city) {
  return rpcCall('getWeather', city)
}

function rpcCall(fnName, ...args) {
  var xhr = new XMLHttpRequest()
  xhr.open('POST', 'https://www.sijdijsid.com/rpc', false)
  xhr.send(JSON.stringify({
    fnName: fnName,
    args: args,
  }))
  return JSON.parse(xhr.responseText)
}

function getIpInfo() {
  return rpcCall('getIpInfo', '1.2.3.4.')
}
// 优化
function getWeather(city) {
  return rpcCall('getWeather', city);
}
function rpcCall(fnName, ...args) {
  // 返回一个 Promise，代表未来的结果
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://www.sijdijsid.com/rpc', true); // 改为 true (异步)
    xhr.onload = function () {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText)); // 成功：传回数据
      } else {
        reject(new Error("RPC Failed")); // 失败：传回错误
      }
    };
    xhr.send(JSON.stringify({
      fnName: fnName,
      args: args,
    }));
  });
}
// 使用时
getWeather('Beijing').then(data => console.log(data))




