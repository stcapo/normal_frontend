// 模拟公告数据
const announcements = [
  {
    id: 1,
    title: '系统更新通知',
    content: '亲爱的用户，我们将于本周六凌晨2点至4点进行系统维护，期间系统将暂停访问。请提前做好准备，由此带来的不便敬请谅解。',
    publisher: 1, // 对应 users 中的管理员ID
    publishTime: '2023-10-15 10:30:00',
    importance: 'high',
    views: 325,
    isActive: true,
  },
  {
    id: 2,
    title: '高等数学期末考试重点提示',
    content: '各位同学注意，高等数学期末考试将重点考察微积分、级数等内容，请认真复习课件中的相关章节。有任何问题可在评论区提问。',
    publisher: 2, // 对应 users 中的教师ID
    publishTime: '2023-10-20 14:15:20',
    importance: 'medium',
    views: 278,
    isActive: true,
  },
  {
    id: 3,
    title: '计算机科学系学术讲座',
    content: '定于下周三下午2点在主教学楼301教室举行"人工智能与未来教育"主题讲座，欢迎各位师生参加。',
    publisher: 2,
    publishTime: '2023-10-25 09:20:15',
    importance: 'medium',
    views: 156,
    isActive: true,
  },
  {
    id: 4,
    title: '新增教学资源通知',
    content: '数学系已上传最新版微积分教程，包含丰富的例题和习题解答，请同学们及时查看下载。',
    publisher: 3,
    publishTime: '2023-10-30 16:45:30',
    importance: 'normal',
    views: 203,
    isActive: true,
  },
  {
    id: 5,
    title: '教学资源系统使用指南',
    content: '为帮助大家更好地使用教学资源系统，我们编写了详细的使用指南，请点击查看完整内容。',
    publisher: 1,
    publishTime: '2023-09-25 11:10:40',
    importance: 'normal',
    views: 418,
    isActive: true,
  }
];

export default announcements;
