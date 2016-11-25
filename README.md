# react-gallery
one photo gallery project based on react

根据慕课网 “React实战-打造画廊应用” 课程，使用新版webpack以及ES6重构

使用Yeoman generator for ReactJS and Webpack创建

## how to use
- clone this repo
- npm install 
- `npm start` or `npm run serve`

## reference
- https://github.com/react-webpack-generators/generator-react-webpack
- https://github.com/materliu/gallery-by-react


点击下面链接可以在线预览

https://stephengao666.github.io/gallery-by-react/dist/index.html

所用技术栈为 React、Webpack、sass、ES6

If you have any question, please use email, weibo or QQ to contact me.

Star this repo if you like it！！！

## 感想
generator-react-webpack 这个库简直坑的飞起，萌新杀手。别问我怎么知道的QwQ
- 目前只能支持到react15.3.0，要在package.json中强制限定版本，否则。。呵呵。希望官方修复
- `index.html`里面`src="./assets/app.js`中，assets前少了一个点，否则npm run dist出来有问题
- cfg/default.js里面`publicPath: './assets/'`assets前少了一个点

