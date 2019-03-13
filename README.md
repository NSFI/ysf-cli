# ysf-cli

[![NPM version](https://img.shields.io/npm/v/ysf-cli.svg?style=flat)](https://npmjs.org/package/ysf-cli)
[![NPM downloads](http://img.shields.io/npm/dm/ysf-cli.svg?style=flat)](https://npmjs.org/package/ysf-cli)

CLI for [react-ppfish-boilerplate](https://github.com/NSFI/react-ppfish-boilerplate) .

## Getting Started

Install, create and start.

```bash
# Install
$ npm install ysf-cli -g

# Create project
$ ysf new myproject

# Generate page
$ ysf g page

# Start project
$ cd myproject
$ npm start
```

## Commands

We have 2 commands: `new`, `generate`(alias `g`).

### ysf new [options]

Create project in current directory.

#### Usage Examples

```bash
$ ysf new blog
$ ysf new blog --repo=https://内网地址.com:808080/nsfi/nsfi-next-gen-template.git
```

### ysf generate <page> (short-cut alias: "g")

Generate page in current directory.

#### Usage Examples

```bash
$ ysf g home
```

## Generated File Tree

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

Update your project to a specific version of boilerplate.
This CLI tool will read your boilerplate's `./u/update.json` file and execute
update method which was decalared in the `udpate.json`.For example, `delete` will delete your files.

Your boilerplate repo must tag with `x.y.z` as boilerplate's version.
Your project must exist `.boilerplate.json`, which contains your current version(if it doesn't exist, ysf tool only update your project to minium version).

#### Usage Examples

```bash
$ ysf update 0.0.1
$ ysf update 0.0.2 --repo=https://内网地址.com:808080/nsfi/nsfi-next-gen-template.git
$ ysf update --list   # 列出当前可用的版本
```

### How to debug update.json ?

#### Solution 1

Create a `.cache` directory in your project, and then write your `update.json` file in `.cache/u/` folder. Then execute `ysf update --dev`

For example:

```bash
$ cd yourProject
$ mkdir -p .cache/u       # you can treat the .cache folder as CACHE_DIR
$ echo '{"script":{"./*":"./u/debugInYourProject.js"}}' > .cache/u/update.json
$ echo 'console.log(process.argv)' > .cache/u/debugInYourProject.js
$ ysf update --dev --verbose     # see magic ~
```

With `--dev` option, you can test your update.json manually.

> If your project already takes `.cache` folder for other purpose, you can config `cacheFolder` in your project's `.boilerplate.json`。

```json
{
  "cacheFolder": "__anotherName__"
}
```

Execute `ysf update --dev` in your project root folder;

#### Solution 2

It's tricky to clone the boilerplate project next to your project folder. Then config your `.boilerplate.json` in your project as follows

```json
{
  "cacheFolder": "../react-ppfish-boilerplate"
}
```

Execute `ysf update --dev` in your project root folder;

## License

[MIT](https://tldrlegal.com/license/mit-license)
