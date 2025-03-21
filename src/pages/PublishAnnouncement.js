import React, { useState } from 'react';
import { 
  Typography, 
  Card, 
  Form, 
  Input, 
  Select, 
  Button, 
  Space, 
  message 
} from 'antd';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import { useAuth } from '../context/AuthContext';
import { publishAnnouncement } from '../utils/announcementUtils';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const PublishAnnouncement = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  
  // 处理表单提交
  const handleSubmit = (values) => {
    setLoading(true);
    
    // 准备公告数据
    const announcementData = {
      title: values.title,
      content: values.content,
      importance: values.importance,
      publisher: currentUser.id
    };
    
    // 发布公告
    const result = publishAnnouncement(announcementData);
    
    if (result) {
      message.success('公告发布成功');
      // 跳转到公告详情页
      navigate(`/announcements/${result.id}`);
    } else {
      message.error('公告发布失败');
      setLoading(false);
    }
  };
  
  return (
    <AppLayout>
      <div className="fade-in">
        <Title level={2} className="page-title">发布公告</Title>
        
        <Card className="custom-card">
          <Form
            form={form}
            layout="vertical"
            className="custom-form"
            onFinish={handleSubmit}
            initialValues={{
              importance: 'normal'
            }}
          >
            <Form.Item
              name="title"
              label="公告标题"
              rules={[
                { required: true, message: '请输入公告标题' },
                { max: 100, message: '标题不能超过100个字符' }
              ]}
            >
              <Input placeholder="请输入公告标题" />
            </Form.Item>
            
            <Form.Item
              name="importance"
              label="重要性"
              rules={[{ required: true, message: '请选择公告重要性' }]}
            >
              <Select placeholder="请选择公告重要性">
                <Option value="high">重要</Option>
                <Option value="medium">一般</Option>
                <Option value="normal">通知</Option>
              </Select>
            </Form.Item>
            
            <Form.Item
              name="content"
              label="公告内容"
              rules={[
                { required: true, message: '请输入公告内容' },
                { min: 10, message: '内容至少10个字符' }
              ]}
            >
              <TextArea rows={10} placeholder="请输入公告内容" />
            </Form.Item>
            
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" loading={loading}>
                  发布公告
                </Button>
                <Button onClick={() => navigate('/announcements')}>
                  取消
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </AppLayout>
  );
};

export default PublishAnnouncement;
