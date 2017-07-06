require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom'

//获取图片相关数据
let imageDatas = require('../data/imgDatas.json');

//利用自执行函数，将图片名信息转成图片URL路径信息
imageDatas = (function getImageURL(imageDatasArr) {
  for(var i = 0, j = imageDatasArr.length; i < j; i ++) {
    var singleImageData = imageDatasArr[i];

    singleImageData.imageURL = require('../images/' + singleImageData.fileName);
    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr
})(imageDatas);

/**
 * 获取区间内的一个随机数
 */
function  getRangeRandom(low, high){
  return Math.ceil(Math.random() * (high - low) + low);
}

var ImgFigure =  React.createClass({
  render: function() {

    var styleObj = {};

    //如果props属性中指定了这张图片的位置，则使用
    if(this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }

    return (
      <figure className="img-figure" style={styleObj}>
        <img src={this.props.data.imageURL} alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
        </figcaption>
      </figure>
    );
  }
});

var GalleryByReactApp  =  React.createClass({
  Constant: {
    centerPos: {
      left: 0,
      top: 0
    },
    hPosRange: {  //水平方向的取值范围
      leftSecX: [0, 0],
      rightSecX: [0, 0],
      y: [0, 0]
    },
    vPosRange: {  //垂直方向的取值范围
      x: [0, 0],
      topY: [0, 0]
    }
  },

  /**
   * 重新布局所有图片
   * @param centerIndex 指定居中排布哪个图片
   */
  rearrange(centerIndex) {
    var imgsArrangeArr = this.state.imgsArrangeArr,
      Constant = this.Constant,
      centerPos = Constant.centerPos,
      hPosRange = Constant.hPosRange,
      vPosRange = Constant.vPosRange,
      hPosRangeLeftSecX = hPosRange.leftSecX,
      hPosRangeRightSecX = hPosRange.rightSecX,
      hPosRangeY = hPosRange.y,
      vPosRangeTopY = vPosRange.topY,
      vPosRangeX = vPosRange.x,

      imgsArrangeTopArr = [],
      topImgNum = Math.ceil(Math.random() * 2), //取一个或者不取
      topImgSpliceIndex = 0,

      imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

    //首先居中 centerIndex的图片
    imgsArrangeCenterArr[0].pos = centerPos;

    //取出要布局上侧的图片的状态信息
    topImgSpliceIndex = Math.ceil(Math.random() * imgsArrangeArr.length - topImgNum);
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

    //布局位于上侧的图片
    imgsArrangeTopArr.forEach(function (value, index) {
      imgsArrangeTopArr[index].pos = {
        top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
        left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
      }
    });

    //布局左右两侧的图片
    for(var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++){
      var hPosRangeLORX = null;

      //前半部分布局左边，后半布局布局右边
      if(i < k) {
        hPosRangeLORX = hPosRangeLeftSecX;
      } else {
        hPosRangeLORX = hPosRangeRightSecX;
      }

      imgsArrangeArr[i].pos = {
        top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
        left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
      }
    }
    if(imgsArrangeTopArr && imgsArrangeTopArr[0]) {
      imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
    }

    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

    this.state = {
      imgsArrangeArr: imgsArrangeArr
    };
  },
  getInitialState: function () {
    return {
      imgsArrangeArr: [
        /*{
         pos: {
         left: '0',
         top: '0'
         }*/
      ]
    };
  },
  //组件加载后为每张图片计算其位置的范围
  componentDidMount: function () {
    //首先拿到舞台的大小
    var stageDom = ReactDOM.findDOMNode(this.refs.stage),
      stageW = stageDom.scrollWidth,
      stageH = stageDom.scrollHeight,
      halfStageW = Math.ceil(stageW / 2),
      halfStageH = Math.ceil(stageH / 2);

    //imageFigure大小
    var imgFigureDom = ReactDOM.findDOMNode(this.refs.imageFigure0),
      imgW = imgFigureDom.scrollWidth,
      imgH = imgFigureDom.scrollHeight,
      halfImgW = Math.ceil(imgW / 2),
      halfImgH = Math.ceil(imgH / 2);

    //计算中心图片的位置点
    console.log(this.Contant);
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    }

    //计算左右侧区域图片排布位置的取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW - halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[0] = stageH - halfImgH;

    //计算上侧区域图片排布位置的取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    this.rearrange(0);
  },
  render: function () {

    var controllerUntils = [],
      imgFigures = [];

    imageDatas.forEach(function (value, index) {
      if(!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          }
        }
      }

      imgFigures.push(<ImgFigure data={value} ref={'imageFigure' + index} arrange={this.state.imgsArrangeArr[index]}/>);
    }.bind(this));

    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUntils}
        </nav>
      </section>
    );
  }
});
ReactDOM.render(<GalleryByReactApp />, document.getElementById('app'));
module.export =  GalleryByReactApp;
