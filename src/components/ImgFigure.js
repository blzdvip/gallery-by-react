/**
 * Created by yu on 2017/7/6.
 */
import React from 'react';

class ImgFigure extends React.Component {
  render() {

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
}
ImgFigure.defaultProps = {
};


export default ImgFigure;
