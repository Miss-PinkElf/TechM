import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useParams } from "react-router-dom";
import { addComment, addCommentLocal, getArticle, toggleArticleLikes, toggleArticleMark, toggleLikesComment } from "../../store/modules/articleStore";

// 引入 Ant Design 组件和图标
import { Spin, Card, Typography, Avatar, Button, Divider, List, Space, Empty, Input } from 'antd';
import { LikeOutlined, LikeFilled, StarOutlined, StarFilled } from '@ant-design/icons';

import './Article.css'; // 引入自定义样式
import { Author, MyComment } from "../../store/types";
import { addCommentAPI } from "../../utils/request";

// CommentItem 现在可以直接在 List 的 renderItem 中实现，无需单独文件
// import CommentItem from "./components/CommentItem";

const { Title, Paragraph, Text } = Typography;

const Article: React.FC = () => {
  const { article, comments } = useAppSelector(state => state.article);
  const dispatch = useAppDispatch();
  const { articleId } = useParams<{ articleId: string }>();
  const [currentComment, setCurrentComment] = useState('')
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
  const handlePublishComment = async () => {

    const author: Author = {
      id: '1',
      name: "error",
      avatarUrl: '111'
    }
    dispatch(addCommentLocal({ author: author, content: currentComment }));
    //dispatch(addComment({ author: author, content: currentComment, articleId: article!.id }))

    setCurrentComment('');
  }
  // 在 article 数据加载完成前，显示加载动画
  // 这是一个在不修改 Redux State 的前提下处理加载状态的简单有效方法
  // Ai
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
          <Title style={{ marginBottom: 24 }}>{article.title}</Title>
          <Space align="center" size="middle">
            <Avatar size={48} src={article.author.avatarUrl} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Text strong>{article.author.name}</Text>
              <Text type="secondary">{new Date(article.detailInfo.publicDate).toLocaleString()}</Text>
            </div>
          </Space>
        </header>

        <Divider />


        <Paragraph className="article-content" style={{ fontSize: 16, lineHeight: 1.8 }}>
          {article.content}
        </Paragraph>

        <Divider />

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
      <Card variant="borderless" title={<Title level={3}>评论区</Title>} style={{ marginTop: 24 }}>
        <div className="comment-publish" style={{ display: 'flex' }}>
          <div style={{}}>
            <Avatar size={"large"} style={{ marginTop: '18px', marginLeft: '0px' }}></Avatar><br></br>
            <span>UserName</span>
          </div>

          <div style={{ flex: 0.9, marginLeft: '10px', display: 'flex', flexDirection: "column" }}>
            <Input.TextArea
              rows={4}
              placeholder="请输入评论"
              value={currentComment}
              onChange={(e) => { setCurrentComment(e.target.value) }}
            />

            <div style={{ alignSelf: 'flex-end', marginTop: '7px' }}>
              <Button type="primary" onClick={handlePublishComment} >
                发布评论
              </Button>
            </div>

          </div>

        </div>
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