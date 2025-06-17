// /**
//  * TODO: 布局
//  */
// import React from "react";
// import { Flex, Layout } from "antd";
// import { Outlet } from "react-router-dom";
// import "./index.css";

// const { Header, Content } = Layout;

// const headerStyle: React.CSSProperties = {
//   textAlign: "center",
//   color: "#fff",
//   height: 64,
//   paddingInline: 48,
//   lineHeight: "64px",
//   backgroundColor: "#000000",
// };

// const contentStyle: React.CSSProperties = {
//   textAlign: "center",
//   minHeight: 120,
//   lineHeight: "120px",
//   color: "#000",
//   backgroundColor: "#f4f4f4",
// };

// const layoutStyle = {
//   overflow: "hidden",
//   minWidth: "calc(50% - 8px)",
// };

// const LayoutPage: React.FC = () => {
//   return (
//     <Flex gap="middle" wrap className={"layoutPage"}>
//       <Layout style={layoutStyle}>
//         <Header style={headerStyle}>Header</Header>
//         <Content style={contentStyle}>
//           <Outlet />
//         </Content>
//       </Layout>
//     </Flex>
//   );
// };

// export default LayoutPage;


import React from 'react';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import HomePage from '../pages/HomePage';
const { Header, Content, Footer } = Layout;
// const items = Array.from({ length: 15 }).map((_, index) => ({
//   key: index + 1,
//   label: `nav ${index + 1}`,
// }));
const items=[{key:1,label:"首页"}]
const LayoutPage: React.FC = () => {
    const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
      <Layout>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          items={items}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
      <Content style={{ padding: '0 48px' }}>
      
        <div
          style={{
            background: colorBgContainer,
            minHeight: 280,
            padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
          <HomePage/>
          
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
    </Layout>
  );
};

export default LayoutPage;
