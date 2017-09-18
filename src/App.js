import React, { Component } from 'react';
import './App.css';
 import ImgFigure from './components/ImgFigure'
 import ControllerUnit from './components/ControllerUnit'

var imgDatas = require('./data/imageDate.json');

//利用自执行函数将图片信息转成图片的URL
imgDatas = (function  getImageURL(imageDateArr) {
  for (var i = 0; i < imageDateArr.length; i++) {
    let singleImageDate = imgDatas[i];

    singleImageDate.imgeURL = require('./images/' + singleImageDate.filename);
    imgDatas[i] = singleImageDate;
  }
  return imageDateArr;
})(imgDatas);

class App extends Component {
  constructor(...args) {
    super(...args);
    this.Constant = {
        centerPos: {
          left: 0,
          right: 0
        },
        hPosRange: {  //水平方向的取值范围
          leftSecX: [0, 0],
          rightSecX: [0, 0],
          y: [0, 0]
        },
        vPosRange: { //垂直方向的取值范围
          x: [0, 0],
          topY: [0, 0]
        }
    }

    let imgsArrangeArrTemp = [];
    imgDatas.forEach((value, index) => {
      imgsArrangeArrTemp.push({
        pos: {
          left: 0,
          top: 0
        },
        rotate: 0,           //旋转角度
        isInverse: false,    //图片正反面
        isCenter: false      //图片是否居中
      })
    }); 
    
    this.state = {
      imgsArrangeArr: imgsArrangeArrTemp
    }
  }

  componentDidMount() {
    //拿到舞台的大小
    let stageDOM = this.refs.stage,
        stageW = stageDOM.scrollWidth,
        stageH = stageDOM.scrollHeight,
        halfStageW = Math.ceil(stageW / 2),
        halfStageH = Math.ceil(stageH / 2);

    //拿到一个imageFgure的大小
    let //imgFigureDOM = this.refs.imgFigure0,
        imgW =  380, //imgFigureDOM.scrollWidth,
        imgH = 400, //imgFigureDOM.scrollHeight,
        halfImgW = Math.ceil(imgW / 2),
        halfImgH = Math.ceil(imgH / 2);

    //计算左侧、右侧区域图片排布位置的取值范围
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    };
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] =  halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    //计算上册区域图片排布位置的取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[0] = halfStageW;

    imgDatas.forEach((value, index) => {
      if (!this.state.imgsArrangeArr[index]) {
        var style = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isInverse: false,
          isCenter: false 
        };
        this.setState({
          imgsArrangeArr: this.state.imgsArrangeArr.splice(index, 1, style)
        })
      }
    }) 

    this.rearrange(0);

  }

  //获取区间内的一个随机值
  getRangeRandom(low, high) {
    return Math.ceil(Math.random() * (high - low) + low);
  }

  //获得0~30°之间的一个任意整数
  get30DegreeRandom() {
    return (Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30);
  }

  //翻转图片 index: 输入当前被执行inverse操作的图片对应的图片信息数组的index值
  inverse(index) {
    return function() {
      var imgsArrangeArr = this.state.imgsArrangeArr;

      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
      this.setState({
        imgsArrangeArr: imgsArrangeArr
      })
    }.bind(this)
  }

  //重新布局所有图片
  //@param: centerIndex 指定居中排布哪个图片
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

    //首先居中 centerIndex 的图片
    imgsArrangeCenterArr[0] = {
      pos: centerPos,
      rotate: 0,              //居中的图片不需要旋转
      isCenter: true
    }

    //取出要布局上侧的图片的状态信息
    topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

    //布局位于上侧的图片
    imgsArrangeTopArr.forEach((value, index) => {
      imgsArrangeTopArr[index] = {
        pos: {
          top: this.getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
          left: this.getRangeRandom(vPosRangeX[0], vPosRangeX[1])
        },
        rotate: this.get30DegreeRandom(),
        isCenter: false
      }
    })

    //布局左右两侧的图片
    for ( var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
      let hPosRangeLORX = null;

      //前半部分布局在左边，右半部分布局在右边
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
        rotate: this.get30DegreeRandom(),
        isCenter: false
      };
    }

    if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
      imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
    }

    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

    this.setState({
      imgsArrangeArr: imgsArrangeArr
    });
  }

  //利用rearrange, 居中对应index的图片
  //index: 需要被居中的图片对应的图片信息数组的index值
  center(index) {
    return function () {
      this.rearrange(index)
    }.bind(this)
  }

  render() {

    let controllerUnits = [],
        imgFigures = [];

    imgDatas.forEach((value, index) => {     
      imgFigures.push(
              <ImgFigure 
                key={index} 
                ref={`imgFigure${index}`} 
                data={value} 
                arrange={this.state.imgsArrangeArr[index]} 
                inverse={this.inverse(index)}
                center={this.center(index)}
              />);
      controllerUnits.push(
              <ControllerUnit 
                key={index} 
                arrange={this.state.imgsArrangeArr[index]} 
                inverse={this.inverse(index)}
                center={this.center(index)}
              />)
    }) 

    return <section className="stage" ref="stage">
      <section className="img-sec">
        {imgFigures}
      </section>
      <nav className="controller-nav">
        {controllerUnits}
      </nav>
    </section>
    
  }
}

export default App;
