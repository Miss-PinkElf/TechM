import React from 'react';
import { MyComment } from '../../../store/types'; // 确保路径正确
import { Avatar, Typography, Space } from 'antd';
import { LikeOutlined, LikeFilled, MessageOutlined } from '@ant-design/icons';
import './Comment.css'; // 我们将为组件添加一些样式

// Props 定义，与你提供的一致
interface CommentProps {
  comment: MyComment;
  toggleLike: (commentId: string) => void;
}

const CommentItem: React.FC<CommentProps> = ({ comment, toggleLike }) => {
  // 从 comment 对象中解构出需要的数据，让代码更清晰
  const { author, content, detailInfo } = comment;

  // 创建一个点赞按钮的点击事件处理函数
  const handleLikeClick = () => {
    console.log(comment.id);

    toggleLike(comment.id);
  };

  return (
    <div className="comment-container">
      {/* --- 左边：头像 --- */}
      <div className="comment-left">
        <Avatar src={author.avatarUrl} alt={author.name} size={40}>
          {/* 如果没有头像URL，显示作者名字的第一个字作为备用 */}
          {author.name?.[0]}
        </Avatar>
      </div>

      {/* --- 右边：主要内容区 --- */}
      <div className="comment-right">
        {/* 作者名 */}
        <Typography.Text strong>{author.name}</Typography.Text>

        {/* 评论内容 */}
        <Typography.Paragraph className="comment-content">
          {content}
        </Typography.Paragraph>

        {/* 底部操作栏 */}
        <div className="comment-footer">
          <Typography.Text type="secondary" className="comment-date">
            {/* 建议使用 dayjs 或 date-fns 格式化日期，这里暂时直接显示 */}
            {new Date(parseInt(detailInfo.publicDate)).toLocaleString()}
          </Typography.Text>

          <Space size="large" className="comment-actions">
            {/* 点赞操作 */}
            <Space
              className="action-item"
              onClick={handleLikeClick}
            >
              {/* 根据是否已点赞，显示不同图标（条件渲染） */}
              {detailInfo.ifLike ? <LikeFilled style={{ color: '#1890ff' }} /> : <LikeOutlined />}
              <span>{detailInfo.likeNum > 0 ? detailInfo.likeNum : '赞'}</span>
            </Space>

            {/* 回复操作 (功能待实现) */}
            <Space className="action-item">
              <MessageOutlined />
              <span>回复</span>
            </Space>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;