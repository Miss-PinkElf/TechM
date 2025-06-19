import React from 'react';
import { Layout, Row, Col, Card } from 'antd';
// 假设您的 HomePage.css 在同一个目录下
import './HomePage.css';
import ArticleList from './components/ArticleList';
import ImageCircle from './components/ImageCircle';
import ArticleRankList from './components/ArticleRankList';

const { Content } = Layout;

const HomePage: React.FC = () => {
  return (
    // 关键修改点 3: 让 HomePage 的根元素高度为 100%，并且也成为 flex 容器
    <Layout style={{ height: '100%', background: 'none' }}>
      <Content className="homepage-content">
        <Row gutter={[24, 24]} style={{ height: '100%' }}>

          {/* 左侧主内容区 */}
          <Col xs={24} md={16} style={{ display: 'flex', flexDirection: 'column' }}>
            <Row gutter={[24, 24]}>
              {/* 1. 轮播图横向 */}
              <Col span={24}>
                <Card title="轮播图横向">
                  <ImageCircle />
                </Card>
              </Col>
              {/* 2. 文章列表 */}
              <Col span={24} style={{ flex: 1 }}> {/* 让文章列表卡片区域伸展 */}
                <Card title="文章列表" style={{ height: '100%' }}>
                  {/* ... */}
                  <ArticleList />
                </Card>
              </Col>
            </Row>
          </Col>

          {/* 右侧边栏 */}
          <Col xs={24} md={8} style={{ display: 'flex', flexDirection: 'column' }}>
            <Row gutter={[24, 24]}>
              {/* 3. 轮播图竖向 */}
              <Col span={24}>
                <Card title="轮播图竖向">
                  {/* ... */}
                </Card>
              </Col>
              {/* 4. 排行榜 */}
              <Col span={24} style={{ flex: 1 }}> {/* 让排行榜卡片区域伸展 */}
                <Card title="排行榜" style={{ height: '100%' }}>
                  <ArticleRankList />
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default HomePage;