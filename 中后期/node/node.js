
require(x)
// 如果x是内置模块的名称，直接返回内置模块的导出对象
// 如果以.开头或/开头，则表示相对或绝对路径，找到该路径对应的文件并把文件当模块加载
// 加载不了的话抛错
// 如果x不是内置模块但是字母或数字（不是路径符）开头，则在特定文件夹（即当前文件夹中的
// node_modules文件夹）中找该名字的文件夹或文件，如果是文件，当成模块加载
// 如果是文件夹，找到文件夹中的package.json中的main字段，加载该字段对应的文件
// 如果不存在package.json则加载文件夹里的index.js为模块


// (p)npm install --global pnpm
// 全局安装某个包，全局安装的意思是，不在代码中require而是安装为命令行工具，即安装
// 完成后命令行里多了一个命令（一般来说会这样）

// (p)npm install xxxx 是将xxxxx这个包安装到当前文件夹里的node_modules文件夹中，以备
// 代码中去require后使用其中提供的函数或class

// npm是node.js内置的包管理工具，但由于它比较慢，后来就出现了竞争对手yarn和pnpm，目前
// 来看pnpm接受程度更高，安装速度也是最快

// 为什么pnpm安装速度快？
// 它会在电脑上缓存所有以前下载过的包的下载过的版本，如果有重复，不会重新下载
// 当你要安装某个包到项目文件夹得时候，他把不是把代码复制过来，而是通过建立软连接
// （类似快捷方式）（文件夹）以及硬连接（文件）的方式来将模块的文件放入对应的位置


// 软连接： 是指向另一个文件夹的文件夹，软连接文件本身可做为文件使用，类似于windows
// 里面的快捷方式，不过在windows系统的图标上面看不出任何区别
// 当你访问软链接时，操作系统会自动"根据路径去寻找那个真实的文件"


// 硬连接： 硬链接只能针对文件创建，在文件夹看到的普通文件的实体就是一个硬链接，但我们可以
// 为这个文件再次创建一个硬连接，这时两个硬连接指向同一个文件，改变其中一个，另一个也会
// 改变（十分类似于两个变量指向同一个对象）

// 软连接的代码展示

var a = {data: "我是文件原始内容"}

// 软链接对比
var b = {
  get link() {
    return a.data // 它不存内容，只是指向a
  }
}
console.log(b.link) // 输出："我是文件原始内容"

// 如果a消失了（模拟删除原文件）
a = null
console.log(b.link) // 报错或输出undefined,这就是"断链"

////////////////////////////////////////////////////////////

// 模拟硬链接
var data = { content: "我是硬盘上的物理数据" };

var a = data; // 硬链接 1
var b = data; // 硬链接 2

// 此时 a 和 b 是平等的，它们都直接握着这块数据的地址
a = null; // 删掉标签 a
console.log(b.content); // 数据依然存在，因为标签 b 还在连着它


/*
这得怪传统的 npm 和 yarn。为了防止依赖嵌套太深
（导致 Windows 路径过长或重复下载），它们会进行依赖扁平化（Hoisting）。
举个例子：
你在项目里安装了 Express。
Express 自己依赖了 body-parser。
npm install 时，它会把 Express 和 body-parser 都放在 node_modules 的根目录下
结果：你的 package.json 里明明只有 Express，但你在代码里写 
require('body-parser') 居然能跑通！
为什么叫“幽灵”？ 因为它像幽灵一样存在于你的项目中，但不属于你。
万一哪天 Express 升级，不再需要 body-parser 了，你的代码就会因为找不到包而瞬间崩溃。
*/


// 由于npm默认从其官方网站下载，而服务器在国外，所以下载速度比较慢
// 但我们可以让它从其它的镜像站点下载，国内有一个
// https://npmmirror.com
// 网站就是速度最快的镜像站点 

// 只需要在npm的配置文件中（pnpm也会读取同一个配置文件，当然它自己的配置文件）
// 设置为这里就可以了
// npm config set registry https://registy.npmmirror.com
// 配置文件在~/.npmrc

// 上面的命令只是在这个文件中加了一行(文件不存在则会自动创建)：
// registry=https://registry.npmmirror.com

// pnpm install命令（不带参数）
// 将安装package.json文件中声明的所有依赖项
// 一般在项目刚从仓库拉下来时运行一下安装项目的所有依赖


  var fs = require("fs")
  fs.readFile("file.txt", "utf8", function(error, text) {
    if(error) throw error
    console.log("The file contained:", text)
  })
