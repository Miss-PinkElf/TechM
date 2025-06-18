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
    url: '/getArticleList',
    params: {
      articleId: articleId
    }
  })
}