import React, { useEffect, useRef, useState } from "react";
import "./index.css"
import { getImage } from "../../../utils/request";
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import { Popover } from "antd";
const bcgStyle: React.CSSProperties = {
  height: '500px',
  width: '100% ',
  backgroundColor: 'white',
  bottom: '0px',
  overflow: 'hidden',

  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};
const footerLiStyle: React.CSSProperties = {
  width: "100px",
  height: "100px",
  borderRadius: "50%",
  border: "5px solid black",
  backgroundColor: "transparent",
};
const footerStyle: React.CSSProperties = {
  height: '80px',
  position: "relative",
  padding: '10px 10px 0px 10px',
};
const footerStyleActive: React.CSSProperties = {

};

const toggleStyle: React.CSSProperties = {
  position: 'absolute',
  right: '10px',
  top: '10px',
  height: '20px',
  width: 'auto',
  display: 'flex',
  gap: '5px'
};

export type Image = {
  id: number;
  url: string;
  alt: string;
}
function useGetImageList() {
  const [imageList, setImageList] = useState<Image[]>([]);//否则会错误
  useEffect(() => {
    async function getImageList() {
      const res: [] = (await getImage()).data;
      console.log(res);

      setImageList(res);
    }
    getImageList();
  }, [])
  return {
    imageList,
    setImageList
  }
}
const ImageCircle: React.FC = () => {
  //console.log('-----', (-1) % 4);
  const { imageList, setImageList } = useGetImageList();
  const [imageIndex, setImageIndex] = useState(0);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const changeImageIndex = (key: number): void => {
    stopImage();
    //console.log('key', key);
    setImageIndex(key);
    //console.log(imageList[imageIndex].url);
    beginImage();
  }
  const beginImage = () => {
    if (intervalIdRef.current)
      clearInterval(intervalIdRef.current)
    intervalIdRef.current = setInterval(() => {
      setImageIndex(prevIndex => (prevIndex + 1) % imageList.length);
    }, 1000);
  }
  const stopImage = () => {
    if (intervalIdRef.current)
      clearInterval(intervalIdRef.current);
  }
  useEffect(() => {
    beginImage();
    return () => {
      stopImage();
    }
  }, [imageList])
  function handlePrev() {
    stopImage();
    setImageIndex(prev => prev === 0 ? imageList.length - 1 : (prev - 1) % imageList.length)
    beginImage();
  }
  function handleNext() {
    stopImage();
    setImageIndex(prev => (prev + 1) % imageList.length)
    beginImage();
  }
  const handleMouseEnterBcg = () => {
    stopImage();
  }
  const handleMouseLeaveBcg = () => {
    beginImage();
  }
  return (
    <div style={{ width: '100%' }}>
      <div className="bcg" style={bcgStyle} onMouseEnter={handleMouseEnterBcg}
        onMouseLeave={handleMouseLeaveBcg}
      >

        <Link
          to={`/article/${imageList[imageIndex]?.id}`}
        >

          <img
            src={imageList[imageIndex]?.url}
            alt={imageList[imageIndex]?.alt}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover' // ✨ 核心属性！
            }}
          />


        </Link>



      </div>
      <div className="footer" style={footerStyle}>
        <ul style={{ display: 'flex' }}>
          {imageList.map((val, key) => {
            return (
              <li key={key} className={`${key === imageIndex ? 'active' : ''}`} onClick={() => { changeImageIndex(key) }}></li>
            )
          })}
        </ul>

        <div className="toggle" style={toggleStyle}>
          <LeftOutlined className="prev" onClick={handlePrev} />
          <RightOutlined className="next" onClick={handleNext} />
        </div>
      </div>

    </div>
  )
}
export default ImageCircle;