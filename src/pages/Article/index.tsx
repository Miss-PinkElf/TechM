import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useParams } from "react-router-dom";
import { getArticle, toggleArticleLikes, toggleArticleMark, toggleLikesComment } from "../../store/modules/articleStore";
import CommentItem from "./components/CommentItem";
const Article: React.FC = () => {
  const { article, comments } = useAppSelector(state => state.article)
  const dispatch = useAppDispatch();
  const { articleId } = useParams<{ articleId: string }>();
  useEffect(() => {
    console.log('in -------article-----', articleId);
    if (articleId)
      dispatch(getArticle(articleId));
  }, [articleId])
  const handleToggleArticleLike = () => {
    if (articleId)
      dispatch(toggleArticleLikes(articleId))
  }
  const handleToggleArticleMark = () => {
    if (articleId)
      dispatch(toggleArticleMark(articleId));
  }
  const handleToggleLikeComment = (commentId: string) => {
    dispatch(toggleLikesComment(commentId))
  }
  return (
    <div>
      <div className="title">{article?.title}</div>
      <div className="info">{article?.detailInfo.publicDate}</div>
      <div className="content">{article?.content}</div>
      <div className="commentList">
        {comments?.map((val) => {
          return (<CommentItem
            key={val.id}
            comment={val}
            toggleLike={handleToggleLikeComment}
          />)
        })}
      </div>
    </div>
  )

};

export default Article;
