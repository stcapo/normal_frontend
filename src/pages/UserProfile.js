import React, { useState } from 'react';
import { 
  Typography, 
  Card, 
  Form, 
  Input, 
  Button, 
  Upload, 
  Avatar, 
  Tabs,
  Descriptions,
  Space,
  Divider,
  message
} from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  LockOutlined, 
  UploadOutlined, 
  SaveOutlined,
  BankOutlined,
  IdcardOutlined
} from '@ant-design/icons';
import AppLayout from '../components/layout/AppLayout';
import { useAuth } from '../context/AuthContext';

const { Title } = Typography;
const { TabPane } = Tabs;

const UserProfile = () => {
  const { currentUser, updateUserInfo } = useAuth();
  
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatar || '');
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  
  // 处理个人信息更新
  const handleProfileUpdate = (values) => {
    setProfileLoading(true);
    
    // 准备更新数据
    const updatedInfo = {
      name: values.name,
      email: values.email,
      department: values.department,
      avatar: avatarUrl
    };
    
    // 如果是学生，还有学号
    if (currentUser.role === 'student' && values.studentId) {
      updatedInfo.studentId = values.studentId;
    }
    
    // 更新用户信息
    const success = updateUserInfo(updatedInfo);
    
    if (success) {
      message.success('个人信息更新成功');
    } else {
      message.error('个人信息更新失败');
    }
    
    setProfileLoading(false);
  };
  
  // 处理密码更新
  const handlePasswordUpdate = (values) => {
    setPasswordLoading(true);
    
    // 简单校验当前密码是否正确
    if (values.currentPassword !== currentUser.password) {
      message.error('当前密码不正确');
      setPasswordLoading(false);
      return;
    }
    
    // 更新密码
    const success = updateUserInfo({ password: values.newPassword });
    
    if (success) {
      message.success('密码更新成功');
      passwordForm.resetFields();
    } else {
      message.error('密码更新失败');
    }
    
    setPasswordLoading(false);
  };
  
  // 头像上传前的校验
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传JPG/PNG格式的图片!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片必须小于2MB!');
    }
    return isJpgOrPng && isLt2M;
  };
  
  // 处理头像上传变化
  const handleAvatarChange = (info) => {
    if (info.file.status === 'done') {
      // 获取上传的图片URL（模拟）
      const url = URL.createObjectURL(info.file.originFileObj);
      setAvatarUrl(url);
      message.success('头像上传成功');
    }
  };
  
  // 自定义头像上传按钮
  const uploadButton = (
    <div>
      <UploadOutlined />
      <div style={{ marginTop: 8 }}>点击上传</div>
    </div>
  );
  
  // 获取用户角色文本
  const getRoleText = () => {
    if (currentUser.role === 'admin') return '管理员';
    if (currentUser.role === 'teacher') return '教师';
    if (currentUser.role === 'student') return '学生';
    return '用户';
  };
  
  return (
    <AppLayout>
      <div className="fade-in">
        <Title level={2} className="page-title">个人中心</Title>
        
        <Card className="custom-card">
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
            <Avatar 
              size={64} 
              src={currentUser.avatar} 
              icon={!currentUser.avatar && <UserOutlined />}
            />
            <div style={{ marginLeft: 16 }}>
              <Title level={4} style={{ margin: 0 }}>
                {currentUser.name || currentUser.username}
              </Title>
              <div>{getRoleText()}</div>
            </div>
          </div>
          
          <Descriptions title="基本信息" bordered column={{ xs: 1, sm: 2, md: 3 }}>
            <Descriptions.Item label="用户名">{currentUser.username}</Descriptions.Item>
            <Descriptions.Item label="邮箱">{currentUser.email}</Descriptions.Item>
            <Descriptions.Item label="角色">{getRoleText()}</Descriptions.Item>
            <Descriptions.Item label="院系">{currentUser.department}</Descriptions.Item>
            {currentUser.role === 'student' && (
              <Descriptions.Item label="学号">{currentUser.studentId}</Descriptions.Item>
            )}
            <Descriptions.Item label="注册时间">{currentUser.createdAt}</Descriptions.Item>
            <Descriptions.Item label="最后登录">{currentUser.lastLogin}</Descriptions.Item>
          </Descriptions>
          
          <Divider />
          
          <Tabs defaultActiveKey="profile">
            <TabPane tab="编辑个人资料" key="profile">
              <Form
                form={profileForm}
                layout="vertical"
                initialValues={{
                  name: currentUser.name,
                  email: currentUser.email,
                  department: currentUser.department,
                  studentId: currentUser.studentId
                }}
                onFinish={handleProfileUpdate}
                style={{ maxWidth: 600 }}
              >
                <Form.Item
                  name="avatar"
                  label="头像"
                  valuePropName="fileList"
                >
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    onChange={handleAvatarChange}
                    customRequest={({ onSuccess }) => setTimeout(() => onSuccess("ok"), 0)}
                  >
                    {avatarUrl ? (
                      <img 
                        src={avatarUrl} 
                        alt="avatar" 
                        className="avatar-image" 
                      />
                    ) : (
                      uploadButton
                    )}
                  </Upload>
                </Form.Item>
                
                <Form.Item
                  name="name"
                  label="姓名"
                  rules={[{ required: true, message: '请输入姓名' }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="请输入姓名" />
                </Form.Item>
                
                <Form.Item
                  name="email"
                  label="邮箱"
                  rules={[
                    { required: true, message: '请输入邮箱' },
                    { type: 'email', message: '请输入有效的邮箱地址' }
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder="请输入邮箱" />
                </Form.Item>
                
                <Form.Item
                  name="department"
                  label="院系"
                  rules={[{ required: true, message: '请输入院系' }]}
                >
                  <Input prefix={<BankOutlined />} placeholder="请输入院系" />
                </Form.Item>
                
                {currentUser.role === 'student' && (
                  <Form.Item
                    name="studentId"
                    label="学号"
                    rules={[{ required: true, message: '请输入学号' }]}
                  >
                    <Input prefix={<IdcardOutlined />} placeholder="请输入学号" />
                  </Form.Item>
                )}
                
                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    icon={<SaveOutlined />}
                    loading={profileLoading}
                  >
                    保存修改
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>
            
            <TabPane tab="修改密码" key="password">
              <Form
                form={passwordForm}
                layout="vertical"
                onFinish={handlePasswordUpdate}
                style={{ maxWidth: 600 }}
              >
                <Form.Item
                  name="currentPassword"
                  label="当前密码"
                  rules={[{ required: true, message: '请输入当前密码' }]}
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="请输入当前密码" />
                </Form.Item>
                
                <Form.Item
                  name="newPassword"
                  label="新密码"
                  rules={[
                    { required: true, message: '请输入新密码' },
                    { min: 6, message: '密码至少6个字符' }
                  ]}
                  hasFeedback
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="请输入新密码" />
                </Form.Item>
                
                <Form.Item
                  name="confirmPassword"
                  label="确认新密码"
                  dependencies={['newPassword']}
                  hasFeedback
                  rules={[
                    { required: true, message: '请确认新密码' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('newPassword') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('两次输入的密码不一致'));
                      },
                    }),
                  ]}
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="请确认新密码" />
                </Form.Item>
                
                <Form.Item>
                  <Space>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      loading={passwordLoading}
                    >
                      修改密码
                    </Button>
                    <Button onClick={() => passwordForm.resetFields()}>
                      重置
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </AppLayout>
  );
};

export default UserProfile;
