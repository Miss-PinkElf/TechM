import React from 'react';
import { Layout, Menu, theme } from 'antd';
import { Outlet } from 'react-router-dom';

const { Header, Content, Footer } = Layout;
const items = [{ key: '1', label: "首页" }];

const LayoutPage: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}> {/* 确保最外层布局占据整个视口高度 */}
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          items={items}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>

      {/* 关键修改点 1: 让 Content 自身成为一个 flex 容器 */}
      <Content style={{
        padding: '0 48px',
        display: 'flex', // 设置为 flex 容器
        flexDirection: 'column' // 垂直排列子元素
      }}>
        {/* 关键修改点 2: 让这个 div 伸展填充所有可用空间 */}
        <div style={{
          background: colorBgContainer,
          flex: 1, // 让它占据所有剩余空间
          display: 'flex', // 它也需要成为 flex 容器以控制 HomePage
          flexDirection: 'column'
        }}>
          <Outlet />
        </div>
      </Content>

      <Footer style={{ textAlign: 'center' }}>
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
    </Layout>
  );
};

export default LayoutPage;