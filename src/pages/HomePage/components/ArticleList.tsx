import { useEffect, useState } from "react";
import { getAllArticleOverviewAPI } from "../../../utils/request";
import { Avatar, Divider, List, Skeleton, Space, Typography } from "antd";
import Icon, { LikeOutlined, MessageOutlined } from "@ant-design/icons";
import { Article } from "../../../store/types";
import React from "react";

//AI
const IconText = ({ icon, text }: { icon: React.FC; text: string | number }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const tabs = ['热门', '最新'];
const ArticleList: React.FC = () => {
  const [nowTabindex, setTabIndex] = useState(0)
  const [articleList, setArticleList] = useState<Article[]>([])
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getArticles = async () => {
      const res_articles: [] = (await getAllArticleOverviewAPI()).data;
      setArticleList(res_articles);
    }
    getArticles();
    setLoading(false); // 请求结束后，取消 loading
  }, [])
  return (
    <div>
      <div className="tab" >
        {tabs.map((val, key) => {
          return (
            <span
              key={key}
              className={`${key === nowTabindex ? 'active' : ''}`}
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
                {/* 核心修正 #1: Skeleton 组件应该包裹所有在加载时需要显示骨架的内容 
        */}
                <Skeleton loading={loading} avatar active>

                  <List.Item.Meta
                    avatar={<Avatar src={item.author.avatarUrl} />}
                    title={<a href={`/article/${item.id}`}>{item.title}</a>}
                    description={
                      /* 核心修正 #2: 使用 Space 组件来保证 description 内元素水平排列 
                      */
                      <Space size={8} split={<Divider type="vertical" />}>
                        <Typography.Text>{item.author.name}</Typography.Text>
                        <Typography.Text type="secondary">
                          {new Date(item.detailInfo.publicDate).toLocaleDateString()}
                        </Typography.Text>
                      </Space>
                    }
                  />

                  {/* 核心修正 #3: 将文章内容放在 Meta 之后，但在 Skeleton 之内
            并为其添加一个 class，方便用 CSS 控制样式
          */}
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