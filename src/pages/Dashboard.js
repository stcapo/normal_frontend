import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Statistic, List, Tag, Carousel, Space } from 'antd';
import { 
  FileOutlined, 
  DownloadOutlined, 
  UserOutlined, 
  StarOutlined,
  NotificationOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import { useAuth } from '../context/AuthContext';
import { getLatestResources, getPopularResources } from '../utils/resourceUtils';
import { getLatestAnnouncements } from '../utils/announcementUtils';
import stats from '../mock/stats';

const { Title, Text } = Typography;

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [latestResources, setLatestResources] = useState([]);
  const [popularResources, setPopularResources] = useState([]);
  const [latestAnnouncements, setLatestAnnouncements] = useState([]);
  
  useEffect(() => {
    // 获取最新资源
    setLatestResources(getLatestResources(5));
    
    // 获取热门资源
    setPopularResources(getPopularResources(5));
    
    // 获取最新公告
    setLatestAnnouncements(getLatestAnnouncements(5));
  }, []);
  
  // 资源类型对应的标签颜色
  const typeColors = {
    '课件': 'blue',
    '视频': 'purple',
    '教案': 'green',
    '试题': 'orange',
    '其他': 'default'
  };
  
  // 公告重要性对应的标签颜色
  const importanceColors = {
    'high': 'red',
    'medium': 'orange',
    'normal': 'blue'
  };
  
  // 渲染欢迎信息
  const renderWelcomeMessage = () => {
    const roleText = {
      'admin': '管理员',
      'teacher': '教师',
      'student': '同学'
    };
    
    return (
      <Card className="custom-card">
        <Title level={4}>欢迎，{currentUser.name || currentUser.username} {roleText[currentUser.role]}！</Title>
        <Text>今天是 {new Date().toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}，祝您使用愉快！</Text>
      </Card>
    );
  };
  
  // 渲染最新公告轮播
  const renderAnnouncementCarousel = () => {
    return (
      <Card 
        className="custom-card" 
        title={<><NotificationOutlined /> 最新公告</>}
        extra={<Link to="/announcements">查看全部</Link>}
      >
        <Carousel autoplay className="announcement-scroller">
          {latestAnnouncements.map(announcement => (
            <div key={announcement.id}>
              <Link to={`/announcements/${announcement.id}`}>
                <div className="announcement-title">{announcement.title}</div>
                <div className="announcement-meta">
                  <Space>
                    <Tag color={importanceColors[announcement.importance] || 'blue'}>
                      {announcement.importance === 'high' ? '重要' : 
                       announcement.importance === 'medium' ? '一般' : '通知'}
                    </Tag>
                    <span>{announcement.publishTime}</span>
                  </Space>
                </div>
                <div className="announcement-content">
                  {announcement.content.length > 80 
                    ? announcement.content.substring(0, 80) + '...' 
                    : announcement.content}
                </div>
              </Link>
            </div>
          ))}
        </Carousel>
      </Card>
    );
  };
  
  // 渲染统计信息
  const renderStatistics = () => {
    return (
      <Row gutter={16}>
        <Col xs={12} sm={12} md={6}>
          <Card className="custom-card stat-card">
            <Statistic 
              title="教学资源总数" 
              value={stats.totals.totalResources} 
              prefix={<FileOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card className="custom-card stat-card">
            <Statistic 
              title="资源下载总次数" 
              value={stats.totals.totalDownloads} 
              prefix={<DownloadOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card className="custom-card stat-card">
            <Statistic 
              title="平台用户总数" 
              value={stats.totals.totalUsers} 
              prefix={<UserOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card className="custom-card stat-card">
            <Statistic 
              title="平均资源评分" 
              value={stats.totals.averageRating} 
              precision={1} 
              prefix={<StarOutlined />} 
              suffix="/5"
            />
          </Card>
        </Col>
      </Row>
    );
  };
  
  // 渲染最新资源
  const renderLatestResources = () => {
    return (
      <Card 
        className="custom-card" 
        title="最新资源" 
        extra={<Link to="/resources">查看全部</Link>}
      >
        <List
          dataSource={latestResources}
          renderItem={item => (
            <List.Item
              actions={[
                <span><DownloadOutlined /> {item.downloads}</span>,
                <span><StarOutlined /> {item.rating}</span>
              ]}
            >
              <List.Item.Meta
                title={<Link to={`/resources/${item.id}`}>{item.title}</Link>}
                description={
                  <Space>
                    <Tag color={typeColors[item.type] || 'default'}>{item.type}</Tag>
                    <Tag>{item.subject}</Tag>
                    <span>{item.uploadTime}</span>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    );
  };
  
  // 渲染热门资源
  const renderPopularResources = () => {
    return (
      <Card 
        className="custom-card" 
        title="热门资源" 
        extra={<Link to="/resources">查看全部</Link>}
      >
        <List
          dataSource={popularResources}
          renderItem={item => (
            <List.Item
              actions={[
                <span><DownloadOutlined /> {item.downloads}</span>,
                <span><StarOutlined /> {item.rating}</span>
              ]}
            >
              <List.Item.Meta
                title={<Link to={`/resources/${item.id}`}>{item.title}</Link>}
                description={
                  <Space>
                    <Tag color={typeColors[item.type] || 'default'}>{item.type}</Tag>
                    <Tag>{item.subject}</Tag>
                    <span>{item.uploadTime}</span>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    );
  };
  
  return (
    <AppLayout>
      <div className="fade-in">
        {renderWelcomeMessage()}
        
        <div style={{ margin: '20px 0' }}>
          {renderAnnouncementCarousel()}
        </div>
        
        <div style={{ margin: '20px 0' }}>
          {renderStatistics()}
        </div>
        
        <Row gutter={16} style={{ margin: '20px 0' }}>
          <Col xs={24} md={12}>
            {renderLatestResources()}
          </Col>
          <Col xs={24} md={12}>
            {renderPopularResources()}
          </Col>
        </Row>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
