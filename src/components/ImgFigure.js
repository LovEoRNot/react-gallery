import React, { Component } from 'react';

var imgDatas = require('../data/imageDate.json');

//利用自执行函数将图片信息转成图片的URL
imgDatas = (function  getImageURL(imageDateArr) {
  for (var i = 0; i < imageDateArr.length; i++) {
    let singleImageDate = imgDatas[i];

    singleImageDate.imgeURL = require('../images/' + singleImageDate.filename);
    imgDatas[i] = singleImageDate;
  }
  return imageDateArr;
})(imgDatas);

//单张图片
class ImgFigure extends Component {
  render() {
    return  <figure className="img-figure">
      <img src={this.props.data.imgeURL} alt={this.props.data.title}/>
      <figcaption>
        <h2 className="img-title">{this.props.data.title}</h2>
      </figcaption>
    </figure>
  }
}

//图片组合
class ImgFigures extends Component {
  render() {
    let imgFigures = null;
    
    imgFigures = imgDatas.map((value, key) => {
      return <ImgFigure key={key} data={value} />
    })

    return <div>
      {imgFigures}
    </div>
  }
}

export default ImgFigures;