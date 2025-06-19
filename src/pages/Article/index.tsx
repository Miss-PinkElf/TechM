import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useParams } from "react-router-dom";
import { getArticle, toggleArticleLikes, toggleArticleMark, toggleLikesComment } from "../../store/modules/articleStore";

// 引入 Ant Design 组件和图标
import { Spin, Card, Typography, Avatar, Button, Divider, List, Space, Empty } from 'antd';
import { LikeOutlined, LikeFilled, StarOutlined, StarFilled } from '@ant-design/icons';

import './Article.css'; // 引入自定义样式

// CommentItem 现在可以直接在 List 的 renderItem 中实现，无需单独文件
// import CommentItem from "./components/CommentItem";

const { Title, Paragraph, Text } = Typography;

const Article: React.FC = () => {
  const { article, comments } = useAppSelector(state => state.article);
  const dispatch = useAppDispatch();
  const { articleId } = useParams<{ articleId: string }>();

  useEffect(() => {
    if (articleId) {
      dispatch(getArticle(articleId));
    }
  }, [articleId, dispatch]);

  const handleToggleArticleLike = () => {
    console.log('------articleLike', article?.detailInfo.ifLike);


    if (articleId) dispatch(toggleArticleLikes(articleId));
    console.log('------articleLike', article?.detailInfo.ifLike);
  };

  const handleToggleArticleMark = () => {
    if (articleId) dispatch(toggleArticleMark(articleId));
  };

  const handleToggleLikeComment = (commentId: string) => {
    dispatch(toggleLikesComment(commentId));
  };

  // 在 article 数据加载完成前，显示加载动画
  // 这是一个在不修改 Redux State 的前提下处理加载状态的简单有效方法
  if (!article) {
    return (
      <div className="page-loading-spinner">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="article-page-container">
      <Card bordered={false}>
        {/* 文章头部 */}
        <header className="article-header">
          <Title level={1} style={{ marginBottom: 24 }}>{article.title}</Title>
          <Space align="center" size="middle">
            <Avatar size={48} src={article.author.avatarUrl} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Text strong>{article.author.name}</Text>
              <Text type="secondary">{new Date(article.detailInfo.publicDate).toLocaleString()}</Text>
            </div>
          </Space>
        </header>

        <Divider />

        {/* 文章内容 */}
        <Paragraph className="article-content" style={{ fontSize: 16, lineHeight: 1.8 }}>
          {/* 在生产环境中，请务必对 HTML 内容进行清洗以防 XSS 攻击 */}
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </Paragraph>

        <Divider />

        {/* 文章操作栏 */}
        <Space size="large" className="article-actions">
          <Button
            type={article.detailInfo.ifLike ? "primary" : "default"}
            icon={article.detailInfo.ifLike ? <LikeFilled /> : <LikeOutlined />}
            onClick={handleToggleArticleLike}
          >
            赞 {article.detailInfo.likeNum}
          </Button>
          <Button
            type={article.detailInfo.ifBookMark ? "primary" : "default"}
            icon={article.detailInfo.ifBookMark ? <StarFilled /> : <StarOutlined />}
            onClick={handleToggleArticleMark}
          >
            收藏
          </Button>
        </Space>
      </Card>

      {/* 评论区 */}
      <Card bordered={false} title={<Title level={3}>评论区</Title>} style={{ marginTop: 24 }}>
        <List
          dataSource={comments!}
          locale={{ emptyText: <Empty description="暂无评论，快来抢沙发吧！" /> }}
          renderItem={item => (
            <List.Item
              actions={[
                <Button
                  type="text"
                  size="small"
                  icon={item.detailInfo.ifLike ? <LikeFilled style={{ color: '#1677ff' }} /> : <LikeOutlined />}
                  onClick={() => handleToggleLikeComment(item.id)}
                >
                  {item.detailInfo.likeNum}
                </Button>
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src={item.author.avatarUrl} />}
                title={<Text strong>{item.author.name}</Text>}
                description={item.content}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default Article;