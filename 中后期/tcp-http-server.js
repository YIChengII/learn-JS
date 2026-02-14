const net = require('net')

const port = 8085

 // 简单的HTTP的服务器
const server = net.createServer(socket => {
  socket.on('data', data => {
    var lines = data.toString().split('\r\n')
    var firstLine = lines.shift()
    var [method, url] = firstLine.split(' ')

    console.log(socket.remoteAddress, method, url)
    //    TCP连接可以读到远程地址，    请求方法

    // console.log(method, url)
    console.log(data.toString())

    socket.write('HTTP/1.1 200 OK\r\n') // write方法只能接字符串
    socket.write('Data: ksjdajsd\r\n')
    socket.write('Content-Type: text/html\r\n')
    socket.write('Content-Length: 20\r\n')
    socket.write('\r\n')
    socket.write('<h1>it Works!!</h1>')
  })
  socket.on('error', () => {
    socket.end()
  })
})

server.listen(port, () => {
  console.log('server listening on port', port)
})

// 第一个主机 = 网络地址 + 1   最后一个主机 = 广播地址 − 1
