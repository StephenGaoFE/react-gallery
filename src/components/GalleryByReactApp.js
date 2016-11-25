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

//获取区间内的一个随机值
let getRangeRandom = (low, high) => Math.floor(Math.random() * (high - low) + low);

//获取0-30度之间的一个任意正负值,正负概率各50
let get30DegRandom = () => {
  let deg = (Math.random() > 0.5) ? '' : '-';
  return deg + Math.ceil(Math.random() * 30)
}

// 单张照片组件
class ImgFigure extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  //imgsFigue的点击处理函数
  handleClick(e) {
    //翻转和居中图片
    if (this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  }

  render() {
    let styleObj = {};
    //如果props属性中指定了这张图片的位置， 则使用
    if (this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }
    //如果图片的旋转角度有值且不为0，添加旋转角度
    if (this.props.arrange.rotate) {
      (['Moz', 'Ms', 'Webkit', '']).forEach((value) => {
        styleObj[value + 'Transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
      })
    }
    //位于最上层
    if (this.props.arrange.isCenter) {
      styleObj.zIndex = 11;
    }
    //控制图片翻转
    let imgFigureClassName = 'img-figure';
    imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : ''
      //figure:单独抽出来仍然有意义的组件。单个照片item
    return (
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
				<img src={this.props.data.imageURL} alt={this.props.data.title}/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>
            <p>{this.props.data.desc}</p>
          </div>
				</figcaption>
			</figure>
    );
  }
}

//控制组件
class ControllerUnit extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    //如果点击的是当前正在选中态的按钮，则翻转图片，否则将对应的图片居中
    if (this.props.arrange.isCenter) {
      this.props.inverse()
    } else {
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  }

  render() {
    let controllerUnitClassName = 'controller-unit';
    //如果对应的是居中的图片，显示控制按钮的居中态
    if (this.props.arrange.isCenter) {
      controllerUnitClassName += ' is-center ';
      //如果同时是翻转图片，显示翻转状态
      if (this.props.arrange.isInverse) {
        controllerUnitClassName += 'is-inverse'
      }
    }
    return (
      <span className={ controllerUnitClassName } onClick={this.handleClick}></span>
    )
  }
}


class GalleryByReactApp extends React.Component {
  constructor(props) {
    super(props);
    this.Constant = {
      centerPos: { //中心位置
        left: 0,
        right: 0
      },
      hPosRange: { //水平方向的取值范围
        leftSecX: [0, 0], //左分区
        rightSecX: [0, 0],
        y: [0, 0]
      },
      vPosRange: { //垂直方向的取值范围
        x: [0, 0],
        topY: [0, 0] //上分区
      }
    };

    // 保存状态
    this.state = {
      imgsArrangeArr: [
        // {
        // 	pos: {
        // 		left: '0',
        // 		top: '0'
        // 	},
        // 	rotate: 0, //旋转角度
        // 	isInverse: false, //正反面
        // 	isCenter: false //图片是否居中
        // }
      ]
    };
  }

  /**
   * 翻转图片
   * @param  {[type]} index [description]
   * @return {Function}     返回一个闭包函数
   */
  inverse(index) {
    return () => {
      let imgsArrangeArr = this.state.imgsArrangeArr;
      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
      this.setState({
        imgsArrangeArr: imgsArrangeArr
      })
    }
  }

  /*利用rearrange函数
   *居中对应index的图片
   */
  center(index) {
    return () => {
      this.rearrange(index);
    }
  }

  /**
   * 重新布局所有图片
   * @param centerIndex 指定居中排布哪个图片
   */
  rearrange(centerIndex) {
    let imgsArrangeArr = this.state.imgsArrangeArr,
      Constant = this.Constant,
      centerPos = Constant.centerPos,
      hPosRange = Constant.hPosRange,
      vPosRange = Constant.vPosRange,
      hPosRangeLeftSecX = hPosRange.leftSecX,
      hPosRangeRightSecX = hPosRange.rightSecX,
      hPosRangeY = hPosRange.y,
      vPosRangeTopY = vPosRange.topY,
      vPosRangeX = vPosRange.x,
      //上侧区域
      imgsArrangeTopArr = [],
      topImgNum = Math.floor(Math.random() * 2), //顶部数量，取一个或者不取
      topImgSpliceIndex = 0,
      //取出居中图片 取出centerIndex一个元素
      imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

    //首先居中centerIndex图片 ,centerIndex图片不需要旋转
    imgsArrangeCenterArr[0] = {
      pos: centerPos,
      rotate: 0,
      isCenter: true
    }

    //取出要布局上测的图片的状态信息
    topImgSpliceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

    //布局位于上侧的图片
    imgsArrangeTopArr.forEach((value, index) => {
      imgsArrangeTopArr[index] = {
        pos: {
          top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
          left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
        },
        rotate: get30DegRandom(),
        isCenter: false
      }
    });

    //布局左右两侧的图片
    for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
      let hPosRangeLORX = null;

      //前半部分布局左边,右半部分布局右边
      if (i < k) {
        hPosRangeLORX = hPosRangeLeftSecX;
      } else {
        hPosRangeLORX = hPosRangeRightSecX
      }

      imgsArrangeArr[i] = {
        pos: {
          top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
          left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
        },
        rotate: get30DegRandom(),
        isCenter: false
      }
    }

    //把元素填充回去
    if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
      imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
    }
    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
    this.setState({
      imgsArrangeArr: imgsArrangeArr
    });
  }


  // 组件加载以后，为每张图片计算其位置的范围
  componentDidMount() {
    //首先拿到舞台的大小
    let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
      stageW = stageDOM.scrollWidth,
      stageH = stageDOM.scrollHeight,
      halfStageW = Math.ceil(stageW / 2),
      halfStageH = Math.ceil(stageH / 2);

    // 拿到一个imageFigure的大小
    let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
      imgW = imgFigureDOM.scrollWidth,
      imgH = imgFigureDOM.scrollHeight,
      halfImgW = Math.ceil(imgW / 2),
      halfImgH = Math.ceil(imgH / 2);

    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    }

    //计算左侧,右侧区域图片排布的取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;

    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;

    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;
    //计算上测区域图片排布的取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;

    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    let num = Math.floor(Math.random() * 10);
    this.rearrange(num);

  }

  render() {
    let controllerUnits = [],
      imgFigures = [];

    imageDatas.forEach((value, index) => {
      if (!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isInverse: false,
          isCenter: false
        }
      }
      imgFigures.push(<ImgFigure data={value} key={index} ref={'imgFigure' + index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);

      controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
    });

    return (
      <section className="stage" ref="stage">
				<section className="img-sec">
					{imgFigures}
				</section>
				<nav className="controller-nav">
					{controllerUnits}
				</nav>
			</section>
    );
  }
}

GalleryByReactApp.defaultProps = {};

export default GalleryByReactApp;