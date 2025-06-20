import { MyComment } from "../store/types";
import http from "./http";
export const getImage = () => {
  return http({
    method: 'get',
    url: '/getImage',
  })
}
export const getArticleAPI = (articleId: string) => {
  return http({
    method: 'get',
    url: `/articles/${articleId}`,
  })
}

export const getCommentListAPI = (articleId: string) => {
  return http({
    method: "get",
    url: '/comments',
    params: {
      articleId: articleId
    }
  })
}

export const getAllArticleOverviewAPI = () => {
  return http({
    method: 'get',
    url: '/articles'
  })
}
export const getAuthorRank = () => {
  return http({
    method: 'get',
    url: '/authorsRank'
  })
}

export const addCommentAPI = (comment: MyComment) => {
  return http({
    method: 'post',
    url: 'comments',
    data: comment
  })
}