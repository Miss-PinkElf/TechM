import React from "react";
import "./index.css"
const bcgStyle: React.CSSProperties = {

};
const footerLiStyle: React.CSSProperties = {
  width: "100px",          /* 圆的直径 */
  height: "100px",         /* 必须和 width 相等 */
  borderRadius: "50%"  ,   /* 将正方形变为圆形 */
  border: "5px solid black",/* 设置边框的粗细和颜色 */
  backgroundColor: "transparent", /* 确保内部是透明的，此行也可省略 */
};
const footerStyleActive: React.CSSProperties = {

};

const toggleStyle: React.CSSProperties = {

};



const ImageCircle: React.FC = () => {


  return (
    <div>
      <div className="bcg" style={bcgStyle}>
       
      </div>
      <div className="footer" style={{
        
      }}>
        <ul style={{display:'flex'}}>
          <li ></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
      <div className="toggle"></div>
    </div>
  )
}
export default ImageCircle;