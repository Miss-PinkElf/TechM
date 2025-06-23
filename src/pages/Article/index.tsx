import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useParams } from "react-router-dom";
import { addComment, addCommentLocal, getArticle, toggleArticleLikes, toggleArticleMark, toggleLikesComment } from "../../store/modules/articleStore";

// 引入 Ant Design 组件和图标
import { Spin, Card, Typography, Avatar, Button, Divider, List, Space, Empty, Input, message } from 'antd';
import { LikeOutlined, LikeFilled, StarOutlined, StarFilled } from '@ant-design/icons';

import './index.css'; // 引入自定义样式
import { Author, MyComment } from "../../store/types";
import { addCommentAPI } from "../../utils/request";
import CommentItem from "./components/CommentItem";

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
  // const handlePublishComment = (e: React.MouseEvent<HTMLElement>) => {

  //   if (!article) {
  //     message.error('文章数据异常，请刷新页面后再试！');
  //     return;
  //   }

  //   // 2. 恢复你原有的逻辑
  //   if (!currentComment.trim()) {
  //     message.warning('评论内容不能为空！');
  //     return;
  //   }
  //   const author: Author = {
  //     id: '1',
  //     name: "error",
  //     avatarUrl: '111'
  //   }
  //   dispatch(addCommentLocal({ author: author, content: currentComment }));
  //   const newComment: MyComment = {
  //     id: `${Date.now()}`, // 调用 Date.now() 获取当前时间戳
  //     articleId: article.id,
  //     content: currentComment,
  //     author: author,
  //     detailInfo: {
  //       ifLike: false,
  //       likeNum: 0,
  //       commentNum: 0,
  //       // 修正: 调用 Date.now() 来获取当前时间的毫秒数
  //       publicDate: `${Date.now()}`
  //     },
  //     reply: []
  //   };
  //   addCommentAPI(newComment);
  //   // dispatch(addComment({ author: author, content: currentComment, articleId: article!.id }))
  //   setCurrentComment('');
  //   message.success('发布成功')
  //   // try {
  //   //   // dispatch 返回一个 promise, 我们 await 它并调用 unwrap()
  //   //   // unwrap() 会在 thunk 成功时返回 action.payload 的值
  //   //   // 如果 thunk 失败，它会抛出错误，然后被 catch 块捕获
  //   //   await dispatch(addComment({
  //   //     author: author,
  //   //     content: currentComment,
  //   //     articleId: article.id
  //   //   })).unwrap();

  //   //   // 只有在 dispatch 成功后，才清空输入框
  //   //   setCurrentComment('');


  //   // } catch (error: any) {
  //   //   // 如果 dispatch 失败，错误会在这里被捕获
  //   //   console.error("发布评论失败:", error);
  //   //   // 给用户一个友好的提示
  //   // }
  // }

  const handlePublishComment = async () => {
    // 安全检查：防止文章数据不存在
    if (!article) {
      message.error('文章数据异常，请刷新页面后再试！');
      return;
    }

    // 安全检查：防止评论为空
    if (!currentComment.trim()) {
      message.warning('评论内容不能为空！');
      return;
    }


    // 模拟当前用户
    const author: Author = {
      id: 'user-guest',
      name: "访客",
      avatarUrl: `https://i.pravatar.cc/150?u=user-guest`
    };

    try {
      // 使用 createAsyncThunk 的方式，这是最稳妥的
      await dispatch(addComment({
        author: author,
        content: currentComment,
        articleId: article.id, // 安全地使用
      })).unwrap();
      // 成功后的操作
      setCurrentComment('');
      message.success('评论发布成功！');

    } catch (error: any) {
      // 失败后的操作（由 thunk 的 rejectWithValue 或 unwrap 触发）
      console.error("发布评论失败:", error);
      message.error(error.message || '发布评论失败，请稍后再试。');
    } finally {

    }
  };
  // const handlePublishComment = (e: React.MouseEvent<HTMLElement>) => {
  //   // 1. 明确地阻止事件的默认行为
  //   e.preventDefault();

  //   // 2. 打印一条消息到控制台，确认函数被触发且没有刷新
  //   console.log('按钮已点击，页面不应该刷新！');

  //   // 暂时注释掉所有的异步逻辑
  //   /*
  //   if (!currentComment.trim()) {
  //     message.warning('评论内容不能为空！');
  //     return;
  //   }

  //   if (isPublishing) {
  //     return;
  //   }

  //   // ... 后续所有 dispatch 和 try/catch/finally 逻辑都先注释掉
  //   */
  // };

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
  const author: Author = {
    id: 'user-guest',
    name: "访客",
    avatarUrl: `https://i.pravatar.cc/150?u=user-guest`
  };
  return (
    <div className="article-page-container">
      <Card variant="borderless">
        {/* 文章头部 */}
        <header className="article-header">

          <Title style={{ marginBottom: 24 }}>{article.title}</Title>
          <Space align="center" size="middle">
            <Avatar size={48} src={article.author.avatarUrl} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Text strong>{article.author.name}</Text>
              <Text type="secondary">{new Date(parseInt(article.detailInfo.publicDate)).toLocaleString()}</Text>
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
            收藏数 {article.detailInfo.bookmarks}
          </Button>
        </Space>
      </Card>

      <Card variant="borderless" title={<Title level={3}>评论区</Title>} style={{ marginTop: 24 }}>
        <div className="comment-publish" style={{ display: 'flex' }}>
          <div style={{}}>
            <Avatar size={"large"} style={{ marginTop: '18px', marginLeft: '0px' }} src={author.avatarUrl}></Avatar><br></br>
            <span>{author.name}</span>
          </div>

          <div style={{ flex: 0.9, marginLeft: '10px', display: 'flex', flexDirection: "column" }}>
            <Input.TextArea
              rows={4}
              placeholder="请输入评论"
              value={currentComment}
              onChange={(e) => { setCurrentComment(e.target.value) }}
            />

            <div style={{ alignSelf: 'flex-end', marginTop: '7px' }}>
              <Button type="primary" onClick={handlePublishComment} htmlType="button">
                发布评论
              </Button>
            </div>

          </div>

        </div>
        {/* --- 修改部分 --- */}
        {/* 将 Antd 的 List 替换为我们自己的 CommentItem 组件的映射 */}
        <div className="comment-list">
          {comments && comments.length > 0 ? (
            comments.map(comment => (
              <CommentItem
                key={comment.id}
                comment={comment}
                toggleLike={handleToggleLikeComment}
                articleId={article.id}
              />
            ))
          ) : (
            <Empty description="暂无评论" />
          )}
        </div>
      </Card>
    </div>
  );
};

export default Article;