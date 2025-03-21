import React, { useState } from 'react';
import { Form, Input, Button, Select, Card, Alert, Typography } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, IdcardOutlined, BankOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Title, Text } = Typography;
const { Option } = Select;

const Register = () => {
  const { register, error } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  
  const onFinish = async (values) => {
    setLoading(true);
    
    // 根据角色设置不同的数据
    const userData = {
      username: values.username,
      password: values.password,
      email: values.email,
      role: values.role,
      name: values.name,
      department: values.department,
      avatar: '', // 默认空头像
      status: 'active'
    };
    
    // 如果是学生，添加学号
    if (values.role === 'student') {
      userData.studentId = values.studentId;
    }
    
    const success = register(userData);
    setLoading(false);
    
    if (success) {
      navigate('/dashboard');
    }
  };
  
  // 根据选择的角色显示不同的字段
  const [role, setRole] = useState('student');
  
  const handleRoleChange = (value) => {
    setRole(value);
    
    // 清除与角色相关的字段
    if (value === 'student') {
      form.setFieldsValue({ studentId: '' });
    } else {
      form.setFieldsValue({ studentId: undefined });
    }
  };
  
  return (
    <div className="auth-container">
      <Card className="auth-card fade-in" style={{ width: 450 }}>
        <div className="welcome-text">
          <Title level={2} className="welcome-title">
            创建新账号
          </Title>
          <Text className="welcome-subtitle">
            请填写以下信息完成注册
          </Text>
        </div>
        
        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
        
        <Form
          form={form}
          name="register_form"
          className="auth-form"
          layout="vertical"
          initialValues={{ role: 'student' }}
          onFinish={onFinish}
          style={{ maxWidth: 400, margin: '0 auto' }}
        >
          <Form.Item
            name="role"
            label="注册角色"
            rules={[{ required: true, message: '请选择角色!' }]}
          >
            <Select onChange={handleRoleChange}>
              <Option value="student">学生</Option>
              <Option value="teacher">教师</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              { required: true, message: '请输入用户名!' },
              { min: 3, message: '用户名至少3个字符!' }
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="请输入用户名" />
          </Form.Item>
          
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱!' },
              { type: 'email', message: '请输入有效的邮箱地址!' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="请输入邮箱" />
          </Form.Item>
          
          {role === 'student' && (
            <Form.Item
              name="studentId"
              label="学号"
              rules={[{ required: true, message: '请输入学号!' }]}
            >
              <Input prefix={<IdcardOutlined />} placeholder="请输入学号" />
            </Form.Item>
          )}
          
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="请输入姓名" />
          </Form.Item>
          
          <Form.Item
            name="department"
            label="院系"
            rules={[{ required: true, message: '请输入院系!' }]}
          >
            <Input prefix={<BankOutlined />} placeholder="请输入院系" />
          </Form.Item>
          
          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: true, message: '请输入密码!' },
              { min: 6, message: '密码至少6个字符!' }
            ]}
            hasFeedback
          >
            <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" />
          </Form.Item>
          
          <Form.Item
            name="confirm"
            label="确认密码"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: '请确认密码!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致!'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="请确认密码" />
          </Form.Item>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              className="auth-form-button"
              block
              loading={loading}
            >
              注册
            </Button>
          </Form.Item>
          
          <div className="auth-form-register">
            已有账号? <Link to="/login">返回登录</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
