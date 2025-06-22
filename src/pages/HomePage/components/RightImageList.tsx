import { Divider, List, Popover, Skeleton } from 'antd';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from 'react-router-dom';

// 你的静态数据
const data = [
  {
    "url": "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop",
    "id": "img-01",
    "alt": "React Logo"
  },
  {
    "url": "https://images.unsplash.com/photo-1522252234503-e356532cafd5?q=80&w=1925&auto=format&fit=crop",
    "id": "img-02",
    "alt": "Java Code"
  },
  {
    "url": "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop",
    "id": "img-03",
    "alt": "Code on screen"
  },
  {
    "url": "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=2069&auto=format&fit=crop",
    "id": "img-04",
    "alt": "Laptop with code"
  },
  {
    "url": "https://images.unsplash.com/photo-1550063873-ab792950096b?q=80&w=1894&auto=format&fit=crop",
    "id": "img-05",
    "alt": "Server racks"
  }
]

type MyImage = {
  url: string;
  id: string;
  alt: string;
}

const RightImageList: React.FC = () => {
  const [imageData, setImageData] = useState<MyImage[]>(data);
  //setImageData(data)会无限渲染

  return (
    <div>
      <InfiniteScroll
        dataLength={imageData.length}
        hasMore={imageData.length > 30}//是否加载
        next={() => {
        }}
        loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
        height={500}
        endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
      >

        <List
          dataSource={imageData}
          renderItem={(item) => (
            <List.Item key={item.id} style={{ display: 'flex', justifyContent: 'center' }}>

              <Link to={"/article/23"}>
                <Popover content={`${item.alt}`}>
                  <img
                    src={item.url}
                    alt={`Image ${item.id}`} //alt?s
                    style={{
                      width: '450px',      // 设置一个更适合侧边栏的固定宽度
                      height: '300px',     // 设置一个固定的高度
                      objectFit: 'cover',  // ✨ 核心属性：保持宽高比的同时覆盖整个容器，不变形
                      borderRadius: '8px', // 添加圆角，让图片看起来更柔和
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // 添加一点阴影增加立体感
                      cursor: 'pointer',
                      transition: 'transform 0.3s ease-in-out' // 为鼠标悬浮效果添加平滑过渡
                    }}
                  />
                </Popover>
              </Link>

            </List.Item>
          )}
        />
      </InfiniteScroll>
    </div>
  )
}

export default RightImageList;