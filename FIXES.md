# 修复问题清单

本文档记录了项目启动时遇到的问题及其修复方法。

## 主要错误

### 1. Ant Design 不导出 Comment 组件

**问题描述：**
```
Failed to compile.
Attempted import error: 'Comment' is not exported from 'antd' (imported as 'Comment').
```

**修复方法：**
- 在 `src/components/common` 目录下创建了自定义的 `CommentComponent.js` 文件
- 在 `ResourceDetail.js` 中使用自定义的 CommentComponent 替代 antd 的 Comment
- 在 `App.css` 中添加了自定义的评论组件样式

### 2. 未使用的变量和导入

**问题描述：**
```
WARNING in [eslint]
src\pages\AnnouncementList.js
  Line 11:3:  'Divider' is defined but never used  no-unused-vars
```

以及其他几个组件中的类似警告。

**修复方法：**

1. **AnnouncementList.js**:
   - 从导入语句中移除了未使用的 `Divider` 组件

2. **ForgotPassword.js**:
   - 从 Typography 中移除了未使用的 `Text` 导入
   - 移除了未使用的 `verificationCode` 状态变量

3. **ResourceList.js**:
   - 从导入语句中移除了未使用的 `Space` 组件
   - 从导入语句中移除了未使用的 `getResourcesBySubject` 和 `getResourcesByType` 函数
   - 标注了未使用的 `currentUser` 变量

4. **Statistics.js**:
   - 从导入语句中移除了未使用的 `useEffect` 钩子

5. **UploadResource.js**:
   - 从导入语句中移除了未使用的 `InputNumber` 组件

## 其他改进

- 添加了自定义的评论组件样式，以替代 antd 的 Comment 组件样式
- 修改了部分代码的注释，以更好地解释代码的功能

## 如何运行

修复完成后，项目应该可以正常启动：

```bash
npm start
```

项目将在 http://localhost:3000 上运行。
