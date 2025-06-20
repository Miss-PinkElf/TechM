import { Divider, List, Popover, Skeleton } from 'antd';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from 'react-router-dom';

// 你的静态数据
const data = [
  { "url": "/image/1.png", "id": "49cd" },
  { "url": "/image/2.png", "id": "5115" },
  { "url": "/image/3.png", "id": "406d" },
  { "url": "/image/4.png", "id": "2bba" },
  { "url": "/image/5.png", "id": "ea34" }
];

type MyImage = {
  url: string;
  id: string;
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
            <List.Item key={item.id}>

              <Link to={"/article/23"}>
                <Popover content={`niadwjaiw`}>
                  <img
                    src={item.url}
                    alt={`Image ${item.id}`} //alt?s
                    style={{ width: '100%', height: 'auto' }}
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