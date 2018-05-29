
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

## License

[MIT](https://tldrlegal.com/license/mit-license)
