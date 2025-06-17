import React from "react";
import ImageCircle from "./components/ImageCircle";
const HomePage: React.FC = () => {
  return (
    <div>
      <ImageCircle />
      <div style={{ display: 'flex' }}>
        <span>热门</span><span>最新</span>
      </div>
    </div>
  )
};

export default HomePage;
