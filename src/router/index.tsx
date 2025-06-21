import { createBrowserRouter, RouteObject } from "react-router-dom";
/**
 * TODO: 路由配置
 */
import Layout from "../layout";
// 首页
import HomePage from "../pages//HomePage";
// 文章详情页
import Article from "../pages/Article";
// 404页面
import NotFoundPage from "../components/404";
import Qa from "../pages/QA";
import Courses from "../pages/Courses";
import FineArticle from "../pages/FineArticle";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/article/:articleId",
        element: <Article />,
      },
      {
        path: '/qa',
        element: <Qa />
      },
      {
        path: '/courses',
        element: <Courses />
      },
      {
        path: '/fine_articles',
        element: <FineArticle />
      },

    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];

const router = createBrowserRouter(routes);

export default router;
