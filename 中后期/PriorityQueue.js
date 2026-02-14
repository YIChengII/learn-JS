
import * as math from './math.JS' // 把math.JS所有导出都挂在这个math对象上面
// math.defailt // 默认导出
// math.NAME // 具名导出

console.log(math)
// math本身是一个叫Module类型的对象

// import {add, sub, mul, div} from './math.JS'

export default class PriorityQueue {
  // 一个class 如果放在开头的话，那么叫做class声明，放在后面的话叫做class表达式
  constructor() { }
  push() {
    add(1, 2)
  }
  pop() { }
}
// 通过导入语句创建的变量相当于const声明的
// 所以不能给其重新赋值

// 导入与导出语句只能用在模块类型的JS中，且只能写在模块最顶层的作用域
// 即不能出现在任何其它的花括号里面，如if, for,或函数等

// 每个模块文件都有自己的作用域，声明在模块内的变量或函数等，如果不导出，其它模块都是无法访问到的
export function heapSort(array) {

}

// 面经

// var 和 let 和 const 的区别
// const（被它声明的对象{}可以修改内容，但是不能修改指向的关系）如果想要它的指向关系的属性也不能改的话，应该怎么办？
// Object.freeze(obj)  阻止扩展操作（禁止增、删、改（针对对象自身的属性）） 
// Object.seal(obj)  封装操作（不能加不能减，但是属性可变）
// Object.preventExtensions(obj)  冻结操作（阻止新增属性；它并不阻止删除或修改已有属性）
function deepFreeze(obj) {
  // 只冻结对象类型，排除 null
  if (obj === null || typeof obj !== 'object') return obj;
  const seen = new WeakSet();
  // ws.add(value)       WeakSet的API
  // ws.delete(value)
  // ws.has(value)
  (function _deepFreeze(o) {
    if (o === null || typeof o !== 'object') return;
    if (seen.has(o)) return;     // 已处理（防止循环）
    seen.add(o);
    // 冻结自身（属性描述符变为 non-configurable & non-writable）
    Object.freeze(o);
    // 递归冻结所有可枚举属性的值（也可以遍历 Object.getOwnPropertyNames/符号）
    Object.getOwnPropertyNames(o).forEach(name => {
      const val = o[name];
      _deepFreeze(val);
    });
    // 也别忘了 Symbol 属性（如果你想完整处理）
    Object.getOwnPropertySymbols(o).forEach(sym => {
      _deepFreeze(o[sym]);
    });
  })(obj);
  return obj;
}

// Reflect.ownKeys(obj) 能拿到 所有键（包含 Symbol）
// Symbol 是一种永远不会重复的唯一值
// 上一行的代码只会让obj不可变，但obj的属性如果指向其它对象，其它对象如果没被冻结，还是可以修改的
// 所以如果想要整体的对象所关联的所有对象都不可变，则需要该对象递归的调用freeze 
