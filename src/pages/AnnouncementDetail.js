import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Card, 
  Space, 
  Tag, 
  Divider, 
  Button, 
  Modal,
  message
} from 'antd';
import { 
  ClockCircleOutlined, 
  UserOutlined, 
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import { useAuth } from '../context/AuthContext';
import { getAnnouncementById, viewAnnouncement, deleteAnnouncement } from '../utils/announcementUtils';
import users from '../mock/users';

const { Title, Text, Paragraph } = Typography;
const { confirm } = Modal;

const AnnouncementDetail = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [announcement, setAnnouncement] = useState(null);
  const [publisher, setPublisher] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const announcementData = getAnnouncementById(parseInt(id));
    
    if (announcementData) {
      // 记录查看次数
      viewAnnouncement(parseInt(id));
      setAnnouncement(announcementData);
      
      // 获取发布者信息
      const publisherData = users.find(user => user.id === announcementData.publisher);
      setPublisher(publisherData);
    }
    
    setLoading(false);
  }, [id]);
  
  if (loading) {
    return (
      <AppLayout>
        <div className="loading-container">
          <Text>加载中...</Text>
        </div>
      </AppLayout>
    );
  }
  
  if (!announcement) {
    return (
      <AppLayout>
        <div style={{ textAlign: 'center', margin: '40px 0' }}>
          <Title level={3}>公告不存在</Title>
          <Button type="primary" onClick={() => navigate('/announcements')}>
            返回公告列表
          </Button>
        </div>
      </AppLayout>
    );
  }
  
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
  
  // 判断当前用户是否可以编辑/删除公告
  const canEditAnnouncement = currentUser && 
    (currentUser.role === 'admin' || currentUser.id === announcement.publisher);
  
  // 处理删除公告
  const handleDeleteAnnouncement = () => {
    confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: '确定要删除此公告吗？',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        const success = deleteAnnouncement(announcement.id);
        if (success) {
          message.success('公告已删除');
          navigate('/announcements');
        } else {
          message.error('删除失败');
        }
      },
    });
  };
  
  return (
    <AppLayout>
      <div className="fade-in">
        <div style={{ marginBottom: 16 }}>
          <Button 
            type="default" 
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/announcements')}
          >
            返回公告列表
          </Button>
        </div>
        
        <Card className="custom-card">
          <div className="announcement-detail-header">
            <Title level={2}>{announcement.title}</Title>
            
            <Space style={{ marginBottom: 16 }}>
              <Tag color={importanceColors[announcement.importance] || 'blue'}>
                {importanceText[announcement.importance] || '通知'}
              </Tag>
              
              <Space>
                <UserOutlined />
                <Text>{publisher ? publisher.name : '未知'}</Text>
                <Text type="secondary">
                  ({publisher ? (publisher.role === 'admin' ? '管理员' : '教师') : '未知'})
                </Text>
              </Space>
              
              <Space>
                <ClockCircleOutlined />
                <Text>{announcement.publishTime}</Text>
              </Space>
              
              <Space>
                <EyeOutlined />
                <Text>{announcement.views} 次查看</Text>
              </Space>
            </Space>
            
            {canEditAnnouncement && (
              <div style={{ marginBottom: 16 }}>
                <Space>
                  <Button 
                    type="primary" 
                    icon={<EditOutlined />}
                    onClick={() => navigate(`/edit-announcement/${announcement.id}`)}
                  >
                    编辑公告
                  </Button>
                  <Button 
                    danger 
                    icon={<DeleteOutlined />}
                    onClick={handleDeleteAnnouncement}
                  >
                    删除公告
                  </Button>
                </Space>
              </div>
            )}
            
            <Divider />
            
            <div className="announcement-detail-content">
              <Paragraph style={{ fontSize: 16, whiteSpace: 'pre-line' }}>
                {announcement.content}
              </Paragraph>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AnnouncementDetail;
