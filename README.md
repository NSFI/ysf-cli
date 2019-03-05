
# ysf-cli

[![NPM version](https://img.shields.io/npm/v/ysf-cli.svg?style=flat)](https://npmjs.org/package/ysf-cli)
[![NPM downloads](http://img.shields.io/npm/dm/ysf-cli.svg?style=flat)](https://npmjs.org/package/ysf-cli)

CLI for [react-ant-design-boilerplate](https://github.com/NSFI/react-ant-design-boilerplate) .

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

#### Usage Examples

```bash
$ ysf update 0.0.1
$ ysf u 0.0.2 --repo=https://内网地址.com:808080/nsfi/nsfi-next-gen-template.git
$ ysf u --list   # 列出当前可用的版本
```

If you want to debug the script in the 'u' folder ( short-cut for 'update' ), read following shell commands.

```bash
$ cd yourProject
$ mkdir -p .cache/u       # you can treat the .cache folder as CACHE_DIR 
$ echo '{"script":{"./*":"./u/debugInYourProject.js"}}' > .cache/u/update.json
$ echo 'console.log(process.argv)' > .cache/u/debugInYourProject.js
$ ysf update --dev --verbose     # see magic ~
```

With `--dev` option, you can test your update.json manually.

## License

[MIT](https://tldrlegal.com/license/mit-license)
