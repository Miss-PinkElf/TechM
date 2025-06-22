import { useEffect, useState } from "react";
import { getAllArticleOverviewAPI } from "../../../utils/request";
import { Avatar, Divider, List, Popover, Skeleton, Space, Typography } from "antd";
import Icon, { LikeOutlined, MessageOutlined } from "@ant-design/icons";
import { Article } from "../../../store/types";
import React from "react";
import './index.css';

// (此部分无须修改)
const IconText = ({ icon, text }: { icon: React.FC; text: string | number }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const tabs = ['热门|', '|最新'];
const tabsOrder = new Map<number, (list: Article[]) => Article[]>([[0, (list) => {
  return [...list].sort((a, b) => b.detailInfo.likeNum - a.detailInfo.likeNum)
}],
[1, (list) => {
  return [...list].sort((a, b) => parseInt(b.detailInfo.publicDate) - parseInt(a.detailInfo.publicDate))
}]]);


const ArticleList: React.FC = () => {
  const [nowTabindex, setTabIndex] = useState(0);
  const [articleList, setArticleList] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4); // 你将这里改成了5，保持一致
  const [totalArticles, setTotalArticles] = useState(15);

  // --- 修复部分 1: 使用单一的 useEffect 处理所有数据获取 ---
  useEffect(() => {
    const getAndSortArticles = async () => {
      setLoading(true);
      try {
        // 获取完整的 axios 响应
        const response = await getAllArticleOverviewAPI(currentPage, pageSize);

        // 从响应头中获取总数
        //const total = parseInt(response.headers['x-total-count'] || '0', 10);
        //setTotalArticles(total);

        // 根据当前的 tab 索引对获取到的数据进行排序
        const sortFunction = tabsOrder.get(nowTabindex);
        const sortedArticles = sortFunction ? sortFunction(response.data) : response.data;

        setArticleList(sortedArticles);

      } catch (error) {
        console.error("获取文章列表失败:", error);
        // 实际项目中可以在这里设置错误状态并提示用户
      } finally {
        setLoading(false); // 确保无论成功或失败都关闭加载状态
      }
    };

    getAndSortArticles();
    // 依赖数组包含所有影响数据源的变量
  }, [currentPage, pageSize, nowTabindex]);

  // --- 修复部分 2: 优化 handleChangeTab ---
  const handleChangeTab = (key: number) => {
    setTabIndex(key);
    // 切换 Tab 时，应该重置到第一页，以查看新排序下的首页内容
    setCurrentPage(1);
  };

  // --- 修复部分 3: 优化 handlePageChange ---
  // (此函数现在只负责更新状态，数据获取由 useEffect 统一处理)
  const handlePageChange = (page: number, newPageSize: number) => {
    setCurrentPage(page);
    setPageSize(newPageSize);
  };

  return (
    <div>
      <div className="tab" >
        {tabs.map((val, key) => (
          <span
            key={key}
            className={`${key === nowTabindex ? 'active' : ''}`}
            onClick={() => { handleChangeTab(key) }}
          >
            {val}
          </span>
        ))}
      </div>
      <div className="article-list">
        <List
          dataSource={articleList}
          rowKey='id'
          itemLayout="vertical"
          loading={loading} // 使用 state 控制 List 的加载动画
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalArticles,
            onChange: handlePageChange,
            style: { textAlign: 'center' }
          }}
          renderItem={(item) => (
            <List.Item
              actions={[
                <IconText icon={LikeOutlined} text={item.detailInfo.likeNum} key="list-vertical-like-o" />,
                <IconText icon={MessageOutlined} text={item.detailInfo.commentNum} key="list-vertical-message" />,
              ]}
              extra={
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  style={{ width: '200px', height: '120px', objectFit: 'cover', borderRadius: '4px' }}
                />
              }
            >
              <List.Item.Meta
                avatar={<Avatar src={item.author.avatarUrl} alt={item.author.name} />}
                title={
                  <Popover content={item.title}>
                    <a href={`/article/${item.id}`}>{item.title.length < 25 ? item.title : `${item.title.substring(0, 20)}...`}</a>
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
                {`${item.content.substring(0, 60)}...`}
              </div>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
}

export default ArticleList;