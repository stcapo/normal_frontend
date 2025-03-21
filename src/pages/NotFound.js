import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AppLayout from '../components/layout/AppLayout';

const NotFound = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const handleBack = () => {
    if (currentUser) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };
  
  // 如果用户已登录，使用布局组件；否则不使用
  const content = (
    <Result
      status="404"
      title="404"
      subTitle="抱歉，您访问的页面不存在。"
      extra={
        <Button type="primary" onClick={handleBack}>
          {currentUser ? '返回首页' : '返回登录'}
        </Button>
      }
    />
  );
  
  return currentUser ? (
    <AppLayout>
      <div className="fade-in">
        {content}
      </div>
    </AppLayout>
  ) : (
    <div className="auth-container fade-in">
      <div style={{ background: 'white', padding: 24, borderRadius: 4 }}>
        {content}
      </div>
    </div>
  );
};

export default NotFound;
