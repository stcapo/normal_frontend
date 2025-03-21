import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Card, 
  Form, 
  Input, 
  Select, 
  Button, 
  Upload, 
  message, 
  Divider,
  Space,
  Tag
} from 'antd';
import { 
  InboxOutlined, 
  PlusOutlined, 
  TagOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import { useAuth } from '../context/AuthContext';
import { uploadResource, getAllSubjects, getAllResourceTypes } from '../utils/resourceUtils';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { Dragger } = Upload;

const UploadResource = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [resourceTypes, setResourceTypes] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [tags, setTags] = useState([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  
  useEffect(() => {
    // 获取所有学科分类
    setSubjects(getAllSubjects());
    
    // 获取所有资源类型
    setResourceTypes(getAllResourceTypes());
  }, []);
  
  // 上传前校验
  const beforeUpload = (file) => {
    // 这里可以添加文件类型、大小等校验
    // 由于我们不实际上传，直接返回false取消默认上传行为
    return false;
  };
  
  // 处理文件变化
  const handleFileChange = (info) => {
    let fileList = [...info.fileList];
    
    // 限制只能上传1个文件
    fileList = fileList.slice(-1);
    
    setFileList(fileList);
    
    // 从文件名推断格式，自动填充表单
    if (fileList.length > 0) {
      const fileName = fileList[0].name;
      const fileExt = fileName.split('.').pop().toLowerCase();
      form.setFieldsValue({ format: fileExt.toUpperCase() });
      
      // 计算文件大小并格式化
      const fileSizeInBytes = fileList[0].size;
      let fileSizeStr = '';
      
      if (fileSizeInBytes < 1024) {
        fileSizeStr = fileSizeInBytes + 'B';
      } else if (fileSizeInBytes < 1024 * 1024) {
        fileSizeStr = (fileSizeInBytes / 1024).toFixed(2) + 'KB';
      } else {
        fileSizeStr = (fileSizeInBytes / (1024 * 1024)).toFixed(2) + 'MB';
      }
      
      form.setFieldsValue({ size: fileSizeStr });
    }
  };
  
  // 处理标签输入可见性
  const showTagInput = () => {
    setInputVisible(true);
  };
  
  // 处理标签输入确认
  const handleTagInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue('');
  };
  
  // 处理删除标签
  const handleTagClose = (removedTag) => {
    const newTags = tags.filter(tag => tag !== removedTag);
    setTags(newTags);
  };
  
  // 处理表单提交
  const handleSubmit = (values) => {
    if (fileList.length === 0) {
      message.warning('请上传资源文件');
      return;
    }
    
    setLoading(true);
    
    // 准备资源数据
    const resourceData = {
      title: values.title,
      description: values.description,
      subject: values.subject,
      type: values.type,
      format: values.format,
      url: '/files/' + fileList[0].name, // 模拟URL
      size: values.size,
      uploader: currentUser.id,
      tags: tags
    };
    
    // 上传资源
    const result = uploadResource(resourceData);
    
    if (result) {
      message.success('资源上传成功');
      // 跳转到资源详情页
      navigate(`/resources/${result.id}`);
    } else {
      message.error('资源上传失败');
      setLoading(false);
    }
  };
  
  return (
    <AppLayout>
      <div className="fade-in">
        <Title level={2} className="page-title">上传教学资源</Title>
        
        <Card className="custom-card">
          <Form
            form={form}
            layout="vertical"
            className="custom-form"
            onFinish={handleSubmit}
            initialValues={{
              subject: subjects[0],
              type: resourceTypes[0]
            }}
          >
            <Form.Item
              name="title"
              label="资源标题"
              rules={[{ required: true, message: '请输入资源标题' }]}
            >
              <Input placeholder="请输入资源标题" />
            </Form.Item>
            
            <Form.Item
              name="description"
              label="资源描述"
              rules={[{ required: true, message: '请输入资源描述' }]}
            >
              <TextArea rows={4} placeholder="请输入资源描述" />
            </Form.Item>
            
            <div style={{ display: 'flex', gap: '16px' }}>
              <Form.Item
                name="subject"
                label="学科分类"
                rules={[{ required: true, message: '请选择学科分类' }]}
                style={{ flex: 1 }}
              >
                <Select placeholder="请选择学科分类">
                  {subjects.map(subject => (
                    <Option key={subject} value={subject}>{subject}</Option>
                  ))}
                </Select>
              </Form.Item>
              
              <Form.Item
                name="type"
                label="资源类型"
                rules={[{ required: true, message: '请选择资源类型' }]}
                style={{ flex: 1 }}
              >
                <Select placeholder="请选择资源类型">
                  {resourceTypes.map(type => (
                    <Option key={type} value={type}>{type}</Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            
            <Form.Item label="资源标签">
              <div className="tags-container">
                {tags.map(tag => (
                  <Tag
                    closable
                    key={tag}
                    onClose={() => handleTagClose(tag)}
                    className="custom-tag"
                  >
                    {tag}
                  </Tag>
                ))}
                
                {inputVisible ? (
                  <Input
                    type="text"
                    size="small"
                    style={{ width: 78 }}
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onBlur={handleTagInputConfirm}
                    onPressEnter={handleTagInputConfirm}
                    autoFocus
                  />
                ) : (
                  <Tag onClick={showTagInput} className="custom-tag tag-add">
                    <PlusOutlined /> 添加标签
                  </Tag>
                )}
              </div>
              <Text type="secondary">
                <TagOutlined /> 添加标签有助于其他用户更容易找到您的资源
              </Text>
            </Form.Item>
            
            <Divider />
            
            <Form.Item label="上传文件">
              <Dragger
                name="file"
                fileList={fileList}
                beforeUpload={beforeUpload}
                onChange={handleFileChange}
                maxCount={1}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
                <p className="ant-upload-hint">
                  支持常见文件格式如：PDF、PPT、DOC、MP4等
                </p>
              </Dragger>
            </Form.Item>
            
            <div style={{ display: 'flex', gap: '16px' }}>
              <Form.Item
                name="format"
                label="文件格式"
                rules={[{ required: true, message: '请输入文件格式' }]}
                style={{ flex: 1 }}
              >
                <Input placeholder="自动填充 (如: PDF, DOC, MP4)" disabled />
              </Form.Item>
              
              <Form.Item
                name="size"
                label="文件大小"
                rules={[{ required: true, message: '请输入文件大小' }]}
                style={{ flex: 1 }}
              >
                <Input placeholder="自动填充 (如: 5.2MB)" disabled />
              </Form.Item>
            </div>
            
            <Divider />
            
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" loading={loading}>
                  上传资源
                </Button>
                <Button onClick={() => navigate('/resources')}>取消</Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </AppLayout>
  );
};

export default UploadResource;
