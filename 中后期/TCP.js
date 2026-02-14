
var net = require('net')

var server = net.createServer()

server.on('connection', (socket) => {
  console.log('someone comes in', socket.remoteAddress, socket.remotePort)
                                    // 客户端IP          // 客户端端口
  socket.write('hello' + new Date()) // 服务端主动给客户端发消息

  // 服务端接受客户端的数据
  socket.on('data', data => {
    console.log(socket.remoteAddress, data.toString().slice(0, 2))
    socket.write(data.toString().toUpperCase())
  })
})
server.listen(1222, () => {
  console.log('tcp server listening on port', 1222)
})



//客户端代码
var net = require('net') 

var socket = net.connect(1222, '127.0.0.1')

socket.write('adadsdsd')

socket.on('data', data => {
  console.log(data.toString())
})
