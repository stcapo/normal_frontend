import React, { useState } from 'react';
import { 
  Typography, 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Tabs, 
  DatePicker,
  Select,
  Radio,
  Space
} from 'antd';
import { 
  UserOutlined, 
  FileOutlined, 
  CloudDownloadOutlined, 
  StarOutlined,
  TeamOutlined,
  BookOutlined
} from '@ant-design/icons';
import AppLayout from '../components/layout/AppLayout';
import stats from '../mock/stats';
import ReactECharts from 'echarts-for-react';

const { Title } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;

const Statistics = () => {
  const [resourceChartType, setResourceChartType] = useState('pie');
  const [timeRange, setTimeRange] = useState('month');
  const [subjectFilter, setSubjectFilter] = useState('all');
  
  // 资源类型分布图表配置
  const getResourceTypesChartOption = () => {
    if (resourceChartType === 'pie') {
      return {
        title: {
          text: '资源类型分布',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: stats.resourceTypes.map(item => item.type)
        },
        series: [
          {
            name: '资源类型',
            type: 'pie',
            radius: '60%',
            center: ['50%', '60%'],
            data: stats.resourceTypes.map(item => ({
              name: item.type,
              value: item.count
            })),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
    } else {
      return {
        title: {
          text: '资源类型分布',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          data: stats.resourceTypes.map(item => item.type)
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '资源数量',
            type: 'bar',
            data: stats.resourceTypes.map(item => item.count),
            itemStyle: {
              color: function(params) {
                const colors = ['#1890ff', '#52c41a', '#faad14', '#722ed1', '#f5222d'];
                return colors[params.dataIndex % colors.length];
              }
            }
          }
        ]
      };
    }
  };
  
  // 学科分布图表配置
  const getSubjectsChartOption = () => {
    return {
      title: {
        text: '学科分布',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: stats.subjects.map(item => item.subject)
      },
      series: [
        {
          name: '学科',
          type: 'pie',
          radius: '60%',
          center: ['50%', '60%'],
          data: stats.subjects.map(item => ({
            name: item.subject,
            value: item.count
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  };
  
  // 上传趋势图表配置
  const getUploadTrendChartOption = () => {
    return {
      title: {
        text: '资源上传趋势',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: stats.monthlyUploads.map(item => item.month)
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '上传数量',
          type: 'line',
          smooth: true,
          data: stats.monthlyUploads.map(item => item.count),
          markPoint: {
            data: [
              { type: 'max', name: '最大值' },
              { type: 'min', name: '最小值' }
            ]
          },
          markLine: {
            data: [
              { type: 'average', name: '平均值' }
            ]
          }
        }
      ]
    };
  };
  
  // 下载趋势图表配置
  const getDownloadTrendChartOption = () => {
    return {
      title: {
        text: '资源下载趋势',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: stats.monthlyDownloads.map(item => item.month)
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '下载数量',
          type: 'line',
          smooth: true,
          data: stats.monthlyDownloads.map(item => item.count),
          markPoint: {
            data: [
              { type: 'max', name: '最大值' },
              { type: 'min', name: '最小值' }
            ]
          },
          markLine: {
            data: [
              { type: 'average', name: '平均值' }
            ]
          }
        }
      ]
    };
  };
  
  // 用户活跃度图表配置
  const getUserActivityChartOption = () => {
    return {
      title: {
        text: '用户活跃度',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['登录次数', '下载次数', '上传次数'],
        bottom: 0
      },
      xAxis: {
        type: 'category',
        data: stats.userActivity.map(item => item.date)
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '登录次数',
          type: 'bar',
          data: stats.userActivity.map(item => item.logins)
        },
        {
          name: '下载次数',
          type: 'bar',
          data: stats.userActivity.map(item => item.downloads)
        },
        {
          name: '上传次数',
          type: 'bar',
          data: stats.userActivity.map(item => item.uploads)
        }
      ]
    };
  };
  
  // 渲染统计卡片
  const renderStatCards = () => {
    return (
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card className="custom-card stat-card">
            <Statistic 
              title="资源总数" 
              value={stats.totals.totalResources} 
              prefix={<FileOutlined />} 
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card className="custom-card stat-card">
            <Statistic 
              title="下载总量" 
              value={stats.totals.totalDownloads} 
              prefix={<CloudDownloadOutlined />} 
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card className="custom-card stat-card">
            <Statistic 
              title="平均评分" 
              value={stats.totals.averageRating} 
              prefix={<StarOutlined />} 
              precision={1}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card className="custom-card stat-card">
            <Statistic 
              title="用户总数" 
              value={stats.totals.totalUsers} 
              prefix={<UserOutlined />} 
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card className="custom-card stat-card">
            <Statistic 
              title="教师数量" 
              value={stats.totals.totalTeachers} 
              prefix={<TeamOutlined />} 
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card className="custom-card stat-card">
            <Statistic 
              title="学生数量" 
              value={stats.totals.totalStudents} 
              prefix={<BookOutlined />} 
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
      </Row>
    );
  };
  
  return (
    <AppLayout>
      <div className="fade-in">
        <Title level={2} className="page-title">数据统计</Title>
        
        {renderStatCards()}
        
        <Card className="custom-card" style={{ marginTop: 24 }}>
          <Tabs defaultActiveKey="resource" onChange={() => {}}>
            <TabPane tab="资源统计" key="resource">
              <div style={{ marginBottom: 16 }}>
                <Space>
                  <Radio.Group 
                    value={resourceChartType} 
                    onChange={e => setResourceChartType(e.target.value)}
                  >
                    <Radio.Button value="pie">饼图</Radio.Button>
                    <Radio.Button value="bar">柱状图</Radio.Button>
                  </Radio.Group>
                  
                  <Select 
                    value={subjectFilter} 
                    onChange={value => setSubjectFilter(value)}
                    style={{ width: 150 }}
                  >
                    <Option value="all">全部学科</Option>
                    {stats.subjects.map(subject => (
                      <Option key={subject.subject} value={subject.subject}>
                        {subject.subject}
                      </Option>
                    ))}
                  </Select>
                </Space>
              </div>
              
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <div className="chart-container">
                    <ReactECharts 
                      option={getResourceTypesChartOption()} 
                      style={{ height: 400 }}
                    />
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  <div className="chart-container">
                    <ReactECharts 
                      option={getSubjectsChartOption()} 
                      style={{ height: 400 }}
                    />
                  </div>
                </Col>
              </Row>
            </TabPane>
            
            <TabPane tab="趋势分析" key="trend">
              <div style={{ marginBottom: 16 }}>
                <Space>
                  <Radio.Group 
                    value={timeRange} 
                    onChange={e => setTimeRange(e.target.value)}
                  >
                    <Radio.Button value="week">最近一周</Radio.Button>
                    <Radio.Button value="month">最近一月</Radio.Button>
                    <Radio.Button value="year">全年</Radio.Button>
                  </Radio.Group>
                  
                  <RangePicker />
                </Space>
              </div>
              
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <div className="chart-container">
                    <ReactECharts 
                      option={getUploadTrendChartOption()} 
                      style={{ height: 400 }}
                    />
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  <div className="chart-container">
                    <ReactECharts 
                      option={getDownloadTrendChartOption()} 
                      style={{ height: 400 }}
                    />
                  </div>
                </Col>
              </Row>
            </TabPane>
            
            <TabPane tab="用户活跃度" key="activity">
              <div className="chart-container">
                <ReactECharts 
                  option={getUserActivityChartOption()} 
                  style={{ height: 400 }}
                />
              </div>
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Statistics;
