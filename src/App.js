import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';

// 引入自定义上下文
import { AuthProvider, useAuth } from './context/AuthContext';

// 引入页面组件
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import ResourceList from './pages/ResourceList';
import ResourceDetail from './pages/ResourceDetail';
import UploadResource from './pages/UploadResource';
import EditResource from './pages/EditResource';
import AnnouncementList from './pages/AnnouncementList';
import AnnouncementDetail from './pages/AnnouncementDetail';
import PublishAnnouncement from './pages/PublishAnnouncement';
import UserProfile from './pages/UserProfile';
import MyUploads from './pages/MyUploads';
import MyDownloads from './pages/MyDownloads';
import UserManagement from './pages/UserManagement';
import Statistics from './pages/Statistics';
import NotFound from './pages/NotFound';

// 引入样式
import './App.css';

// 受保护的路由
const ProtectedRoute = ({ element, requiredRoles = [] }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRoles.length > 0 && !requiredRoles.includes(currentUser.role)) {
    return <Navigate to="/dashboard" />;
  }
  
  return element;
};

const App = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* 公开路由 */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* 受保护的路由 */}
            <Route path="/dashboard" element={
              <ProtectedRoute element={<Dashboard />} />
            } />
            
            {/* 资源相关路由 */}
            <Route path="/resources" element={
              <ProtectedRoute element={<ResourceList />} />
            } />
            <Route path="/resources/:id" element={
              <ProtectedRoute element={<ResourceDetail />} />
            } />
            <Route path="/upload-resource" element={
              <ProtectedRoute element={<UploadResource />} requiredRoles={['admin', 'teacher']} />
            } />
            <Route path="/edit-resource/:id" element={
              <ProtectedRoute element={<EditResource />} requiredRoles={['admin', 'teacher']} />
            } />
            
            {/* 公告相关路由 */}
            <Route path="/announcements" element={
              <ProtectedRoute element={<AnnouncementList />} />
            } />
            <Route path="/announcements/:id" element={
              <ProtectedRoute element={<AnnouncementDetail />} />
            } />
            <Route path="/publish-announcement" element={
              <ProtectedRoute element={<PublishAnnouncement />} requiredRoles={['admin', 'teacher']} />
            } />
            
            {/* 用户中心相关路由 */}
            <Route path="/profile" element={
              <ProtectedRoute element={<UserProfile />} />
            } />
            <Route path="/my-uploads" element={
              <ProtectedRoute element={<MyUploads />} requiredRoles={['admin', 'teacher']} />
            } />
            <Route path="/my-downloads" element={
              <ProtectedRoute element={<MyDownloads />} />
            } />
            
            {/* 管理员路由 */}
            <Route path="/user-management" element={
              <ProtectedRoute element={<UserManagement />} requiredRoles={['admin']} />
            } />
            <Route path="/statistics" element={
              <ProtectedRoute element={<Statistics />} requiredRoles={['admin']} />
            } />
            
            {/* 默认路由和404路由 */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ConfigProvider>
  );
};

export default App;
