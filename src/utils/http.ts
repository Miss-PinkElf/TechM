import axios from "axios";

const http = axios.create({
  baseURL: 'http://localhost:3004',
  timeout:3000
})
http.interceptors.request.use(config => {
  
  return config;
}, e => Promise.reject(e))

http.interceptors.response.use(res => res, e => {
  return Promise.reject(e);
})
export default http;
