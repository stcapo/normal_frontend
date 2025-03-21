import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Input, Select, Button, Tag, Rate, Typography, List, Badge, Tooltip } from 'antd';
import { 
  SearchOutlined, 
  FileOutlined, 
  FilePdfOutlined, 
  FileWordOutlined, 
  FileExcelOutlined, 
  FilePptOutlined, 
  FileZipOutlined, 
  FileImageOutlined, 
  VideoCameraOutlined, 
  SoundOutlined, 
  DownloadOutlined, 
  StarOutlined, 
  EyeOutlined,
  FilterOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import { useAuth } from '../context/AuthContext';
import { getAllResources, searchResources, getAllSubjects, getAllResourceTypes } from '../utils/resourceUtils';

const { Title, Text } = Typography;
const { Option } = Select;

const ResourceList = () => {
  const { } = useAuth(); // Not using currentUser in this component
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [resourceTypes, setResourceTypes] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('uploadTime');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // 获取所有资源
    const allResources = getAllResources();
    setResources(allResources);
    setFilteredResources(allResources);
    
    // 获取所有学科分类
    setSubjects(getAllSubjects());
    
    // 获取所有资源类型
    setResourceTypes(getAllResourceTypes());
    
    setLoading(false);
  }, []);
  
  // 搜索和筛选资源
  useEffect(() => {
    let result = resources;
    
    // 按关键词搜索
    if (searchText) {
      result = searchResources(searchText);
    } else {
      result = getAllResources();
    }
    
    // 按学科筛选
    if (selectedSubject !== 'all') {
      result = result.filter(resource => resource.subject === selectedSubject);
    }
    
    // 按类型筛选
    if (selectedType !== 'all') {
      result = result.filter(resource => resource.type === selectedType);
    }
    
    // 排序
    if (sortBy === 'uploadTime') {
      result = [...result].sort((a, b) => new Date(b.uploadTime) - new Date(a.uploadTime));
    } else if (sortBy === 'downloads') {
      result = [...result].sort((a, b) => b.downloads - a.downloads);
    } else if (sortBy === 'rating') {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }
    
    setFilteredResources(result);
  }, [resources, searchText, selectedSubject, selectedType, sortBy]);
  
  // 搜索框改变
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };
  
  // 学科筛选改变
  const handleSubjectChange = (value) => {
    setSelectedSubject(value);
  };
  
  // 类型筛选改变
  const handleTypeChange = (value) => {
    setSelectedType(value);
  };
  
  // 排序方式改变
  const handleSortChange = (value) => {
    setSortBy(value);
  };
  
  // 清除所有筛选
  const handleClearFilters = () => {
    setSearchText('');
    setSelectedSubject('all');
    setSelectedType('all');
    setSortBy('uploadTime');
  };
  
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
  
  return (
    <AppLayout>
      <div className="fade-in">
        <Title level={2} className="page-title">教学资源库</Title>
        
        {/* 搜索和筛选区域 */}
        <Card className="custom-card search-container">
          <Row gutter={16} align="middle">
            <Col xs={24} md={8}>
              <Input
                placeholder="搜索资源名称、描述或标签"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={handleSearchChange}
                allowClear
              />
            </Col>
            <Col xs={12} md={4}>
              <Select
                placeholder="选择学科"
                style={{ width: '100%' }}
                value={selectedSubject}
                onChange={handleSubjectChange}
              >
                <Option value="all">全部学科</Option>
                {subjects.map(subject => (
                  <Option key={subject} value={subject}>{subject}</Option>
                ))}
              </Select>
            </Col>
            <Col xs={12} md={4}>
              <Select
                placeholder="选择类型"
                style={{ width: '100%' }}
                value={selectedType}
                onChange={handleTypeChange}
              >
                <Option value="all">全部类型</Option>
                {resourceTypes.map(type => (
                  <Option key={type} value={type}>{type}</Option>
                ))}
              </Select>
            </Col>
            <Col xs={12} md={4}>
              <Select
                placeholder="排序方式"
                style={{ width: '100%' }}
                value={sortBy}
                onChange={handleSortChange}
              >
                <Option value="uploadTime">上传时间</Option>
                <Option value="downloads">下载量</Option>
                <Option value="rating">评分</Option>
              </Select>
            </Col>
            <Col xs={12} md={4}>
              <Button 
                type="primary" 
                icon={<FilterOutlined />} 
                onClick={handleClearFilters}
              >
                清除筛选
              </Button>
            </Col>
          </Row>
        </Card>
        
        {/* 资源列表 */}
        <List
          loading={loading}
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 4,
            xl: 4,
            xxl: 6,
          }}
          dataSource={filteredResources}
          renderItem={resource => (
            <List.Item>
              <Badge.Ribbon 
                text={resource.type} 
                color={typeColors[resource.type] || 'default'}
              >
                <Card 
                  className="custom-card resource-card"
                  hoverable
                  cover={
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                      {getFileIcon(resource.format)}
                    </div>
                  }
                  actions={[
                    <Tooltip title="查看详情">
                      <Link to={`/resources/${resource.id}`}>
                        <EyeOutlined />
                      </Link>
                    </Tooltip>,
                    <Tooltip title={`下载次数: ${resource.downloads}`}>
                      <span>
                        <DownloadOutlined /> {resource.downloads}
                      </span>
                    </Tooltip>,
                    <Tooltip title={`评分: ${resource.rating}`}>
                      <span>
                        <StarOutlined /> {resource.rating}
                      </span>
                    </Tooltip>
                  ]}
                >
                  <Card.Meta
                    title={
                      <Link to={`/resources/${resource.id}`}>
                        <Tooltip title={resource.title}>
                          {resource.title.length > 20 
                            ? resource.title.substring(0, 20) + '...' 
                            : resource.title}
                        </Tooltip>
                      </Link>
                    }
                    description={
                      <>
                        <div className="resource-card-meta">
                          <Tag>{resource.subject}</Tag>
                          <Tag>{resource.format.toUpperCase()}</Tag>
                        </div>
                        <Tooltip title={resource.description}>
                          <div style={{ height: '40px', overflow: 'hidden', marginBottom: '8px' }}>
                            {resource.description.length > 60 
                              ? resource.description.substring(0, 60) + '...' 
                              : resource.description}
                          </div>
                        </Tooltip>
                        <div className="rating-container">
                          <Rate disabled defaultValue={resource.rating} allowHalf />
                        </div>
                      </>
                    }
                  />
                </Card>
              </Badge.Ribbon>
            </List.Item>
          )}
        />
        
        {/* 没有资源时显示提示 */}
        {filteredResources.length === 0 && !loading && (
          <div style={{ textAlign: 'center', margin: '40px 0' }}>
            <Text>未找到符合条件的资源</Text>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ResourceList;
