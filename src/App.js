import React, { Component } from 'react';
import './App.css';

var imgDatas = require('./data/imageDate.json');

//利用自执行函数将图片信息转成图片的URL
imgDatas = (function  getImageURL(imageDateArr) {
  for (var i = 0; i < imageDateArr.lenght; i++) {
    let singleImageDate = imgDatas[i];

    singleImageDate.imgeURL = './images/' + singleImageDate.filename;
    imgDatas[i] = singleImageDate;
  }
  return imageDateArr;
})(imgDatas);

class ImgFigure extends Component {
  render() {
    return  <figure>
    {this.props.data.imgeURL}
      <img src={this.props.data.imgeURL} alt={this.props.data.title}/>
      <figcaption>
        <h2>{this.props.data.title}</h2>
      </figcaption>
    </figure>
  }
}

class App extends Component {
  render() {
    var controllerUnits = [],
        imgFigures = null;
    
    imgFigures = imgDatas.map((value, key) => {
      return <ImgFigure key={key} data={value} />
    })

    return <section className="stage">
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
