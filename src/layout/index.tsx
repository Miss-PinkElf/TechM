import React, { useCallback, useState } from 'react';
import { AutoComplete, Avatar, Layout, Menu, Space, theme, Typography } from 'antd';
import { Link, Outlet } from 'react-router-dom';
import Search from 'antd/es/input/Search';
import { UserOutlined } from '@ant-design/icons';
import { title } from 'process';
const { Text } = Typography;
const { Header, Content, Footer } = Layout;
const menuItems = [{ key: '/', label: <Link to="/">首页</Link> },
{ key: '/qa', label: <Link to="/qa">问答</Link> },
{ key: '/courses', label: <Link to="/courses">课堂</Link> },
{ key: '/articles', label: <Link to="/fine_articles">优质文章</Link> },];
let user = {};
const LayoutPage: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchInfo, setSearchInfo] = useState('');
  const [options, setOptions] = useState<{ value: string; label: React.ReactNode }[]>([]);
  //
  const debounce = (fn: Function, t: number) => {
    let t_id: any = null;
    return function (...args: any[]) {//这个参数传递是有必要的！
      if (t_id)
        clearInterval(t_id)
      t_id = setTimeout(() => { fn(...args) }, t);
    }
  }
  const handleSearch = (searchKey: string) => {
    console.log('搜索内容是:', searchKey);
  }
  const debounceHandleSearch = useCallback(debounce(handleSearch, 500), []);
  //useCallBack 告诉react我只创建一次
  //  非必要，勿重创此函数”，从而避免了不必要的子组件渲染和 useEffect 的重复执行
  const renderOption = (title: string, id: string) => ({
    value: title,
    label: (
      <div style={{ display: 'block' }}>{title}</div>
    )
  })
  const handleSearchSuggestions = (searchKey: string) => {
    if (!searchKey.trim()) {
      setOptions([]);
      return;
    }
    //mock一下
    const data = [
      {
        "id": "23",
        "title": "深入 React Hooks：useEffect 的常见陷阱",
        "author": { "name": "React 大师" },

      },
      {
        "id": "108",
        "title": "React 性能优化：memo 和 useCallback",
        "author": { "name": "性能专家" },

      },
      {
        "id": "24",
        "title": "深入Antd",
        "author": { "name": "React 大师" },

      },
      {
        "id": "25",
        "title": "React 性能优化：memo 和 useCallback",
        "author": { "name": "性能专家" },

      }
    ]
    setOptions(data.map(val => renderOption(val.title, val.id)));
  }
  const debounceHandleSearchSuggestions = useCallback(debounce(handleSearchSuggestions, 300), []);

  return (
    <Layout style={{ minHeight: '100vh' }}> {/* 确保最外层布局占据整个视口高度 */}
      <Header style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'white', // 将背景设为白色以便看清内容
        borderBottom: '1px solid #f0f0f0' // 添加一个底部分割线
      }}>

        <div className="logo" style={{ marginRight: '24px', fontWeight: 'bold', fontSize: '20px' }}>
          TechM
        </div>

        <Menu
          // 改为亮色主题
          mode="horizontal"
          defaultSelectedKeys={['/']}
          items={menuItems}
          style={{ flex: 1, minWidth: 0, borderBottom: 'none' }} // borderBottom: 'none' 移除菜单自身的下划线
        />

        <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>

          <AutoComplete
            options={options}
            onSearch={debounceHandleSearchSuggestions}
            value={searchInfo}
            onChange={setSearchInfo}
          >
            <Search placeholder='请输入搜索内容' style={{ width: 200 }} onSearch={debounce(handleSearch, 500)}
              value={searchInfo}
              onChange={(e) => setSearchInfo(e.target.value)}
            />
          </AutoComplete>


          {isLoggedIn ? (
            <Avatar icon={<UserOutlined />} />
          ) : (

            <Space>
              <Link to="/login"><Text>登录</Text></Link>
              <Text>/</Text>
              <Link to="/register"><Text>注册</Text></Link>
            </Space>
          )}
        </div>
      </Header>


      <Content style={{
        padding: '0 48px',
        display: 'flex', // 设置为 flex 容器
        flexDirection: 'column' // 垂直排列子元素
      }}>

        <div style={{
          background: colorBgContainer,
          flex: 1,
          display: 'flex',
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