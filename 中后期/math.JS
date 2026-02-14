
export default 2

export var PI = 3.14592653589793238462643383279

setInterval(() => {
  PI++
}, 1000)

export function add(a, b) {
  return a + b
}

export function sub(a, b) {
  return a - b
}

function mul(a, b) {
  return a * b
}

function div(a, b) {
  return a / b
}

export {mul, div}   // 一次性导出多个具名导出
