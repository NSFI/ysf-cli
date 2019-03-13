# ysf-cli

[![NPM version](https://img.shields.io/npm/v/ysf-cli.svg?style=flat)](https://npmjs.org/package/ysf-cli)
[![NPM downloads](http://img.shields.io/npm/dm/ysf-cli.svg?style=flat)](https://npmjs.org/package/ysf-cli)

CLI for [react-ppfish-boilerplate](https://github.com/NSFI/react-ppfish-boilerplate) .

## Getting Started

快速安装并新建一个项目。

```bash
# Install
$ npm install ysf-cli -g

# 在当前目录下创建一个叫myproject的项目
$ ysf new myproject

# 在当前项目下创建一个页面模板，文件夹名称叫page
$ ysf g page

# Start project
$ cd myproject
$ npm start
```

## 支持的命令

### ysf new <projectName>

在当前目录创建一个名叫 `<projectName>`的项目。

#### 示例

```bash
$ ysf new blog
$ ysf new blog --repo=https://内网地址.com:808080/nsfi/nsfi-next-gen-template.git # 自定义脚手架的仓库地址
```

### ysf generate <page> (short-cut alias: "g")

在当前目录生成一个页面。

#### 示例

```bash
$ ysf g home
```

## 生成的文件树如下

```bash
.
├── source
    ├── entries
        └── app
        	└── app.js
    ├── pages
        └── App
    		├── components
    			└── index.js
    		├── reducers
	    		├── initialState.js
	    		├── reducer.js
    			└── rootReducer.js
    		├── actions
    		├── actionTypes
    		├── App.js
    		├── App.less
    		├── index.js
    		├── routes.js
    		└── view.js
	└── views
	    └── App
	    	└── app.ftl
```

### ysf update <version> (short-cut alias: "u")

升级当前项目的脚手架配置至新版本。脚手架项目里有一个文件夹叫`u`，里面包含了从脚手架上一个版本升级到当前版本要做的操作。cli 工具会去读取脚手架里的 `./u/update.json` 文件，然后执行里面声明的更新操作。比如

```json
{
  "backup": [
    "source/appRoutes.js",
    "webpack.config.dev.js",
    "项目里的文件将会复制一份来备份"
  ],
  "override": ["将会覆盖的文件，从脚手架覆盖项目里的对应的文件"],
  "rename": {
    "项目里的文件路径": "新的文件路径"
  },
  "dependencies": {
    "依赖名称": "修改至的版本",
    "react": "~16.5.4"
  },
  "dependenciesRoRemove": ["希望删除的依赖"],
  "devDependencies": {
    "依赖名称": "修改至的版本",
    "eslint": "^5.6.1"
  },
  "devDependenciesRoRemove": ["希望删除的模块"],
  "delete": ["将会被删除的文件或者目录，支持glob"],
  "script": {
    "glob表达式_从项目根目录匹配到文件交给处理脚本": "./u/处理脚本.js",
    "其实脚本可以做任何事情的": "./u/可以不管匹配到的文件.js"
  },
  "hooks": {
    "beforeUpdate": "./u/beforeUpdate.js",
    "afterUpdate": "./u/afterUpdate.js"
  }
}
```

script 会将匹配到的内容转变为命令行参数传递给处理脚本，脚本可以通过 process.argv 参数访问到匹配的文件。
除此以外，脚本还可以通过环境变量获取。

- PROJECT_DIR # 当前执行 ysf update 命令的路径，当前要升级的项目的根路径
- CLI_DIR # ysf 工具所在的路径
- CACHE_DIR # 新版本脚手架的根目录。

script 里的脚本要处理三种情况：

1. 没有匹配到文件
2. 匹配到的文件没有经过处理
3. 匹配到的文件已经处理过

脚手架的版本号采用`x.y.z`的格式，先比较 x 的大小,再比较 y,最后比较 z.在使用新的脚手架版本的项目里，必须有一个`.boilerplate.json` 文件，这个文件里包含当前使用的脚手架版本。版本升级只能一个版本一个版本的升级。

#### 示例

```bash
$ ysf update 0.0.1
$ ysf update 0.0.2 --repo=https://内网地址.com:808080/nsfi/nsfi-next-gen-template.git
$ ysf update --list   # 列出当前可用的版本
```

### 如何调试 update.json ?

脚手架新版本的目录被称作`CACHE_DIR`,我们只要设定新版本的目录以后，我们就能调试升级脚手架的操作了。

#### 方案 1

在项目根目录下创建一个`.cache` 文件夹，然后在 `.cache/u/` 文件夹里配置你的 `update.json` 。
在项目根目录下执行`ysf update --dev`，就可以测试了。

这种方式相当于将将新版本的脚手架位置设置为了当前项目下的`.cache`文件夹。

For example:

```bash
$ cd yourProject
$ mkdir -p .cache/u       # you can treat the .cache folder as CACHE_DIR
$ echo '{"script":{"./*":"./u/debugInYourProject.js"}}' > .cache/u/update.json
$ echo 'console.log(process.argv)' > .cache/u/debugInYourProject.js
$ ysf update --dev --verbose     # see magic ~
```

> 如果你的项目里已经用了 `.cache` 这个文件夹的名称了，你还可以在项目根目录下的 `.boilerplate.json`里配置`cacheFolder` ，修改为其他文件夹的名称。

```json
{
  "cacheFolder": "__anotherName__"
}
```

执行 `ysf update --dev` 将会从你的执行 `__anotherName/u/update.json`里声明的一些更新操作。

#### 方案 2

将脚手架 clone 到本地，与项目根目录平级（不是克隆到项目根目录里，而是克隆到项目根目录的外面），然后配置你的`.boilerplate.json`如下：
```json
{
  "cacheFolder": "../react-ppfish-boilerplate"
}
```

在项目根目录下执行 `ysf update --dev` 将会读取外层脚手架目录里的`update.json`

## License

[MIT](https://tldrlegal.com/license/mit-license)
