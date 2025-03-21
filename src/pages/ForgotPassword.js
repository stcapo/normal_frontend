import React, { useState } from 'react';
import { Form, Input, Button, Card, Alert, Typography, Steps, Result, message } from 'antd';
import { MailOutlined, LockOutlined, KeyOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Title, Paragraph } = Typography;
const { Step } = Steps;

const ForgotPassword = () => {
  const { recoverPassword, error } = useAuth();
  const [emailForm] = Form.useForm();
  const [verifyForm] = Form.useForm();
  const [resetForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState('');
  
  // 提交邮箱
  const handleEmailSubmit = (values) => {
    setLoading(true);
    const success = recoverPassword(values.email);
    setLoading(false);
    
    if (success) {
      setEmail(values.email);
      setCurrentStep(1);
    }
  };
  
  // 提交验证码
  const handleVerifySubmit = (values) => {
    setLoading(true);
    
    // 模拟验证码验证
    setTimeout(() => {
      setLoading(false);
      // Don't need to save verification code since we're just simulating
      setCurrentStep(2);
    }, 1000);
  };
  
  // 提交新密码
  const handleResetSubmit = (values) => {
    setLoading(true);
    
    // 模拟重置密码
    setTimeout(() => {
      setLoading(false);
      setCurrentStep(3);
    }, 1000);
  };
  
  // 重新发送验证码
  const handleResendCode = () => {
    setLoading(true);
    
    // 模拟重新发送验证码
    setTimeout(() => {
      setLoading(false);
      message.success('验证码已重新发送，请查收邮件');
    }, 1000);
  };
  
  // 渲染邮箱表单
  const renderEmailForm = () => {
    return (
      <Form
        form={emailForm}
        layout="vertical"
        onFinish={handleEmailSubmit}
        style={{ maxWidth: 300, margin: '0 auto' }}
      >
        <Paragraph style={{ marginBottom: 24, textAlign: 'center' }}>
          请输入您注册时使用的邮箱，我们将向该邮箱发送验证码。
        </Paragraph>
        
        <Form.Item
          name="email"
          rules={[
            { required: true, message: '请输入邮箱' },
            { type: 'email', message: '请输入有效的邮箱地址' }
          ]}
        >
          <Input 
            prefix={<MailOutlined />} 
            placeholder="请输入邮箱" 
            size="large"
          />
        </Form.Item>
        
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            size="large" 
            block 
            loading={loading}
          >
            发送验证码
          </Button>
        </Form.Item>
      </Form>
    );
  };
  
  // 渲染验证码表单
  const renderVerifyForm = () => {
    return (
      <Form
        form={verifyForm}
        layout="vertical"
        onFinish={handleVerifySubmit}
        style={{ maxWidth: 300, margin: '0 auto' }}
      >
        <Paragraph style={{ marginBottom: 24, textAlign: 'center' }}>
          验证码已发送至您的邮箱 {email}，请查收并输入验证码。
        </Paragraph>
        
        <Form.Item
          name="verificationCode"
          rules={[
            { required: true, message: '请输入验证码' },
            { len: 6, message: '验证码应为6位数字' }
          ]}
        >
          <Input 
            prefix={<KeyOutlined />} 
            placeholder="请输入验证码" 
            size="large"
          />
        </Form.Item>
        
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            size="large" 
            block 
            loading={loading}
          >
            验证
          </Button>
        </Form.Item>
        
        <div style={{ textAlign: 'center' }}>
          <Button type="link" onClick={handleResendCode} disabled={loading}>
            重新发送验证码
          </Button>
        </div>
      </Form>
    );
  };
  
  // 渲染重置密码表单
  const renderResetForm = () => {
    return (
      <Form
        form={resetForm}
        layout="vertical"
        onFinish={handleResetSubmit}
        style={{ maxWidth: 300, margin: '0 auto' }}
      >
        <Paragraph style={{ marginBottom: 24, textAlign: 'center' }}>
          请输入新密码
        </Paragraph>
        
        <Form.Item
          name="password"
          rules={[
            { required: true, message: '请输入新密码' },
            { min: 6, message: '密码至少6个字符' }
          ]}
          hasFeedback
        >
          <Input.Password 
            prefix={<LockOutlined />} 
            placeholder="请输入新密码" 
            size="large"
          />
        </Form.Item>
        
        <Form.Item
          name="confirmPassword"
          dependencies={['password']}
          hasFeedback
          rules={[
            { required: true, message: '请确认新密码' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次输入的密码不一致'));
              },
            }),
          ]}
        >
          <Input.Password 
            prefix={<LockOutlined />} 
            placeholder="请确认新密码" 
            size="large"
          />
        </Form.Item>
        
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            size="large" 
            block 
            loading={loading}
          >
            重置密码
          </Button>
        </Form.Item>
      </Form>
    );
  };
  
  // 渲染完成步骤
  const renderComplete = () => {
    return (
      <Result
        status="success"
        title="密码重置成功"
        subTitle="您的密码已成功重置，现在可以使用新密码登录"
        extra={
          <Button type="primary" size="large">
            <Link to="/login">返回登录</Link>
          </Button>
        }
      />
    );
  };
  
  // 根据当前步骤渲染表单
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderEmailForm();
      case 1:
        return renderVerifyForm();
      case 2:
        return renderResetForm();
      case 3:
        return renderComplete();
      default:
        return null;
    }
  };
  
  return (
    <div className="auth-container">
      <Card className="auth-card fade-in" style={{ width: 450 }}>
        <Title level={2} className="auth-title">找回密码</Title>
        
        <Steps current={currentStep} style={{ marginBottom: 24 }}>
          <Step title="填写邮箱" />
          <Step title="验证身份" />
          <Step title="重置密码" />
          <Step title="完成" />
        </Steps>
        
        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
        
        {renderStepContent()}
        
        {currentStep < 3 && (
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Link to="/login">返回登录</Link>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ForgotPassword;
