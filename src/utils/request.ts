import http from "./http";
export const getImage = () => {
  return http({
    method: 'get',
    url: '/getImage',
  })
}
export const getArticleListAPI = (articleId:string) => {
  return http({
    method: 'get',
    url: '/getArticleList',
    params: {
      articleId:articleId
    }
  })
}