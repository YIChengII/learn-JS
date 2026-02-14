const { get } = require("http")
const { type } = require("os")

// async
function asyncSquare(a, cb) {
  setTimeout(() => {
    cb(null, a * a)
  }, 50 + Math.random() * 10)
}

asyncSquare(5, (err, result) => {
  console.log(result)
})
var a = [1, 2, 3, 4, 5, 6, 7, 8]

asyncMap(a, asyncSquare, (err, result) => {
  console.log(result)
})


// ① 为什么用 result[i] = r 而不是 result.push(r)?
// 因为异步任务完成的时间是不确定的（B 可能比 A 快）。
// 如果用 push，结果数组的顺序就乱了。通过 result[i]，
// 我们保证了无论谁先回来，最终数组的顺序和输入数组是一一对应的。
function asyncMap(arr, asyncMapper, cb) {
  var result = []
  var count = 0
  if (arr.length == 0) {
    cb()
  }
  for (let i = 0; i < arr.length; i++) {
    asyncMapper(arr[i], (err, r) => {  // r是结果
      result[i] = r // 成功了的话，就是这样调用
      count++ // 所以count++是数组里面真实的元素
      // 初始状态：var result = []，此时 length 是 0。
      // 异步任务 3 先回来了：它的索引 i 是 2。
      // 赋值：执行 result[2] = '结果C'。
      // 此时，数组在内存里的样子是这样的： [ <2个空位>, '结果C' ]
      // 重点来了： 此时你打印 result.length，它会告诉你 3。
      // 为什么是 3？ 因为你占领了索引为 2 的坑位，JavaScript 引擎为了保证数组的连续性，
      // 会自动认为索引 0 和 1 虽然现在没东西，
      // 但它们已经是数组的一部分了。 公式：最大下标(2) + 1 = 3。
      // 模拟执行过程： 这个是为了防止稀疏数组的
      // 任务 1 和 2 还在网络上飞。
      // 任务 3（索引 2）最先飞回来，执行了 result[2] = 'C'。
      // 此时 result.length 瞬间变成了 3。
      // 代码检查：if (3 == 3) —— 成立了！
      // cb 被触发，把 [undefined, undefined, 'C'] 传给了用户。
      // 结果：用户拿到了错误的数据，而任务 1 和 2 的结果还没来得及装进去。
      if (count == arr.length) {
        cb(null, result)
      }
    })
  }
}
function asyncMap(arr, asyncMapper) {
  // 把每一项都变成一个 Promise 包裹
  const promises = arr.map(item => {
    return new Promise((resolve, reject) => {
      asyncMapper(item, (err, r) => {
        if (err) reject(err);
        else resolve(r);
      });
    });
  });

  return Promise.all(promises);
}
function series(tasks, allDone) {
  var count = 0
  var i = 0
  function done1() {
    count++
    i++
    if (count == tasks.length) {
      allDone()
    } else {
      tasks[i](done1)
    }
  }
  if (tasks.length == 0) {
    allDone()
  } else {
    tasks[0](done1)
  }
}

//尝试实现TaskQueue类型
// addTask方法，添加任务,动态的添加任务
// 头条的面试题
class TasksQueue {
  constructor() {
    this._tasks = []
    this._running = false
  }
  _startNextTask() {
    if (this._tasks.length > 0) {
      var task = this._task.shift()
      task(() => {
        this._startNextTask()
      })
    } else {
      this._running = false
    }
  }
  addTasks(task) {
    if (this._running == true) {
      this._tasks.push(task)
    } else {
      this._running = true
      task(() => {
        this._startNextTask()
      })
    }
  }
}

// 异步
tq = new TasksQueue(3)
class TasksQueue {
  constructor(paralleLimit = 3) {
    this._paralleLimit = paralleLimit // 并行限制
    this._tasks = []
    this._runningCount = 0
  }
  _startNextTask() {
    if (this._tasks.length > 0) {
      var task = this._task.shift()
      task(() => {
        this._startNextTask()
      })
    } else {
      this._runningCount--
    }
  }
  addTasks(task) {
    if (this._runningCount < this._paralleLimit) {
      this._tasks.push(task)
    } else {
      this._runningCount++
      task(() => {
        this._startNextTask()
      })
    }
  }
}




story.chapterUrls.reduce(function (sequence, chapterUrl) {
  return sequence.then(function () {
    return getJSON(chapterUrl);
  }).then(function (chapter) {
    addHtmlToPage(chapter.html);
  });
}, Promise.resolve())

// Promise.all()方法

function resolve(val) {
  return new promise(resolve => {
    resolve(val)
  })
}

function reject(reason) {
  return new promise((resolve, reject) => {
    reject(reason)
  })
}

// 接受若干个promise对象，返回一个promise对象，
// 最终resolve出若干个peomise对象的结果组成的数组
function all(promises) {
  return new promise((resolve, reject) => {
    var result = []
    var count = 0
    if (promises.length == 0) { // 数组可能为空
      resolve(result)
    }
    for (let i = 0; i < promises.length; i++) {
      Promise.resolve(promises[i]).then(val => { //可以接受平常的数据
        result[i] = val
        count++
        if (count == promises.length) {
          resolve(reuslt)
        }
      }, reason => { // 任何一个可能出错
        reject(reason)
      })
    }
  })
}


// race会返回一个promise对象
// 其结果为参数中最先得到结果的promise对象的结果
function race(promises) {
  return new promise((resolve, reject) => {
    for (let i of promises) {
      Promise.resolve(i).then(val => {
        resolve(val)
      }, reason => {
        reject(reason)
      })
    }
  })
}

// 它会等待所有的promise都完成
// 并且把每个的结果收集到一个数组中
// 数组里面是对象，每个对象表示一个promise的结果
// {status: , value/ reason}
function allSettled(promises) {
  return new promise(resolve => {
    var reuslt = []
    var count = 0
    for (let i = 0; i < promises.length; i++) {
      Promise.resolve(promises[i]).then(val => {
        result[i] = {
          status: 'fulfilled',
          value: val
        }
        count++
        if (count == promises.length) {
          resolve(result)
        }
      }, reason => {
        result[i] = {
          status: 'rejected',
          reason: reason,
        }
        count++
        if (count == promises.length) {
          resolve(result)
        }
      })
    }
  })
}

// finally(() => {

// 这个方法比较特殊，如果它接到一个promsise的值的话那么的话下面的then接到的是finally上面的那个
// promise的传递
// then 必须等待finally的promise拿到后才可以等到前面的then穿透过来
// })
// .then(() => {
// finally 的设计初衷是：无论结果是成功还是失败，
// 都要执行同一段逻辑（比如关闭加载动画、断开数据库连接）。它并不关心具体的成功值或失败原因。
// })

Promise.prototype.finally = function (f) {
  return this.then(value => {
    Promise.resolve(f()).then(() => value)
  }, reason => {
    Promise.resolve(f()).then(() => { throw reason })
  })
}



getJSON('stroy.json')
  .then(story => {
    var chapterPromises = story.chapterUrls.map(chapterUrl => getJSON(chapterUrls))
    return Promise.all(chapterPromises)
  }).then(chapters => {
    for (var chapter of chapters) {
      showHTML(chapter)
    }
  })


//确定章节
getJSON('stroy.json')
  .then(stroy => {
    var chapterPromises = story.chapterUrls.map(chapterUrl => getJSON(chapterUrls))
    Promise.resolve()
      .then(() => {
        return chapterPromises[0]
      })
      .then(() => {
        showHTML(chapter)
      })
      .then(() => {
        return chapterPromises[1]
      })
      .then(() => {
        showHTML(chapter)
      })
      .then(() => {
        return chapterPromises[2]
      })
      .then(() => {
        showHTML(chapter)
      })
      .then(() => {
        return chapterPromises[3]
      })
      .then(() => {
        showHTML(chapter)
      })
      .then(() => {
        return chapterPromises[4]
      })
      .then(() => {
        showHTML(chapter)
      })
  })

// 不确定章节
// 并行请求，串行显示
getJSON('stroy.json')
  .then(stroy => {
    var chapterPromises = story.chapterUrls.map(chapterUrl => getJSON(chapterUrls))
    var p = Promise.resolve()
    for (let cp of chapterPromises) {
      p = p.then(() => {
        return cp
      })
        .then(() => {
          showHTML(chapter)
        })
    }
  })



// 这个版本是炫技术的版本，所以最好工作中避免，不然同事会削你！！！！ 
return chapterPromises.reduce((p, cp) => {
  return p.then(() => {
    return cp
  })
    .then(() => {
      showHTML(chapter)
    })
}, Promise.resolve())



function ResolvePromise(promise, x, resolve, reject) {
  if (promise === x) {
    reject(new TypeError())
    return
  }
  if (x instanceof MyPromise) {
    x.then(resolve, reject)
    return
  }
  if (x && typeof x === 'object' || typeof x == 'function') {
    var called = false
    try {
      let then = x.then // 如过这个x是个get的话第一遍读没有报错，第二遍可能就是一个函数了
      // 然后就让它到变量里面，变量里面它不会有幺儿子
      if (typeof then === 'function') {
        then.call(x, function resolvePromise(y) {
          if (!called) {
            called = true
            ResolvePromise(promise, y, resolve, reject)
          }
        }, function rejectPromise(r) {
          if (!called) {
            called = true
            reject(r)
          }
        })
      } else {
        resolve(x)
      }
    } catch (e) {
      if (!called) {
        called = true
        reject(e)
      }
    }
  } else {
    resolve(x)
  }
}


Promise.try(y, ...args)


function pTry(f, ...args) {
  return new Promise((resolve, reject) => {
    resolve(f(...args))
  })
}


function withResolvers() {
  var obj = {}
  obj.promise = new Promise((resolve, reject) => {
    obj.resolve = resolve
    obj.reject = reject
  })
  return obj
}

// 生成器函数
// 斐波拉切数列
function* fibb(n) {
  var a = 1
  var b = 1
  for (var i = 0; i < n; i++) {
    yield a
    b = b + a
    a = b - a
  }
}

function* foo() {
  var a = 1
  var b = 2
  if (a > 0) {
    b++
  }
  yield a
  console.log(a)
  yield b
  console.log(b)
  return a * b
}
undefined
gen1 = foo()
// foo {<suspended>}
gen1.next()
// {value: 1, done: false}
gen1.next()
// {value: 3, done: false}
gen1.next()
// {value: 3, done: true}
gen1.next()
// {value: undefined, done: true}

// 给生成器的next方法的参数将会成next所恢复的那句yield的表达式的求值结果
// yield语句的暂停的恢复可以选择返回一个结果，或者是抛出一个值，或者是让函数结束（即return)
// 分别通过调用生成器对象的next,throw和return方法并传入参数来实现
// 生成器对象可以直接被for of语句遍历（它会自动提取出生成出的值，并判断生成器对应的函数是否结束
// 如果结束，for of语句就结束了）
// 展开运算符可以对生成器进行展开

function* foo() {
  yield 1
  yield 2
  yield 3
}
// 其它生成器函数可以用下面的方式调用另外的生成器函数
// 该语句会生成出其它函数所有生的值后再继续
function* bar() {
  yield* foo()
  yield 4
  yield 5
}

// 生成器函数还可以以一种多态的方式用在对象上，如果一个对象有个叫iterator的属性


var obj = {
  x: 1, y: 2,
  [Symbol.iterator]: function () {
    // 它返回的不是生成器对象，但返回的这个对象可以像生成器对象一样使用
    var i = 0
    return {
      next() {
        if (i < 5) {
          return {
            value: i++,
            done: false,
          }
        } else {
          return { value: undefined, done: true }
        }
      }
    }
  }
}

function range(n) {
  return {
    [Symbol.iterator]() {
      let i = 0
      return {
        next() {
          return i < n ? { value: i++, done: false } : { done: true }
        }
      }
    }
  }
}


Number.prototype[Symbol.iterator] = function* () {
  for (var i = 0; i < this; i++) {
    yield i
  }
}

// 这样的话就可以遍历20这个数字了!
for (var x of 20) {
  console.log(x)
}



// Symbol 符号：
// var a = Symbol()
// 是es6新增的原始类型，即typeof返回的是'Symbol'
// 一个Symbol只是一个唯一的标识符，它一般不参与其它运算，只需要使用标识符的情况下使用
// Symbol单独使用的时就做为一个标识符来使用的，跟另一个标识符做对比判断是否是同一个标识符
// 另一个主要的方法就是做对象的属性或map的key，要想取出这个Symbol对应得值，必须拿到这个Symbol本身
// 无法通过其它手段运算得到一个以及存在的Symbol


// Symbol现在做为一些多态接口的名字，而以前多态接口往往是用字符串属性做为接口名的
// Symbol不会触发隐式类型转换
// We known symbol: 众所周知的Symbol
// 一些多态的接口都是会把接口名设计为这些well known symbols
// 我们想要接入这些多态的接口（如for of),就得给对象增加这些symbol属性的方法


a = { length: 0 }

aa = new Proxy(a, {
  set(target, prop, value) {
    if (prop == 'length') {
      for (var i = value; i < target.length; i++) {
        delete target[i]
      }
      target.length = value
    } else {
      if (prop >= target.length) {
        target[prop] = value
        target.length = +prop + 1
      } else {
        target[prop] = value
      }
    }
  }
})


/*
bigint:
bigint是原始类型，所以typeof对它不返回'object'
创建时也不用加new
它有直接量的写法： var x = 232131231231231231231232124314n
bigint只能跟bigint进行运算
bigint的高精运算都只在运算符中产生
弱引用对象和弱引用集合时不会影响到它的销毁的
*/




function getValue(val, time = 2000) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(val)
    }, time)
  })
}

function * foo() {
  var a = yield getValue(8)
  console.log(a)
  var b = yield getValue(15)
  console.log(b)
  return a + b
}


/*
以我们希望的方式执行一个总是生成promise的生成器函数
每生成一个promise出来，我们就等待这个promise的结果
之后再恢复生成器函数的执行
函数运行完的时候就是返回promise.resolve的时候
*/
function run(genFn) {
  var generator = genFn()
  // var generated = generator.next()
  step()
  function step(val) {
    generator.next(val).value.then(val => {
      step(val)
    })
  }
}


function run(genFn) {
  return new Promise((resolve, reject) => {
    var generator = genFn()
    var generated = generator.next()
    step()
    function step(val) {
      if(generated.done === true) {
        resolve(generated.value)
      } else {
        generated.value.then(val => {
          generated = generator.next() 
          step()
        }, reason => {
          generated = generator.throw(reason)
          step()
        })
      }
    }
  })
}


// 这就是 async/await 的底层灵魂。 当你写 await 的时候，
// 其实 JS 引擎就在后台跑着类似这样的一套 step 逻辑。
function run(genFn) { // genFn生成器函数
  return new Promise((resolve, reject) => {
    var generator = genFn() // generator迭代器
    try {
      var generated = generator.next()
      step()
    } catch(e) {
      reject(e)
    }
    step()
    function step(val) { // 递归函数
      if(generated.done === true) {
        resolve(generated.value)
      } else {
        generated.value.then(val => {
          try {
            generated = generator.next() 
          } catch(e) {
            reject(e)
          }
          step()
        }, reason => {
          try {
            generated = generator.throw(reason)
            step()
          } catch(e) {
            reject(e)
          }
        })
      }
    }
  })
}


// 这样写的好处的话就是promise出错前直接处理掉这个错误
function* foo() {
  // 我们给每个 Promise 后面直接挂一个 .catch
  // 这样错误在“产出”给 yield 之前就已经被处理成了正常的值
  const a = yield getValue(8).catch(err => ({ error: 'A失败', data: null }));
  const b = yield getValue(15).catch(err => ({ error: 'B失败', data: null }));

  if (a.error) console.log("处理 A 的错误");
  if (b.error) console.log("处理 B 的错误");
}


/*
同步生成器：可以连续不断的立刻把结果给你生成出来
异步生成器：生成一个值可以需要等一会
异步生成器每次的next调用将返回一个promise对象，该对象会在函数按自己的节奏运行到对应的那句
yield时才resolve出一个型如{done, value}这样的对象异步生成器不能用在...展开运算符中，因为这个运算符期待
的是一个同步的生成器对象
但是针对异生成器有一个for await of
*/



g = foo()
for(;;) {
  var obj = await g.next()
  if(obj.done === true) {
    break
  }
  var x = obj.value
  console.log(x)
}

for await (var x of foo()) {
  console.log(x)
}


/*
await关键字只能出现在异步函数中
还有另一个位置可以出现就是es模块文件的顶层，普通的js文件的顶层代码块是不能使用await的
当模块文件的顶层代码块出现await时，模块文件就成为了一个异步模块
*/
