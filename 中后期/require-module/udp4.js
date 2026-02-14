

var dgram = require('dgarm')

var socket = dgram.createSocket('udp4')
// 套接字

socket.bind(11222) // 绑定一个端口

// 给大喵的服务器发送
socket.send('sdadasdsds', 11222, 'damiaoedu.com')
//           发送的数据    端口     ip地址

socket.setBroadcast(true)
// 能否广播
socket.addMembership('224-239.x.x.x.x')

// node.js 里面
socket.send('asdjasjdkas', (data, info) => {
  // data: 接收到的数据
  // info: 发送方的信息，地址与端口，数据的长度

  console.log(info.address, data.toString().slice(0, 3))
})
