import React from "react";
import ImageCircle from "./components/ImageCircle";
import { MyComment } from "../../store/types";
import CommentItem from "../Article/components/CommentItem";
import { useDispatch } from "react-redux";
import { toggleLikesComment } from "../../store/modules/articleStore";
import { Link, Outlet } from "react-router-dom";
const HomePage: React.FC = () => {
  const dispatch = useDispatch();
  const handleToggleLikeComment = (commentId: string) => {
    dispatch(toggleLikesComment(commentId));
  }
  const comment: MyComment = {
    id: '1',
    content: "1111111",
    articleId: '1',
    author: {
      id: '1',
      name: '123',
      avatarUrl: 'null'
    },
    detailInfo: {
      ifLike: false,
      likeNum: 12,
      commentNum: 12,
      publicDate: `${Date.now()}`
    },
    reply: []

  }
  return (
    <div>
      <ImageCircle />
      <div style={{ display: 'flex' }}>
        <span>热门</span><span>最新</span>
      </div>
      <CommentItem comment={comment}
        toggleLike={handleToggleLikeComment} />
      <Link to={`/article/23`}>文章23</Link>
      <Outlet />
    </div>
  )
};

export default HomePage;
