import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Button, 
  Tag, 
  Space, 
  Divider, 
  Rate, 
  Input, 
  List, 
  Avatar, 
  message, 
  Modal,
  Descriptions 
} from 'antd';
import { 
  DownloadOutlined, 
  StarOutlined, 
  FileOutlined, 
  FilePdfOutlined, 
  FileWordOutlined, 
  FileExcelOutlined, 
  FilePptOutlined, 
  FileZipOutlined, 
  FileImageOutlined, 
  VideoCameraOutlined, 
  SoundOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  CommentOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import { useAuth } from '../context/AuthContext';
import { 
  getResourceById, 
  downloadResource, 
  rateResource, 
  addComment, 
  addReply,
  deleteResource
} from '../utils/resourceUtils';
import users from '../mock/users';
import CommentComponent from '../components/common/CommentComponent';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const ResourceDetail = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploader, setUploader] = useState(null);
  const [commentValue, setCommentValue] = useState('');
  const [replyValue, setReplyValue] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showReply, setShowReply] = useState({});
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  
  useEffect(() => {
    const resourceData = getResourceById(parseInt(id));
    if (resourceData) {
      setResource(resourceData);
      
      // 获取上传者信息
      const uploaderData = users.find(user => user.id === resourceData.uploader);
      setUploader(uploaderData);
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
  
  if (!resource) {
    return (
      <AppLayout>
        <div style={{ textAlign: 'center', margin: '40px 0' }}>
          <Title level={3}>资源不存在</Title>
          <Button type="primary" onClick={() => navigate('/resources')}>
            返回资源列表
          </Button>
        </div>
      </AppLayout>
    );
  }
  
  // 根据文件格式获取对应图标
  const getFileIcon = (format) => {
    const lowerFormat = format.toLowerCase();
    if (lowerFormat === 'pdf') return <FilePdfOutlined className="file-icon pdf-icon" />;
    if (lowerFormat === 'doc' || lowerFormat === 'docx') return <FileWordOutlined className="file-icon word-icon" />;
    if (lowerFormat === 'xls' || lowerFormat === 'xlsx') return <FileExcelOutlined className="file-icon excel-icon" />;
    if (lowerFormat === 'ppt' || lowerFormat === 'pptx') return <FilePptOutlined className="file-icon ppt-icon" />;
    if (lowerFormat === 'mp4' || lowerFormat === 'avi' || lowerFormat === 'mov') return <VideoCameraOutlined className="file-icon video-icon" />;
    if (lowerFormat === 'mp3' || lowerFormat === 'wav') return <SoundOutlined className="file-icon audio-icon" />;
    if (lowerFormat === 'jpg' || lowerFormat === 'png' || lowerFormat === 'gif') return <FileImageOutlined className="file-icon image-icon" />;
    if (lowerFormat === 'zip' || lowerFormat === 'rar') return <FileZipOutlined className="file-icon zip-icon" />;
    return <FileOutlined className="file-icon default-icon" />;
  };
  
  // 资源类型对应的标签颜色
  const typeColors = {
    '课件': 'blue',
    '视频': 'purple',
    '教案': 'green',
    '试题': 'orange',
    '其他': 'default'
  };
  
  // 下载资源
  const handleDownload = () => {
    const success = downloadResource(resource.id, currentUser.id);
    if (success) {
      message.success('开始下载资源');
      // 更新资源信息
      const updatedResource = getResourceById(parseInt(id));
      setResource(updatedResource);
    } else {
      message.error('下载失败');
    }
  };
  
  // 评分资源
  const handleRate = (value) => {
    const success = rateResource(resource.id, value);
    if (success) {
      message.success('评分成功');
      // 更新资源信息
      const updatedResource = getResourceById(parseInt(id));
      setResource(updatedResource);
    } else {
      message.error('评分失败');
    }
  };
  
  // 提交评论
  const handleCommentSubmit = () => {
    if (!commentValue.trim()) {
      message.warning('请输入评论内容');
      return;
    }
    
    setSubmitting(true);
    
    const success = addComment(resource.id, currentUser.id, commentValue);
    if (success) {
      setCommentValue('');
      message.success('评论发布成功');
      
      // 更新资源信息
      const updatedResource = getResourceById(parseInt(id));
      setResource(updatedResource);
    } else {
      message.error('评论发布失败');
    }
    
    setSubmitting(false);
  };
  
  // 提交回复
  const handleReplySubmit = (commentId) => {
    if (!replyValue[commentId] || !replyValue[commentId].trim()) {
      message.warning('请输入回复内容');
      return;
    }
    
    setSubmitting(true);
    
    const success = addReply(resource.id, commentId, currentUser.id, replyValue[commentId]);
    if (success) {
      setReplyValue({...replyValue, [commentId]: ''});
      setShowReply({...showReply, [commentId]: false});
      message.success('回复发布成功');
      
      // 更新资源信息
      const updatedResource = getResourceById(parseInt(id));
      setResource(updatedResource);
    } else {
      message.error('回复发布失败');
    }
    
    setSubmitting(false);
  };
  
  // 删除资源
  const handleDeleteResource = () => {
    const success = deleteResource(resource.id);
    if (success) {
      message.success('资源已删除');
      navigate('/resources');
    } else {
      message.error('删除失败');
    }
    setDeleteModalVisible(false);
  };
  
  // 获取用户头像和名称
  const getUserInfo = (userId) => {
    const user = users.find(u => u.id === userId);
    return {
      avatar: user ? user.avatar : null,
      name: user ? user.name || user.username : '未知用户'
    };
  };
  
  // 判断当前用户是否为资源的上传者或管理员
  const canEditResource = currentUser && (currentUser.role === 'admin' || currentUser.id === resource.uploader);
  
  return (
    <AppLayout>
      <div className="fade-in">
        <div className="resource-detail-header">
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{ marginRight: '24px', textAlign: 'center' }}>
              {getFileIcon(resource.format)}
              <Tag color={typeColors[resource.type] || 'default'} style={{ marginTop: '8px' }}>
                {resource.type}
              </Tag>
            </div>
            <div style={{ flex: 1 }}>
              <Title level={3}>{resource.title}</Title>
              
              <div className="resource-detail-meta">
                <Descriptions size="small" column={{ xs: 1, sm: 2, md: 3 }}>
                  <Descriptions.Item label="上传者">
                    {uploader ? uploader.name : '未知'}
                  </Descriptions.Item>
                  <Descriptions.Item label="上传时间">
                    {resource.uploadTime}
                  </Descriptions.Item>
                  <Descriptions.Item label="学科">
                    {resource.subject}
                  </Descriptions.Item>
                  <Descriptions.Item label="格式">
                    {resource.format.toUpperCase()}
                  </Descriptions.Item>
                  <Descriptions.Item label="大小">
                    {resource.size}
                  </Descriptions.Item>
                  <Descriptions.Item label="下载次数">
                    {resource.downloads}
                  </Descriptions.Item>
                </Descriptions>
              </div>
              
              <Space className="resource-detail-actions">
                <Button 
                  type="primary" 
                  icon={<DownloadOutlined />} 
                  onClick={handleDownload}
                >
                  下载资源
                </Button>
                
                {canEditResource && (
                  <>
                    <Button 
                      type="default" 
                      icon={<EditOutlined />}
                      onClick={() => navigate(`/edit-resource/${resource.id}`)}
                    >
                      编辑资源
                    </Button>
                    <Button 
                      danger 
                      icon={<DeleteOutlined />}
                      onClick={() => setDeleteModalVisible(true)}
                    >
                      删除资源
                    </Button>
                  </>
                )}
              </Space>
            </div>
            
            <div style={{ textAlign: 'center', marginLeft: '24px' }}>
              <div style={{ marginBottom: '8px' }}>
                <Text strong>资源评分</Text>
              </div>
              <div>
                <Rate 
                  allowHalf 
                  value={resource.rating} 
                  onChange={handleRate} 
                  style={{ fontSize: '24px' }}
                />
              </div>
              <div style={{ marginTop: '8px' }}>
                <Text strong style={{ fontSize: '18px' }}>{resource.rating}</Text>
                <Text type="secondary">/5</Text>
              </div>
            </div>
          </div>
          
          <Divider />
          
          <div>
            <Title level={4}>资源描述</Title>
            <Paragraph className="resource-detail-desc">
              {resource.description}
            </Paragraph>
          </div>
          
          <div style={{ margin: '16px 0' }}>
            <Title level={5}>资源标签</Title>
            <div>
              {resource.tags.map(tag => (
                <Tag key={tag} className="custom-tag">{tag}</Tag>
              ))}
            </div>
          </div>
          
          <Divider />
          
          <div>
            <Title level={4}>
              <CommentOutlined /> 资源评论 ({resource.comments.length})
            </Title>
            
            {/* 评论列表 */}
            <List
              className="comment-container"
              itemLayout="horizontal"
              dataSource={resource.comments}
              locale={{ emptyText: '暂无评论' }}
              renderItem={comment => {
                const commentUser = getUserInfo(comment.userId);
                
                return (
                  <List.Item>
                    <CommentComponent
                      author={<Text strong>{commentUser.name}</Text>}
                      avatar={
                        <Avatar 
                          src={commentUser.avatar} 
                          icon={!commentUser.avatar && <UserOutlined />}
                        />
                      }
                      content={<p>{comment.content}</p>}
                      datetime={comment.time}
                      actions={[
                        <span 
                          key="reply"
                          onClick={() => setShowReply({...showReply, [comment.id]: !showReply[comment.id]})}
                        >
                          回复
                        </span>
                      ]}
                    />
                    
                    {/* 回复列表 */}
                    {comment.replies.length > 0 && (
                      <div className="comment-replies">
                        {comment.replies.map(reply => {
                          const replyUser = getUserInfo(reply.userId);
                          
                          return (
                            <CommentComponent
                              key={reply.id}
                              author={<Text strong>{replyUser.name}</Text>}
                              avatar={
                                <Avatar 
                                  src={replyUser.avatar} 
                                  icon={!replyUser.avatar && <UserOutlined />}
                                />
                              }
                              content={<p>{reply.content}</p>}
                              datetime={reply.time}
                              className="comment-reply"
                            />
                          );
                        })}
                      </div>
                    )}
                    
                    {/* 回复表单 */}
                    {showReply[comment.id] && (
                      <div className="comment-reply">
                        <TextArea
                          rows={2}
                          value={replyValue[comment.id] || ''}
                          onChange={e => setReplyValue({...replyValue, [comment.id]: e.target.value})}
                          placeholder="回复评论..."
                        />
                        <div style={{ marginTop: '8px', textAlign: 'right' }}>
                          <Button 
                            type="primary" 
                            loading={submitting} 
                            onClick={() => handleReplySubmit(comment.id)}
                          >
                            回复
                          </Button>
                        </div>
                      </div>
                    )}
                  </List.Item>
                );
              }}
            />
            
            {/* 发表评论 */}
            <div style={{ marginTop: '20px' }}>
              <TextArea
                rows={4}
                value={commentValue}
                onChange={e => setCommentValue(e.target.value)}
                placeholder="发表您的评论..."
              />
              <div style={{ marginTop: '8px', textAlign: 'right' }}>
                <Button 
                  type="primary" 
                  loading={submitting} 
                  onClick={handleCommentSubmit}
                >
                  发表评论
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 删除确认对话框 */}
      <Modal
        title="确认删除"
        open={deleteModalVisible}
        onOk={handleDeleteResource}
        onCancel={() => setDeleteModalVisible(false)}
        okText="删除"
        cancelText="取消"
        okButtonProps={{ danger: true }}
      >
        <p>确定要删除此资源吗？此操作不可恢复。</p>
      </Modal>
    </AppLayout>
  );
};

export default ResourceDetail;
