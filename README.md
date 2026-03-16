# 💰 记账软件 (Bean Finance)

一个基于 **NestJS + Vue 3** 开发的个人记账应用，提供简单、直观、高效的记账体验。

![演示](./img/记账软件_演示.png)

## 🚀 技术栈

### 后端 (Backend)
- `NestJS 11` - Node.js 框架
- `MariaDB` / `MySQL` - 数据库
- `TypeORM` - ORM 框架
- `class-validator` - DTO 验证

### 前端 (Frontend)
- `Vue 3` + `Vite 7` - 构建工具
- `TypeScript` - 全程类型安全
- `Axios` - HTTP 请求
- `Element Plus` - UI 组件库

## 🛠 功能列表

### 核心功能
- ✅ 账单 CRUD - 新增、查询、修改、删除
- ✅ 分类管理 - 支出/收入分类下拉选择
- ✅ 筛选查询 - 按类型、分类、日期范围筛选
- ✅ 实时统计 - 总余额、收入、支出自动计算

### 页面功能
- 📱 导航栏 - 首页、统计、设置三页面
- 📊 统计页面 - 收支概览 + 分类统计
- ⚙️ 设置页面 - 关于信息

### 交互优化
- 💰 金额单位 - 前端元，后端分，避免精度问题
- 🕐 时间显示 - 完整日期时间，UTC+8 时区
- 🎨 浅粉色主题 - 磨砂玻璃质感 UI
- 📱 响应式布局 - 固定导航栏

## 📦 快速开始

### 1. 前置准备
- Node.js (v20+)
- MariaDB / MySQL
- pnpm 或 npm

### 2. 创建数据库
```sql
CREATE DATABASE finance_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. 启动后端
```bash
cd bean_finance
pnpm install
# 配置数据库连接 (src/app.module.ts)
pnpm run start:dev
```
后端默认运行在 http://localhost:3000

### 4. 启动前端
```bash
cd bean_finance_frontend
pnpm install
pnpm run dev
```
前端默认运行在 http://localhost:5173

## 📝 分类列表

### 支出分类
餐饮、交通、购物、娱乐、住房、医疗、教育、通讯、其他

### 收入分类
工资、奖金、投资、其他

## 📊 数据库结构 (Transaction Entity)

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| `id` | number | 主键自增 |
| `amount` | int | 金额 (单位：分) |
| `type` | enum | income(收入) / expense(支出) |
| `category` | string | 账单分类 |
| `note` | string | 备注信息 |
| `recordedAt` | timestamp | 记账时间 |
| `createdAt` | timestamp | 创建时间 |

## 💡 开发心得

- **金额精度**: 全程使用"分"作为整数单位存储，前端展示时转换为"元"
- **时区处理**: 前端统一使用 UTC+8 时区，避免时间显示错乱
- **前后端分离**: 通过 CORS 跨域通信，Axios 封装 API
- **响应式 UI**: Vue computed 实现余额实时计算

---

> 个人练手项目，持续迭代中...
