import { useEffect, useState } from "react";
import { getAllArticleOverviewAPI } from "../../../utils/request";
import { Avatar, Divider, List, Popover, Skeleton, Space, Typography } from "antd";
import Icon, { LikeOutlined, MessageOutlined } from "@ant-design/icons";
import { Article } from "../../../store/types";
import React from "react";
import './index.css'
//AI
const IconText = ({ icon, text }: { icon: React.FC; text: string | number }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const tabs = ['热门|', '|最新'];
const tabsOrder = new Map<number, (list: Article[]) => Article[]>([[0, (list) => {
  // list.sort((a, b) => {
  //   return a.detailInfo.likeNum - b.detailInfo.likeNum
  // })只能通过set来改变state 使用[...list] 或者lodash
  return [...list].sort((a, b) => {
    return b.detailInfo.likeNum - a.detailInfo.likeNum
  })

}],
[1, (list) => {
  return [...list].sort((a, b) => {
    return a.detailInfo.publicDate > b.detailInfo.publicDate ? -1 : 1
  })
}]])
const ArticleList: React.FC = () => {
  const [nowTabindex, setTabIndex] = useState(0)
  const [articleList, setArticleList] = useState<Article[]>([])
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [totalArticles, setTotalArticles] = useState(0);
  useEffect(() => {
    const getArticles = async () => {
      const res = (await getAllArticleOverviewAPI(currentPage, pageSize)).data;
      setArticleList(res.data)
      const total = parseInt(res.headers['x-total-count'] || '0', 10);
      setTotalArticles(total);
    }
    getArticles();
    setLoading(false); // 请求结束后，取消 loading

  }, [])
  const handleChangeTab = (key: number) => {
    setTabIndex(key);
    console.log('-----', [articleList]);
    //应该做NPE
    setArticleList(tabsOrder.get(key)!);
  }
  const handlePageChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };
  return (
    <div>
      <div className="tab" >
        {tabs.map((val, key) => {
          return (
            <span
              key={key}
              className={`${key === nowTabindex ? 'active' : ''}`}
              onClick={() => { handleChangeTab(key) }}
            >
              {val}
            </span>
          )
        })}
      </div>
      <div className="article-list">
        <List
          dataSource={articleList}
          rowKey='id'
          itemLayout="vertical"
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalArticles,
            onChange: handlePageChange, // 切换页面时调用
            style: { textAlign: 'center' } // 让分页条居中
          }}
          renderItem={(item) => {
            return (
              <List.Item
                actions={[
                  <IconText icon={LikeOutlined} text={item.detailInfo.likeNum} key="list-vertical-like-o" />,
                  <IconText icon={MessageOutlined} text={item.detailInfo.commentNum} key="list-vertical-message" />,
                ]}
                extra={
                  <img
                    src={item.imageUrl}
                    alt={item.title} // alt 属性对于 SEO 和可访问性很重要
                    style={{ width: '200px', height: '120px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                }
              >

                <Skeleton loading={loading} avatar active>

                  <List.Item.Meta
                    avatar={<Avatar src={item.author.avatarUrl} />}
                    title={<Popover content={item.title}>
                      <a href={`/article/${item.id}`}>{item.title.length < 25 ? item.title : `${item.title.substring(0, 20)}...`
                      }</a>
                    </Popover>
                    }
                    description={

                      <Space size={8} split={<Divider type="vertical" />}>
                        <Typography.Text>{item.author.name}</Typography.Text>
                        <Typography.Text type="secondary">
                          {new Date(parseInt(item.detailInfo.publicDate)).toLocaleString()}
                        </Typography.Text>
                      </Space>
                    }
                  />
                  <div className="article-content">
                    {item.content}
                  </div>

                </Skeleton>
              </List.Item>
            )
          }}
        >

        </List>
      </div>
    </div>
  )
}

export default ArticleList;