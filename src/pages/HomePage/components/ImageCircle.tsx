import React, { useEffect, useRef, useState } from "react";
import "./index.css"
import { getImage } from "../../../utils/request";
import { log } from "console";
const bcgStyle: React.CSSProperties = {
  height: "300px",
  width: '400px',
  backgroundColor: 'white',
  bottom: '0px',
  overflow: 'hidden'
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

type Image = {
  url: string;
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
  return (
    <div style={{ height: '550px', width: "400px" }}>
      <div className="bcg" style={bcgStyle}>
        <img src={imageList[imageIndex]?.url} alt="" style={{ height: "100%", }} />
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
          <button className="prev" onClick={handlePrev}> &lt; </button>
          <button className="next" onClick={handleNext}> &gt; </button>
        </div>
      </div>

    </div>
  )
}
export default ImageCircle;