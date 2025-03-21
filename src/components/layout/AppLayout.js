import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Button, Dropdown, Badge, theme } from 'antd';
import { 
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  BookOutlined,
  NotificationOutlined,
  UploadOutlined,
  UserOutlined,
  DownloadOutlined,
  SettingOutlined,
  LogoutOutlined,
  TeamOutlined,
  BarChartOutlined,
  BellOutlined
} from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getLatestAnnouncements } from '../../utils/announcementUtils';

const { Header, Sider, Content } = Layout;

const AppLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = theme.useToken();
  
  // 获取最新公告
  useEffect(() => {
    const latestAnnouncements = getLatestAnnouncements(5);
    setNotifications(latestAnnouncements);
  }, []);
  
  // 根据用户角色获取不同的菜单项
  const getMenuItems = () => {
    // 基础菜单项，所有角色都可以访问
    const baseMenuItems = [
      {
        key: '/dashboard',
        icon: <DashboardOutlined />,
        label: <Link to="/dashboard">首页</Link>,
      },
      {
        key: '/resources',
        icon: <BookOutlined />,
        label: <Link to="/resources">教学资源</Link>,
      },
      {
        key: '/announcements',
        icon: <NotificationOutlined />,
        label: <Link to="/announcements">公告通知</Link>,
      },
      {
        key: 'user',
        icon: <UserOutlined />,
        label: '个人中心',
        children: [
          {
            key: '/profile',
            label: <Link to="/profile">个人信息</Link>,
          },
          {
            key: '/my-downloads',
            icon: <DownloadOutlined />,
            label: <Link to="/my-downloads">我的下载</Link>,
          },
        ],
      },
    ];
    
    // 教师和管理员可以访问的菜单项
    const teacherMenuItems = [
      {
        key: '/upload-resource',
        icon: <UploadOutlined />,
        label: <Link to="/upload-resource">上传资源</Link>,
      },
      {
        key: '/my-uploads',
        icon: <BookOutlined />,
        label: <Link to="/my-uploads">我的资源</Link>,
      },
      {
        key: '/publish-announcement',
        icon: <NotificationOutlined />,
        label: <Link to="/publish-announcement">发布公告</Link>,
      },
    ];
    
    // 管理员可以访问的菜单项
    const adminMenuItems = [
      {
        key: '/user-management',
        icon: <TeamOutlined />,
        label: <Link to="/user-management">用户管理</Link>,
      },
      {
        key: '/statistics',
        icon: <BarChartOutlined />,
        label: <Link to="/statistics">数据统计</Link>,
      },
    ];
    
    let menuItems = [...baseMenuItems];
    
    if (currentUser && (currentUser.role === 'teacher' || currentUser.role === 'admin')) {
      menuItems = [
        ...menuItems.slice(0, 3),
        ...teacherMenuItems,
        ...menuItems.slice(3)
      ];
    }
    
    if (currentUser && currentUser.role === 'admin') {
      menuItems = [
        ...menuItems,
        ...adminMenuItems
      ];
    }
    
    return menuItems;
  };
  
  // 通知菜单
  const notificationMenu = {
    items: notifications.map((notification, index) => ({
      key: notification.id,
      label: (
        <div onClick={() => navigate(`/announcements/${notification.id}`)}>
          <div style={{ fontWeight: 500 }}>{notification.title}</div>
          <div style={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.45)' }}>
            {notification.publishTime}
          </div>
        </div>
      ),
    })),
  };
  
  // 用户菜单
  const userMenu = {
    items: [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: <Link to="/profile">个人信息</Link>,
      },
      {
        key: 'settings',
        icon: <SettingOutlined />,
        label: <Link to="/profile">设置</Link>,
      },
      {
        type: 'divider',
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: '退出登录',
        onClick: () => {
          logout();
          navigate('/login');
        },
      },
    ],
  };
  
  // 渲染用户头像
  const renderAvatar = () => {
    if (!currentUser) return null;
    
    return (
      <div className="header-right">
        <Dropdown menu={notificationMenu} placement="bottomRight" arrow>
          <Badge count={notifications.length} overflowCount={99}>
            <Button type="text" icon={<BellOutlined />} />
          </Badge>
        </Dropdown>
        <Dropdown menu={userMenu} placement="bottomRight" arrow>
          <span style={{ cursor: 'pointer' }}>
            <Avatar 
              src={currentUser.avatar} 
              icon={!currentUser.avatar && <UserOutlined />}
              className="header-avatar"
            />
            <span>{currentUser.name || currentUser.username}</span>
          </span>
        </Dropdown>
      </div>
    );
  };
  
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        theme="dark"
        breakpoint="lg"
        collapsedWidth="80"
        width={220}
      >
        <div className="logo">
          {collapsed ? '资源' : '教学资源管理系统'}
        </div>
        <div className="sider-menu">
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[location.pathname]}
            selectedKeys={[location.pathname]}
            items={getMenuItems()}
          />
        </div>
      </Sider>
      <Layout className="site-layout">
        <Header
          style={{
            padding: 0,
            background: token.colorBgContainer,
            position: 'sticky',
            top: 0,
            zIndex: 1,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 4px rgba(0,21,41,.08)',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          {renderAvatar()}
        </Header>
        <Content className="content-container">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
