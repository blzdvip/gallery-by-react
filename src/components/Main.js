require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom'

class ImgFigure extends React.Component {
  constructor(props) {
    super(props);
    this.render = this.render.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  /**
   * imgFigure的点击处理函数
   * @param event
   */
  handleClick(event) {
    if(this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }

    event.stopPropagation();
    event.preventDefault();
  }

  render() {
    var styleObj = {};
    //如果props属性中指定了这张图片的位置，则使用
    if(this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }

    //如果图片的旋转角度有值并且不为0，添加旋转角度
    if(this.props.arrange.rotate) {
      ['-moz-', '-webkit-', '-ms-', ''].forEach(function (value) {

        styleObj[value + 'transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
      }.bind(this));

      if(this.props.arrange.isCenter) {
        styleObj.zIndex = 11;
      }
    }

    var imgFigureClassName = 'img-figure';
    imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

    return (
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
        <img src={this.props.data.imageURL} alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>
            <p>
              {this.props.data.desc}
            </p>
          </div>
        </figcaption>
      </figure>
    );
  }
}

//获取图片相关数据
var imageDatas = require('../data/imgDatas.json');
class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgsArrangeArr: [
        /*{
          pos: {
            left: '0',
            top: '0'
          },
          rotate: 0, //旋转角度
          isInverse: false,  //正反面
          isCenter: false, //图片是否居中
        }*/
      ]
    };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.render = this.render.bind(this);
    this.getImageURL = this.getImageURL.bind(this);
    this.getRangeRandom = this.getRangeRandom.bind(this);
    this.get30DegRandom = this.get30DegRandom.bind(this);
    this.rearrange = this.rearrange.bind(this);
    this.inverse = this.inverse.bind(this);
    this.center = this.center.bind(this);
  }
  /**
   * 获取区间内的一个随机数
   */
  getRangeRandom(low, high){
    return Math.ceil(Math.random() * (high - low) + low);
  }

  /**
   * 获取0~30°之间的一个任意正负值
   * @returns {string}
   */
  get30DegRandom() {
    return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));
  }

  getImageURL(imageDatasArr) {
    for(var i = 0, j = imageDatasArr.length; i < j; i ++) {
      var singleImageData = imageDatasArr[i];

      singleImageData.imageURL = require('../images/' + singleImageData.fileName);
      imageDatasArr[i] = singleImageData;
    }
    return imageDatasArr;
  }

  /**
   * 反转图片
   * @param index 输入当前被执行inverse操作的图片对应的图片数组的index值
   * @returns {function(this:AppComponent)} 这是一个闭包函数，其内return一个真正待被执行的函数
   */
  inverse (index) {
    return function () {
      var imgsArrangeArr = this.state.imgsArrangeArr;

      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

      this.setState({
        imgsArrangeArr: imgsArrangeArr
      });
    }.bind(this);
  }

  /**
   * 居中图片
   * @param index 输入当前被执行inverse操作的图片对应的图片数组的index值
   * @returns {function(this:AppComponent)} 这是一个闭包函数，其内return一个真正待被执行的函数
   */
  center(index) {
    return function (){
      this.rearrange(index);
    }.bind(this);
  }

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
    topImgNum = Math.floor(Math.random() * 2), //取一个或者不取
    topImgSpliceIndex = 0,

    imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

  //首先居中 centerIndex的图片
  imgsArrangeCenterArr[0] = {
    pos: centerPos,
    rotate: 0,
    isCenter: true
  };

   //取出要布局上侧的图片的状态信息
    topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

    //布局位于上侧的图片
    imgsArrangeTopArr.forEach(function (value, index) {
      imgsArrangeTopArr[index] = {
        pos: {
          top: this.getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
          left: this.getRangeRandom(vPosRangeX[0], vPosRangeX[1])
        },
        rotate: this.get30DegRandom(),
        isCenter: false
      };
    }.bind(this));

    //布局左右两侧的图片
    for(var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++){
      var hPosRangeLORX = null;

      //前半部分布局左边，后半布局布局右边
      if(i < k) {
        hPosRangeLORX = hPosRangeLeftSecX;
      } else {
        hPosRangeLORX = hPosRangeRightSecX;
      }

      imgsArrangeArr[i] = {
        pos: {
          top: this.getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
          left: this.getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
        },
        rotate: this.get30DegRandom(),
        isCenter:false
      };
    }

    if(imgsArrangeTopArr && imgsArrangeTopArr[0]) {
      imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
    }

    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

    this.setState({
      imgsArrangeArr: imgsArrangeArr
    });
    console.log(this.state);
 }

 //组件加载后为每张图片计算其位置的范围
  componentDidMount() {
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
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    }

    //计算左右侧区域图片排布位置的取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[0] = stageH - halfImgH;

    //计算上侧区域图片排布位置的取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    this.rearrange(0);
  }
  render() {

    var controllerUntils = [],
      imgFigures = [];

    imageDatas.forEach(function (value, index) {
      if(!this.state.imgsArrangeArr[index]) {
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

      imgFigures.push(<ImgFigure data={value}
                                 key={value.title + index}
                                 ref={'imageFigure' + index}
                                 arrange={this.state.imgsArrangeArr[index]}
                                 inverse={this.inverse(index)}
                                 center={this.center(index)}/>);
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



  //将图片名信息转成图片URL路径信息
  imageDatas = this.getImageURL(imageDatas);

  Constant = {
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
  };
}


AppComponent.defaultProps = {
};


export default AppComponent;
