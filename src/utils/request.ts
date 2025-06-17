import http from "./http";
export const getImage = () => {
  return http({
    method: 'get',
    url: '/getImage',
  })
}