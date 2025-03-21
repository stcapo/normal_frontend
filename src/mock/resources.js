// 模拟资源数据
const resources = [
  {
    id: 1,
    title: '高等数学第一章课件',
    description: '包含高等数学第一章的详细讲解和习题解答',
    subject: '数学',
    type: '课件',
    format: 'PPT',
    url: '/files/math_chapter1.ppt',
    size: '5.2MB',
    uploader: 2, // 对应 users 中的教师ID
    uploadTime: '2023-06-10 09:30:12',
    views: 256,
    downloads: 120,
    rating: 4.7,
    tags: ['高等数学', '微积分', '函数极限'],
    comments: [
      {
        id: 1,
        userId: 4,
        content: '这个课件讲解很清晰，对我理解极限概念很有帮助',
        time: '2023-06-12 14:20:30',
        replies: [
          {
            id: 1,
            userId: 2,
            content: '谢谢你的反馈，如有不懂的地方可以随时提问',
            time: '2023-06-12 16:05:22'
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'C++编程基础教程',
    description: '适合初学者的C++编程教程，包含基础语法和简单实例',
    subject: '计算机科学',
    type: '教案',
    format: 'PDF',
    url: '/files/cpp_basics.pdf',
    size: '3.8MB',
    uploader: 2,
    uploadTime: '2023-05-20 15:22:40',
    views: 342,
    downloads: 180,
    rating: 4.5,
    tags: ['C++', '编程基础', '计算机科学'],
    comments: []
  },
  {
    id: 3,
    title: '英语语法精讲视频',
    description: '详细讲解英语核心语法知识点',
    subject: '英语',
    type: '视频',
    format: 'MP4',
    url: '/files/english_grammar.mp4',
    size: '120MB',
    uploader: 3,
    uploadTime: '2023-07-05 10:15:30',
    views: 189,
    downloads: 95,
    rating: 4.8,
    tags: ['英语', '语法', '学习资料'],
    comments: []
  },
  {
    id: 4,
    title: '物理力学期中测试题',
    description: '大学物理力学部分期中测试题及答案解析',
    subject: '物理',
    type: '试题',
    format: 'DOC',
    url: '/files/physics_midterm.doc',
    size: '1.2MB',
    uploader: 3,
    uploadTime: '2023-04-18 13:40:20',
    views: 276,
    downloads: 220,
    rating: 4.6,
    tags: ['物理', '力学', '测试题'],
    comments: []
  },
  {
    id: 5,
    title: '数据结构与算法分析',
    description: '详细介绍了常见数据结构和算法，并进行了复杂度分析',
    subject: '计算机科学',
    type: '课件',
    format: 'PDF',
    url: '/files/data_structures.pdf',
    size: '8.5MB',
    uploader: 2,
    uploadTime: '2023-08-12 11:20:45',
    views: 312,
    downloads: 170,
    rating: 4.9,
    tags: ['数据结构', '算法', '计算机科学'],
    comments: []
  },
  {
    id: 6,
    title: '文学作品赏析课程',
    description: '中国古代文学作品赏析',
    subject: '文学',
    type: '课件',
    format: 'PPT',
    url: '/files/literature_analysis.ppt',
    size: '4.3MB',
    uploader: 3,
    uploadTime: '2023-09-05 14:10:30',
    views: 178,
    downloads: 85,
    rating: 4.4,
    tags: ['文学', '古代文学', '作品赏析'],
    comments: []
  }
];

export default resources;
