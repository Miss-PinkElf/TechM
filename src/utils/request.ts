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

export const getAllArticleOverviewAPI = (page: number, limit: number) => {
  return http({
    method: 'get',
    url: '/articles',
    params: {
      _page: page,
      _limit: limit,
    }
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