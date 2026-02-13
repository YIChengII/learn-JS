/*
接受主线程的代码
*/

// 接受数据
globalThis.addEventListener('message', e => {
  var data = e.data
  var result = data * data

   //将结果发回去
  postMessage(result)
})
