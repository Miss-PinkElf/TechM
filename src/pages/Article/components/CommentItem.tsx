import React, { useState } from 'react';
import { MyComment, Author } from '../../../store/types'; // 确保路径正确
import { Avatar, Typography, Space, Button, Input, message } from 'antd';
import { LikeOutlined, LikeFilled, MessageOutlined } from '@ant-design/icons';
import './Comment.css'; // 我们将为组件添加一些样式
import { useAppDispatch } from '../../../store/hooks';
import { addReplyToComment } from '../../../store/modules/articleStore';

// Props 定义
interface CommentProps {
  comment: MyComment;
  toggleLike: (commentId: string) => void;
  articleId: string; // 我们需要文章ID来创建新的回复
}

const CommentItem: React.FC<CommentProps> = ({ comment, toggleLike, articleId }) => {
  const { author, content, detailInfo, reply } = comment;
  const dispatch = useAppDispatch();

  // 用于处理回复输入框的状态
  const [replyVisible, setReplyVisible] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  // 点赞处理函数
  const handleLikeClick = () => {
    toggleLike(comment.id);
  };

  // “回复”按钮点击事件，切换输入框的显示
  const handleReplyClick = () => {
    setReplyVisible(!replyVisible);
  };

  // 发布回复的处理函数
  const handlePublishReply = () => {
    if (!replyContent.trim()) {
      message.warning('回复内容不能为空！');
      return;
    }

    // 为这条回复模拟一个作者
    const replyAuthor: Author = {
      id: 'user-guest-reply',
      name: "回复者",
      avatarUrl: `https://i.pravatar.cc/150?u=user-guest-reply`
    };

    // Dispatch 我们即将创建的 action
    dispatch(addReplyToComment({
      parentId: comment.id, // 告诉 Redux 要回复哪条评论
      reply: { // 这是新回复的数据
        id: `${Date.now()}`,
        articleId: articleId,
        author: replyAuthor,
        content: replyContent,
        detailInfo: {
          ifLike: false,
          likeNum: 0,
          commentNum: 0,
          publicDate: `${Date.now()}`
        },
        reply: [] // 新回复自身没有回复
      }
    }));

    // 成功后重置状态
    setReplyContent('');
    setReplyVisible(false);
    message.success('回复发布成功！');
  };

  return (
    <div className="comment-container">
      {/* --- 左边：头像 --- */}
      <div className="comment-left">
        <Avatar src={author.avatarUrl} alt={author.name} size={40}>
          {author.name?.[0]}
        </Avatar>
      </div>

      {/* --- 右边：主要内容区 --- */}
      <div className="comment-right">
        <Typography.Text strong>{author.name}</Typography.Text>

        <Typography.Paragraph className="comment-content">
          {content}
        </Typography.Paragraph>

        <div className="comment-footer">
          <Typography.Text type="secondary" className="comment-date">
            {new Date(parseInt(detailInfo.publicDate)).toLocaleString()}
          </Typography.Text>

          <Space size="large" className="comment-actions">
            <Space className="action-item" onClick={handleLikeClick}>
              {detailInfo.ifLike ? <LikeFilled style={{ color: '#1890ff' }} /> : <LikeOutlined />}
              <span>{detailInfo.likeNum > 0 ? detailInfo.likeNum : '赞'}</span>
            </Space>

            <Space className="action-item" onClick={handleReplyClick}>
              <MessageOutlined />
              <span>回复</span>
            </Space>
          </Space>
        </div>

        {/* --- 回复输入框区域 (条件渲染) --- */}
        {replyVisible && (
          <div className="reply-input-section" style={{ marginTop: '10px' }}>
            <Input.TextArea
              rows={2}
              placeholder={`回复 ${author.name}...`}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            />
            <Button
              type="primary"
              size="small"
              onClick={handlePublishReply}
              style={{ marginTop: '8px', float: 'right' }}
            >
              发布回复
            </Button>
          </div>
        )}

        {/* --- 嵌套回复区域 (递归渲染) --- */}
        {reply && reply.length > 0 && (
          <div className="nested-comments" style={{ marginLeft: '20px', marginTop: '10px', borderLeft: '2px solid #f0f0f0', paddingLeft: '20px' }}>
            {reply.map(replyComment => (
              <CommentItem
                key={replyComment.id}
                comment={replyComment}
                toggleLike={toggleLike}
                articleId={articleId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;