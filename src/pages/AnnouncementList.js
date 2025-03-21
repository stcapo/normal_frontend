import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Card, 
  List, 
  Tag, 
  Button, 
  Input, 
  Select, 
  Space
} from 'antd';
import { 
  SearchOutlined, 
  NotificationOutlined, 
  ClockCircleOutlined, 
  EyeOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import { useAuth } from '../context/AuthContext';
import { 
  getAnnouncementsWithPublisher,
  viewAnnouncement
} from '../utils/announcementUtils';

const { Title } = Typography;
const { Option } = Select;

const AnnouncementList = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [announcements, setAnnouncements] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [importance, setImportance] = useState('all');
  
  // 加载公告列表
  useEffect(() => {
    const announcementsData = getAnnouncementsWithPublisher();
    // 只显示活跃的公告
    const activeAnnouncements = announcementsData.filter(announcement => announcement.isActive);
    setAnnouncements(activeAnnouncements);
    setFilteredAnnouncements(activeAnnouncements);
    setLoading(false);
  }, []);
  
  // 搜索和筛选公告
  useEffect(() => {
    let result = [...announcements];
    
    // 按关键词搜索
    if (searchText) {
      result = result.filter(
        announcement => 
          announcement.title.toLowerCase().includes(searchText.toLowerCase()) ||
          announcement.content.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    // 按重要性筛选
    if (importance !== 'all') {
      result = result.filter(announcement => announcement.importance === importance);
    }
    
    // 按时间排序
    result.sort((a, b) => new Date(b.publishTime) - new Date(a.publishTime));
    
    setFilteredAnnouncements(result);
  }, [announcements, searchText, importance]);
  
  // 处理搜索输入
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };
  
  // 处理重要性筛选
  const handleImportanceChange = (value) => {
    setImportance(value);
  };
  
  // 清除筛选
  const handleClearFilters = () => {
    setSearchText('');
    setImportance('all');
  };
  
  // 查看公告详情
  const handleViewAnnouncement = (id) => {
    viewAnnouncement(id);
    navigate(`/announcements/${id}`);
  };
  
  // 公告重要性对应的标签颜色
  const importanceColors = {
    'high': 'red',
    'medium': 'orange',
    'normal': 'blue'
  };
  
  // 公告重要性对应的文本
  const importanceText = {
    'high': '重要',
    'medium': '一般',
    'normal': '通知'
  };
  
  return (
    <AppLayout>
      <div className="fade-in">
        <Title level={2} className="page-title">公告通知</Title>
        
        {/* 搜索和筛选区域 */}
        <Card className="custom-card search-container">
          <Space style={{ width: '100%' }} direction="vertical">
            <Input
              placeholder="搜索公告标题或内容"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={handleSearch}
              allowClear
              style={{ marginBottom: 16 }}
            />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ marginRight: 8 }}>重要性：</span>
                <Select
                  value={importance}
                  onChange={handleImportanceChange}
                  style={{ width: 120 }}
                >
                  <Option value="all">全部</Option>
                  <Option value="high">重要</Option>
                  <Option value="medium">一般</Option>
                  <Option value="normal">通知</Option>
                </Select>
              </div>
              
              <Button 
                onClick={handleClearFilters} 
                disabled={!searchText && importance === 'all'}
              >
                清除筛选
              </Button>
              
              {currentUser && (currentUser.role === 'admin' || currentUser.role === 'teacher') && (
                <Button 
                  type="primary" 
                  onClick={() => navigate('/publish-announcement')}
                >
                  发布公告
                </Button>
              )}
            </div>
          </Space>
        </Card>
        
        {/* 公告列表 */}
        <Card className="custom-card">
          <List
            itemLayout="vertical"
            size="large"
            pagination={{
              onChange: page => {
                window.scrollTo(0, 0);
              },
              pageSize: 10,
            }}
            dataSource={filteredAnnouncements}
            loading={loading}
            renderItem={announcement => (
              <List.Item
                key={announcement.id}
                actions={[
                  <Space key="time">
                    <ClockCircleOutlined />
                    {announcement.publishTime}
                  </Space>,
                  <Space key="views">
                    <EyeOutlined />
                    {`${announcement.views} 次查看`}
                  </Space>,
                  <Button 
                    key="view" 
                    type="primary" 
                    size="small"
                    onClick={() => handleViewAnnouncement(announcement.id)}
                  >
                    查看详情
                  </Button>
                ]}
                extra={
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Tag color={importanceColors[announcement.importance] || 'blue'} style={{ margin: '0 0 8px 0' }}>
                      {importanceText[announcement.importance] || '通知'}
                    </Tag>
                    <span>
                      发布者：{announcement.publisherName}
                    </span>
                    <span style={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.45)' }}>
                      {announcement.publisherRole === 'admin' ? '管理员' : 
                       announcement.publisherRole === 'teacher' ? '教师' : '用户'}
                    </span>
                  </div>
                }
                className="announcement-item"
              >
                <List.Item.Meta
                  title={
                    <Link 
                      to={`/announcements/${announcement.id}`}
                      onClick={() => viewAnnouncement(announcement.id)}
                      style={{ fontSize: '18px' }}
                    >
                      {announcement.title}
                    </Link>
                  }
                />
                <div className="announcement-content">
                  {announcement.content.length > 200 
                    ? announcement.content.substring(0, 200) + '...' 
                    : announcement.content}
                </div>
              </List.Item>
            )}
          />
          
          {filteredAnnouncements.length === 0 && !loading && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <NotificationOutlined style={{ fontSize: 40, color: '#ccc' }} />
              <p>暂无公告</p>
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  );
};

export default AnnouncementList;
