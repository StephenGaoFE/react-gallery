require('normalize.css/normalize.css');
require('styles/main.scss');

import React from 'react';
import ReactDOM from 'react-dom';

// 获取图片相关的数据
let imageDatas = require('../data/imageDatas.json');

// 将图片名信息转成图片URL路径信息，es6自执行
imageDatas = ((imageDatasArr) => {
	for (let i = 0, len = imageDatasArr.length; i < len; i++) {
		let singleImageData = imageDatasArr[i];
		singleImageData.imageURL = require('../images/' + singleImageData.fileName);
		imageDatasArr[i] = singleImageData;
	}
	return imageDatasArr;
})(imageDatas);


class GalleryByReactApp extends React.Component {
	render() {
		return (
			<section className="stage">
				<section className="image-sec">
				</section>
				<nav className="controller-nav">
				</nav>
			</section>
		);
	}
}

GalleryByReactApp.defaultProps = {};

export default GalleryByReactApp;